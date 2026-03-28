import { verifyAuthorJwt, getCookieNames } from '../lib/jwt.js'

export async function requireAuthor(req, res, next) {
  try {
    const token = req.cookies?.[getCookieNames().author]
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const userId = await verifyAuthorJwt(token)
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    req.userId = userId
    next()
  } catch {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
