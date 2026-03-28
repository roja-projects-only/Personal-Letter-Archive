import { Router } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma.js'
import { signAuthorJwt, getCookieNames, cookieBaseOptions } from '../lib/jwt.js'
import { requireAuthor } from '../middleware/requireAuthor.js'

const router = Router()
const { author: AUTHOR_COOKIE } = getCookieNames()

router.post('/login', async (req, res) => {
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
    console.error(e)
    return res.status(500).json({ error: 'Server error' })
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie(AUTHOR_COOKIE, { ...cookieBaseOptions(), maxAge: 0 })
  return res.json({ ok: true })
})

router.get('/me', requireAuthor, async (req, res) => {
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
    console.error(e)
    return res.status(500).json({ error: 'Server error' })
  }
})

export default router
