import { Router } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma.js'
import { signAuthorJwt, getCookieNames, cookieBaseOptions } from '../lib/jwt.js'
import { requireAuthor } from '../middleware/requireAuthor.js'
import { logger } from '../lib/logger.js'

const router = Router()
const { author: AUTHOR_COOKIE } = getCookieNames()

router.post('/login', async (req, res, next) => {
  const log = req.log || logger
  try {
    const { email, password } = req.body || {}
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }
    const user = await prisma.user.findUnique({ where: { email: String(email).trim().toLowerCase() } })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const ok = await bcrypt.compare(String(password), user.passwordHash)
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const token = await signAuthorJwt(user.id)
    res.cookie(AUTHOR_COOKIE, token, cookieBaseOptions())
    return res.json({ ok: true })
  } catch (e) {
    log.error({ err: e, route: 'POST /api/auth/login' }, 'Auth login failed')
    next(e)
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie(AUTHOR_COOKIE, { ...cookieBaseOptions(), maxAge: 0 })
  return res.json({ ok: true })
})

router.get('/me', requireAuthor, async (req, res, next) => {
  const log = req.log || logger
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, createdAt: true },
    })
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    return res.json(user)
  } catch (e) {
    log.error({ err: e, route: 'GET /api/auth/me', userId: req.userId }, 'Auth me failed')
    next(e)
  }
})

/** Diagnostic endpoint — returns non-sensitive session info to help debug cookie issues.
 *  Safe to call from Safari Web Inspector or a proxy tool.
 *  Example: open https://your-api.up.railway.app/api/auth/cookie-check in Safari.
 */
router.get('/cookie-check', (req, res) => {
  const cookieNames = getCookieNames()
  const cookieOpts = cookieBaseOptions()
  return res.json({
    receivedCookies: Object.keys(req.cookies || {}),
    hasAuthorCookie: Boolean(req.cookies?.[cookieNames.author]),
    hasRecipientCookie: Boolean(req.cookies?.[cookieNames.recipient]),
    cookieConfig: {
      sameSite: cookieOpts.sameSite,
      secure: cookieOpts.secure,
    },
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || '(not set)',
  })
})

export default router
