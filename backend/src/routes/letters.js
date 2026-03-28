import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { getSessionFromRequest } from '../lib/jwt.js'
import { requireAuthor } from '../middleware/requireAuthor.js'
import repliesRouter from './replies.js'

const router = Router()

router.use('/:letterId/replies', repliesRouter)

function mapLetterListItem(row) {
  const { _count, ...rest } = row
  return {
    ...rest,
    replyCount: _count?.replies ?? 0,
  }
}

/** Require author or recipient JWT */
async function requireReader(req, res, next) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    req.session = session
    next()
  } catch {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

router.get('/', requireReader, async (req, res) => {
  try {
    const letters = await prisma.letter.findMany({
      orderBy: { createdAt: 'asc' },
      include: { _count: { select: { replies: true } } },
    })

    if (req.session.role === 'author') {
      const authorLetters = letters.filter((l) => l.authorId === req.session.id)
      return res.json(authorLetters.map(mapLetterListItem))
    }

    return res.json(letters.map(mapLetterListItem))
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Server error' })
  }
})

router.get('/:id', requireReader, async (req, res) => {
  try {
    const letter = await prisma.letter.findUnique({
      where: { id: req.params.id },
      include: {
        replies: { orderBy: { createdAt: 'asc' } },
        _count: { select: { replies: true } },
      },
    })

    if (!letter) {
      return res.status(404).json({ error: 'Not found' })
    }

    if (req.session.role === 'author' && letter.authorId !== req.session.id) {
      return res.status(404).json({ error: 'Not found' })
    }

    if (req.session.role === 'recipient' && letter.viewedAt == null) {
      const updated = await prisma.letter.update({
        where: { id: letter.id },
        data: { viewedAt: new Date() },
        include: {
          replies: { orderBy: { createdAt: 'asc' } },
          _count: { select: { replies: true } },
        },
      })
      return res.json(mapDetail(updated))
    }

    return res.json(mapDetail(letter))
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Server error' })
  }
})

function mapDetail(letter) {
  const { _count, ...rest } = letter
  return {
    ...rest,
    replyCount: _count?.replies ?? rest.replies?.length ?? 0,
  }
}

router.post('/', requireAuthor, async (req, res) => {
  try {
    const { title, content } = req.body || {}
    if (content == null || String(content).trim() === '') {
      return res.status(400).json({ error: 'Content is required' })
    }
    const letter = await prisma.letter.create({
      data: {
        title: title != null && String(title).trim() !== '' ? String(title).trim() : null,
        content: String(content),
        authorId: req.userId,
      },
      include: { _count: { select: { replies: true } } },
    })
    return res.status(201).json(mapLetterListItem(letter))
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Server error' })
  }
})

router.put('/:id', requireAuthor, async (req, res) => {
  try {
    const existing = await prisma.letter.findUnique({ where: { id: req.params.id } })
    if (!existing || existing.authorId !== req.userId) {
      return res.status(404).json({ error: 'Not found' })
    }
    const { title, content } = req.body || {}
    const letter = await prisma.letter.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && {
          title: title != null && String(title).trim() !== '' ? String(title).trim() : null,
        }),
        ...(content !== undefined && { content: String(content) }),
      },
      include: {
        replies: { orderBy: { createdAt: 'asc' } },
        _count: { select: { replies: true } },
      },
    })
    return res.json(mapDetail(letter))
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/:id', requireAuthor, async (req, res) => {
  try {
    const existing = await prisma.letter.findUnique({ where: { id: req.params.id } })
    if (!existing || existing.authorId !== req.userId) {
      return res.status(404).json({ error: 'Not found' })
    }
    await prisma.letter.delete({ where: { id: req.params.id } })
    return res.json({ ok: true })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Server error' })
  }
})

export default router
