import { verifyRecipientJwt, getCookieNames } from '../lib/jwt.js'

export async function requireRecipient(req, res, next) {
  try {
    const token = req.cookies?.[getCookieNames().recipient]
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const recipientId = await verifyRecipientJwt(token)
    if (!recipientId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    req.recipientId = recipientId
    next()
  } catch {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
