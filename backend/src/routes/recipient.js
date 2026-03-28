import { Router } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma.js'
import { signRecipientJwt, getCookieNames, cookieBaseOptions } from '../lib/jwt.js'
import { requireRecipient } from '../middleware/requireRecipient.js'
import { recordPinFailure, clearPinFailures, checkPinLocked } from '../middleware/rateLimit.js'
import { logger } from '../lib/logger.js'

const router = Router()
const { recipient: RECIPIENT_COOKIE } = getCookieNames()

function clientIp(req) {
  return req.ip || req.connection?.remoteAddress || 'unknown'
}

router.post('/verify', async (req, res, next) => {
  const log = req.log || logger
  try {
    const locked = await checkPinLocked(req)
    if (locked.locked) {
      return res.status(429).json({
        error: 'Too many attempts. Try again in 5 minutes.',
        retryAfter: locked.retryAfter,
      })
    }

    const { pin, name } = req.body || {}
    const pinStr = pin != null ? String(pin).replace(/\D/g, '') : ''
    const nameStr = name != null ? String(name).trim() : ''

    if (pinStr.length !== 4 || !nameStr) {
      const fail = await recordPinFailure(req)
      if (fail.locked) {
        return res.status(429).json({
          error: 'Too many attempts. Try again in 5 minutes.',
          retryAfter: fail.retryAfter,
        })
      }
      log.warn({ ip: clientIp(req), attemptCount: fail.count }, 'Recipient verify: invalid input')
      return res.status(401).json({ error: 'Invalid PIN or name' })
    }

    const recipient = await prisma.recipient.findFirst()
    if (!recipient) {
      return res.status(503).json({ error: 'Recipient not configured' })
    }

    const nameMatch =
      recipient.name.trim().toLocaleLowerCase() === nameStr.toLocaleLowerCase()
    const pinMatch = await bcrypt.compare(pinStr, recipient.pinHash)

    if (!nameMatch || !pinMatch) {
      const fail = await recordPinFailure(req)
      if (fail.locked) {
        return res.status(429).json({
          error: 'Too many attempts. Try again in 5 minutes.',
          retryAfter: fail.retryAfter,
        })
      }
      log.warn(
        { ip: clientIp(req), attemptCount: fail.count, nameOk: nameMatch, pinOk: pinMatch },
        'Recipient verify: wrong PIN or name',
      )
      return res.status(401).json({ error: 'Invalid PIN or name' })
    }

    await clearPinFailures(req)
    const token = await signRecipientJwt(recipient.id)
    res.cookie(RECIPIENT_COOKIE, token, cookieBaseOptions())
    return res.json({ ok: true })
  } catch (e) {
    log.error({ err: e, route: 'POST /api/recipient/verify' }, 'Recipient verify error')
    next(e)
  }
})

router.get('/session', requireRecipient, async (req, res, next) => {
  const log = req.log || logger
  try {
    const recipient = await prisma.recipient.findUnique({
      where: { id: req.recipientId },
      select: { id: true, name: true, createdAt: true },
    })
    if (!recipient) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    return res.json(recipient)
  } catch (e) {
    log.error({ err: e, route: 'GET /api/recipient/session', recipientId: req.recipientId }, 'Session read failed')
    next(e)
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie(RECIPIENT_COOKIE, { ...cookieBaseOptions(), maxAge: 0 })
  return res.json({ ok: true })
})

export default router
