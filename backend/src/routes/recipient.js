import { Router } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma.js'
import { signRecipientJwt, getCookieNames, cookieBaseOptions } from '../lib/jwt.js'
import { requireRecipient } from '../middleware/requireRecipient.js'
import { recordPinFailure, clearPinFailures, checkPinLocked } from '../middleware/rateLimit.js'

const router = Router()
const { recipient: RECIPIENT_COOKIE } = getCookieNames()

router.post('/verify', async (req, res) => {
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
      return res.status(401).json({ error: 'Invalid PIN or name' })
    }

    await clearPinFailures(req)
    const token = await signRecipientJwt(recipient.id)
    res.cookie(RECIPIENT_COOKIE, token, cookieBaseOptions())
    return res.json({ ok: true })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Server error' })
  }
})

router.get('/session', requireRecipient, async (req, res) => {
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
    console.error(e)
    return res.status(500).json({ error: 'Server error' })
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie(RECIPIENT_COOKIE, { ...cookieBaseOptions(), maxAge: 0 })
  return res.json({ ok: true })
})

export default router
