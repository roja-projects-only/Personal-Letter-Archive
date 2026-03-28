import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import PageShell from '../components/PageShell'
import GhostButton from '../components/ui/GhostButton'
import PrimaryButton from '../components/ui/PrimaryButton'
import DecorativeLine from '../components/ui/DecorativeLine'
import Editor from '../components/Editor'
import { deleteLetter, getLetter, listReplies, updateLetter } from '../api/letters'

function formatTs(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return ''
  }
}

export default function WriterLetterDetail() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
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
      } catch {
        if (!cancelled) navigate('/write/dashboard', { replace: true })
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, navigate])

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
    } catch {
      /* toast */
    } finally {
      setSaving(false)
    }
  }

  const doDelete = async () => {
    try {
      await deleteLetter(id)
      navigate('/write/dashboard')
    } catch {
      /* ignore */
    }
  }

  if (loading || !letter) {
    return (
      <PageShell maxWidthClassName="max-w-2xl">
        <p className="font-sans text-sm text-ink-muted">Loading…</p>
      </PageShell>
    )
  }

  return (
    <PageShell maxWidthClassName="max-w-2xl">
      <div className="animate-fade-up">
        {!editMode ? (
          <div className="mb-6 flex items-center justify-between">
            <Link to="/write/dashboard">
              <GhostButton type="button">← dashboard</GhostButton>
            </Link>
            <GhostButton type="button" onClick={() => setSearchParams({ mode: 'edit' })}>
              edit
            </GhostButton>
          </div>
        ) : (
          <div className="mb-6 flex items-center justify-between gap-2">
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

        {!editMode ? (
          <>
            <h1 className="mb-3 font-serif text-[26px] italic text-ink">
              {letter.title?.trim() || 'Letter'}
            </h1>
            <DecorativeLine className="mb-6" />
            <div
              className="letter-body font-serif text-sm leading-[1.9] text-ink [&_p]:mb-3"
              dangerouslySetInnerHTML={{ __html: sanitized }}
            />
          </>
        ) : (
          <>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="a title, if you'd like..."
              className="mb-2 w-full border-0 bg-transparent font-serif text-[26px] italic text-ink outline-none placeholder:text-ink-muted"
            />
            <DecorativeLine className="mb-4" />
            <Editor content={content} onChange={setContent} placeholder="begin here..." />
            {!confirmDelete ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="mt-6 font-sans text-[11px] text-rose-deep underline decoration-transparent hover:decoration-rose-deep"
              >
                delete letter
              </button>
            ) : (
              <div className="mt-6 flex flex-wrap items-center gap-3 font-sans text-[11px] text-ink-muted">
                <span>are you sure? this can&apos;t be undone.</span>
                <button type="button" className="text-rose-deep underline" onClick={doDelete}>
                  confirm
                </button>
                <button type="button" className="underline" onClick={() => setConfirmDelete(false)}>
                  cancel
                </button>
              </div>
            )}
          </>
        )}

        {!editMode && (
          <section className="mt-10">
            <p className="mb-3 font-sans text-[11px] uppercase tracking-[1.5px] text-ink-muted">
              her replies
            </p>
            {sortedReplies.length === 0 ? (
              <p className="font-serif text-sm italic text-ink-muted">no replies yet.</p>
            ) : (
              <ul className="space-y-3">
                {sortedReplies.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-r-xl border-l-2 border-blush bg-rose-light py-3 pl-3.5 pr-3.5"
                  >
                    <p className="mb-1 font-sans text-[11px] text-ink-muted">{formatTs(r.createdAt)}</p>
                    <p className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-ink">
                      {r.content}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </PageShell>
  )
}
