import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { requireAuthor } from '../middleware/requireAuthor.js'
import { requireRecipient } from '../middleware/requireRecipient.js'
import { logger } from '../lib/logger.js'

const router = Router({ mergeParams: true })

router.post('/', requireRecipient, async (req, res, next) => {
  const log = req.log || logger
  try {
    const { letterId } = req.params
    const { content } = req.body || {}
    if (content == null || String(content).trim() === '') {
      return res.status(400).json({ error: 'Content is required' })
    }

    const letter = await prisma.letter.findUnique({ where: { id: letterId } })
    if (!letter) {
      return res.status(404).json({ error: 'Not found' })
    }

    const reply = await prisma.reply.create({
      data: {
        content: String(content).trim(),
        letterId,
        recipientId: req.recipientId,
      },
    })
    return res.status(201).json(reply)
  } catch (e) {
    log.error(
      { err: e, route: 'POST /api/letters/:letterId/replies', letterId: req.params.letterId },
      'Create reply failed',
    )
    next(e)
  }
})

router.get('/', requireAuthor, async (req, res, next) => {
  const log = req.log || logger
  try {
    const { letterId } = req.params
    const letter = await prisma.letter.findUnique({ where: { id: letterId } })
    if (!letter || letter.authorId !== req.userId) {
      return res.status(404).json({ error: 'Not found' })
    }

    const replies = await prisma.reply.findMany({
      where: { letterId },
      orderBy: { createdAt: 'asc' },
    })
    return res.json(replies)
  } catch (e) {
    log.error(
      { err: e, route: 'GET /api/letters/:letterId/replies', letterId: req.params.letterId },
      'List replies failed',
    )
    next(e)
  }
})

export default router
