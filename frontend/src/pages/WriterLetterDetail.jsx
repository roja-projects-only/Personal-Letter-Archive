import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import PageShell from '../components/PageShell'
import LoadingIndicator from '../components/LoadingIndicator'
import GhostButton from '../components/ui/GhostButton'
import PrimaryButton from '../components/ui/PrimaryButton'
import FloralDivider from '../components/ui/FloralDivider'
import PaperCard from '../components/ui/PaperCard'
import Editor from '../components/Editor'
import { deleteLetter, getLetter, listReplies, updateLetter } from '../api/letters'
import { useToast } from '../hooks/useToast'

function formatTs(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return ''
  }
}

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

export default function WriterLetterDetail() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()
  const editMode = searchParams.get('mode') === 'edit'

  const [letter, setLetter] = useState(null)
  const [replies, setReplies] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [lr, rr] = await Promise.all([
          getLetter(id),
          listReplies(id).catch(() => ({ data: null })),
        ])
        if (cancelled) return
        const L = lr.data
        setLetter(L)
        setTitle(L.title || '')
        setContent(L.content || '')
        const raw = rr?.data
        const fromApi = Array.isArray(raw) ? raw : raw?.replies
        const merged = fromApi?.length ? fromApi : L.replies ?? []
        setReplies(merged)
      } catch (err) {
        if (!cancelled) {
          toast.error(err.userMessage || 'Could not load this letter.')
          navigate('/write/dashboard', { replace: true })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, navigate, toast])

  const sortedReplies = [...replies].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )

  const sanitized = letter?.content
    ? DOMPurify.sanitize(letter.content, { USE_PROFILES: { html: true } })
    : ''

  const saveEdit = async () => {
    setSaving(true)
    try {
      await updateLetter(id, {
        title: title.trim() || null,
        content: content || '<p></p>',
      })
      const lr = await getLetter(id)
      const L = lr.data
      setLetter(L)
      setTitle(L.title || '')
      setContent(L.content || '')
      try {
        const rr = await listReplies(id)
        const raw = rr.data
        const fromApi = Array.isArray(raw) ? raw : raw?.replies
        setReplies(fromApi?.length ? fromApi : L.replies ?? [])
      } catch {
        setReplies(L.replies ?? [])
      }
      setSearchParams({}, { replace: true })
    } catch (err) {
      toast.error(err.userMessage || 'Could not save changes.')
    } finally {
      setSaving(false)
    }
  }

  const doDelete = async () => {
    try {
      await deleteLetter(id)
      navigate('/write/dashboard')
    } catch (err) {
      toast.error(err.userMessage || 'Could not delete letter.')
    }
  }

  if (loading || !letter) {
    return (
      <PageShell maxWidthClassName="max-w-2xl">
        <LoadingIndicator message="Gathering this letter…" />
      </PageShell>
    )
  }

  return (
    <PageShell maxWidthClassName="max-w-2xl">
      <div className="animate-fade-up">

        {/* Nav row */}
        {!editMode ? (
          <div className="mb-7 flex items-center justify-between pt-2">
            <Link to="/write/dashboard">
              <GhostButton type="button">← dashboard</GhostButton>
            </Link>
            <GhostButton type="button" onClick={() => setSearchParams({ mode: 'edit' })}>
              edit
            </GhostButton>
          </div>
        ) : (
          <div className="mb-7 flex items-center justify-between gap-2 pt-2">
            <GhostButton
              type="button"
              onClick={() => {
                setSearchParams({}, { replace: true })
                setTitle(letter.title || '')
                setContent(letter.content || '')
              }}
            >
              cancel
            </GhostButton>
            <PrimaryButton type="button" disabled={saving} onClick={saveEdit}>
              update letter
            </PrimaryButton>
          </div>
        )}

        {/* View mode */}
        {!editMode ? (
          <>
            <p className="mb-1 font-sans text-xs uppercase tracking-[3px] text-gold">
              {formatDate(letter.createdAt)}
            </p>
            <h1 className="mb-3 font-display text-[28px] font-semibold italic leading-snug text-ink">
              {letter.title?.trim() || 'Letter'}
            </h1>
            <FloralDivider ornament="❧" className="mb-7" />
            <PaperCard corners ribbon className="animate-letter-reveal p-6 sm:p-8">
              <div
                className="letter-body font-serif text-base leading-[1.8] text-ink"
                dangerouslySetInnerHTML={{ __html: sanitized }}
              />
            </PaperCard>
          </>
        ) : (
          /* Edit mode */
          <>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="a title, if you'd like…"
              className="mb-3 w-full border-0 bg-transparent font-display text-[28px] font-semibold italic text-ink outline-none placeholder:text-ink-muted focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-rose/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            />
            <FloralDivider ornament="❧" className="mb-5" />
            <PaperCard className="p-5 sm:p-7">
              <Editor content={content} onChange={setContent} placeholder="begin here…" />
            </PaperCard>
            <div className="mt-6">
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="min-h-[48px] rounded-lg py-3 font-sans text-sm text-rose-deep underline decoration-transparent transition-colors hover:decoration-rose-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  delete letter
                </button>
              ) : (
                <div className="flex flex-col gap-3 font-sans text-sm text-ink-muted sm:flex-row sm:flex-wrap sm:items-center">
                  <span className="py-1">are you sure? this can&apos;t be undone.</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="min-h-[44px] rounded-lg px-4 py-2 text-rose-deep underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      onClick={doDelete}
                    >
                      confirm
                    </button>
                    <button
                      type="button"
                      className="min-h-[44px] rounded-lg px-4 py-2 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      onClick={() => setConfirmDelete(false)}
                    >
                      cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Her replies */}
        {!editMode && (
          <section className="mt-10">
            <FloralDivider ornament="✦" className="mb-6 opacity-60" />
            <p className="mb-4 font-sans text-xs uppercase tracking-[3px] text-ink-muted">
              her replies
            </p>
            {sortedReplies.length === 0 ? (
              <p className="font-serif text-sm italic text-ink-muted">no replies yet.</p>
            ) : (
              <div className="space-y-3">
                {sortedReplies.map((r) => (
                  <PaperCard key={r.id} className="p-4">
                    <p className="font-sans text-[11px] text-gold tracking-wide">
                      {formatTs(r.createdAt)}
                    </p>
                    <p className="mt-1.5 font-serif text-sm italic leading-relaxed text-ink-muted">
                      {r.content}
                    </p>
                  </PaperCard>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </PageShell>
  )
}
