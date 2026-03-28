import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import PageShell from '../components/PageShell'
import GhostButton from '../components/ui/GhostButton'
import PrimaryButton from '../components/ui/PrimaryButton'
import FloralDivider from '../components/ui/FloralDivider'
import PaperCard from '../components/ui/PaperCard'
import { getLetter, listLetters, postReply } from '../api/letters'
import { letterNumberForId, normalizeLetterList } from '../lib/letters'
import { useToast } from '../hooks/useToast'

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
  const toast = useToast()
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
      } catch (err) {
        if (!cancelled) {
          toast.error(err.userMessage || 'Could not load this letter.')
          navigate('/letters', { replace: true })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, navigate, toast])

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
    } catch (err) {
      const msg = err.userMessage || 'Could not send. Try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setSending(false)
    }
  }

  if (loading || !letter) {
    return (
      <PageShell maxWidthClassName="max-w-lg">
        <p className="py-16 text-center font-serif text-sm italic text-ink-muted">Loading…</p>
      </PageShell>
    )
  }

  return (
    <PageShell maxWidthClassName="max-w-lg">
      <div className="animate-fade-up pb-10">

        {/* Nav row */}
        <div className="mb-8 flex items-center justify-between pt-2">
          <Link to="/letters">
            <GhostButton type="button">← back</GhostButton>
          </Link>
          <p className="font-sans text-xs text-ink-muted">{formatDate(letter.createdAt)}</p>
        </div>

        {/* Letter number + title */}
        <p className="mb-1 font-sans text-[10px] uppercase tracking-[3px] text-gold">
          letter no. {letterNo}
        </p>
        <h1 className="mb-3 font-display text-[30px] font-semibold italic leading-snug text-ink">
          {letter.title?.trim() || 'Letter'}
        </h1>
        <FloralDivider ornament="❧" className="mb-7" />

        {/* Letter body */}
        <PaperCard corners ribbon className="animate-letter-reveal p-6 sm:p-8">
          <div
            className="letter-body font-serif text-base leading-[2] text-ink [&_p]:mb-4"
            dangerouslySetInnerHTML={{ __html: sanitized }}
          />
        </PaperCard>

        {/* Replies + reply box */}
        <div className="mt-10">
          <FloralDivider ornament="✦" className="mb-7 opacity-60" />

          {sortedReplies.length > 0 && (
            <div className="mb-6 space-y-3">
              {sortedReplies.map((r) => (
                <PaperCard key={r.id} className="p-4">
                  <p className="font-serif text-sm italic leading-relaxed text-ink-muted">
                    {r.content}
                  </p>
                  <p className="mt-2 font-sans text-[10px] text-gold tracking-wide">
                    {formatDate(r.createdAt)}
                  </p>
                </PaperCard>
              ))}
            </div>
          )}

          <p className="mb-2 font-sans text-[11px] uppercase tracking-widest text-ink-muted">
            write something back
          </p>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onFocus={(e) => {
              e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            }}
            placeholder="say something…"
            rows={4}
            className="mb-3 min-h-[100px] w-full scroll-mt-4 resize-y rounded-xl border border-gold-soft bg-parchment p-4 font-serif text-base italic leading-relaxed text-ink outline-none placeholder:text-ink-muted focus:border-rose focus:bg-cream"
          />
          {error && <p className="mb-2 font-sans text-xs text-rose-deep">{error}</p>}
          <div className="flex justify-end">
            <PrimaryButton
              type="button"
              disabled={sending || !replyText.trim()}
              onClick={sendReply}
              className={sentFlash ? '!bg-green-text' : ''}
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
