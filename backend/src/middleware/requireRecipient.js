import { verifyRecipientJwt, getCookieNames } from '../lib/jwt.js'
import { logger } from '../lib/logger.js'

export async function requireRecipient(req, res, next) {
  const log = req.log || logger
  try {
    const token = req.cookies?.[getCookieNames().recipient]
    if (!token) {
      log.debug({ path: req.path }, 'requireRecipient: no cookie')
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const recipientId = await verifyRecipientJwt(token)
    if (!recipientId) {
      log.debug({ path: req.path }, 'requireRecipient: empty subject')
      return res.status(401).json({ error: 'Unauthorized' })
    }
    req.recipientId = recipientId
    next()
  } catch (err) {
    log.debug({ err, path: req.path }, 'requireRecipient: invalid token')
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
