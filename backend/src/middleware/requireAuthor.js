import { verifyAuthorJwt, getCookieNames } from '../lib/jwt.js'
import { logger } from '../lib/logger.js'

export async function requireAuthor(req, res, next) {
  const log = req.log || logger
  try {
    const token = req.cookies?.[getCookieNames().author]
    if (!token) {
      log.debug({ path: req.path }, 'requireAuthor: no cookie')
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const userId = await verifyAuthorJwt(token)
    if (!userId) {
      log.debug({ path: req.path }, 'requireAuthor: empty subject')
      return res.status(401).json({ error: 'Unauthorized' })
    }
    req.userId = userId
    next()
  } catch (err) {
    log.debug({ err, path: req.path }, 'requireAuthor: invalid token')
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
