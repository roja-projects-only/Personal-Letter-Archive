import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import PageShell from '../components/PageShell'
import GhostButton from '../components/ui/GhostButton'
import PrimaryButton from '../components/ui/PrimaryButton'
import DecorativeLine from '../components/ui/DecorativeLine'
import { getLetter, listLetters, postReply } from '../api/letters'
import { letterNumberForId, normalizeLetterList } from '../lib/letters'

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

export default function RecipientLetterDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [letter, setLetter] = useState(null)
  const [allLetters, setAllLetters] = useState([])
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)
  const [sentFlash, setSentFlash] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [lr, listRes] = await Promise.all([getLetter(id), listLetters()])
        if (cancelled) return
        setLetter(lr.data)
        setAllLetters(normalizeLetterList(listRes.data))
      } catch {
        if (!cancelled) navigate('/letters', { replace: true })
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, navigate])

  const replies = letter?.replies ?? []
  const sortedReplies = [...replies].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )
  const letterNo = letter ? letterNumberForId(allLetters, letter.id) : 1

  const sanitized = letter?.content
    ? DOMPurify.sanitize(letter.content, { USE_PROFILES: { html: true } })
    : ''

  const sendReply = async () => {
    if (!replyText.trim()) return
    setError('')
    setSending(true)
    try {
      await postReply(id, replyText.trim())
      setReplyText('')
      setSentFlash(true)
      setTimeout(() => setSentFlash(false), 2000)
      const lr = await getLetter(id)
      setLetter(lr.data)
    } catch {
      setError('Could not send. Try again.')
    } finally {
      setSending(false)
    }
  }

  if (loading || !letter) {
    return (
      <PageShell maxWidthClassName="max-w-lg">
        <p className="font-sans text-sm text-ink-muted">Loading…</p>
      </PageShell>
    )
  }

  return (
    <PageShell maxWidthClassName="max-w-lg">
      <div className="animate-fade-up px-2 pb-10 sm:px-4">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/letters">
            <GhostButton type="button">← back</GhostButton>
          </Link>
          <p className="font-sans text-xs text-ink-muted">{formatDate(letter.createdAt)}</p>
        </div>

        <p className="mb-1 font-sans text-[11px] uppercase tracking-[2px] text-rose">letter no. {letterNo}</p>
        <h1 className="mb-3 font-serif text-[26px] italic text-ink">
          {letter.title?.trim() || 'Letter'}
        </h1>
        <DecorativeLine className="mb-6" />

        <div
          className="letter-body font-serif text-sm leading-[1.9] text-ink [&_p]:mb-3"
          dangerouslySetInnerHTML={{ __html: sanitized }}
        />

        <div className="mt-8 border-t border-border pt-5">
          {sortedReplies.map((r) => (
            <blockquote
              key={r.id}
              className="mb-4 border-l-2 border-blush pl-3 font-serif text-[13px] italic text-ink-muted"
            >
              {r.content}
            </blockquote>
          ))}

          <p className="mb-2 font-sans text-xs tracking-wide text-ink-muted">write something back</p>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="say something..."
            rows={3}
            className="mb-3 w-full min-h-[72px] resize-y rounded-xl border-[1.5px] border-blush bg-rose-light p-3 font-sans text-[13px] text-ink outline-none placeholder:text-ink-muted focus:border-rose"
          />
          {error && <p className="mb-2 font-sans text-xs text-rose-deep">{error}</p>}
          <div className="flex justify-end">
            <PrimaryButton
              type="button"
              disabled={sending || !replyText.trim()}
              onClick={sendReply}
              className={
                sentFlash ? '!bg-green-text !hover:bg-green-text hover:!bg-green-text' : ''
              }
            >
              {sending ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </span>
              ) : sentFlash ? (
                'sent ♡'
              ) : (
                'send ♡'
              )}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
