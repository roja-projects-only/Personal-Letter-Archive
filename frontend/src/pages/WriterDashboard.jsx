import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import PrimaryButton from '../components/ui/PrimaryButton'
import LetterCard from '../components/ui/LetterCard'
import { listLetters } from '../api/letters'
import { logout } from '../api/auth'
import { normalizeLetterList } from '../lib/letters'

export default function WriterDashboard() {
  const navigate = useNavigate()
  const [letters, setLetters] = useState([])
  const [loading, setLoading] = useState(true)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    listLetters()
      .then((res) => setLetters(normalizeLetterList(res.data)))
      .catch(() => setLetters([]))
      .finally(() => setLoading(false))
  }, [])

  const sortedNewest = [...letters].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
  const recent = sortedNewest.slice(0, 8)

  const totalReplies = letters.reduce((acc, l) => acc + (l.replyCount ?? 0), 0)
  const oldest = [...letters].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )[0]
  const daysSinceFirst = useMemo(() => {
    if (!oldest) return 0
    return Math.max(
      0,
      Math.floor((now - new Date(oldest.createdAt).getTime()) / (86400 * 1000)),
    )
  }, [oldest, now])

  const signOut = async () => {
    try {
      await logout()
    } catch {
      /* ignore */
    }
    navigate('/write', { replace: true })
  }

  return (
    <PageShell maxWidthClassName="max-w-2xl">
      <div className="animate-fade-up">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
          <div>
            <p className="mb-1 font-sans text-[11px] uppercase tracking-[2px] text-ink-muted">your letters</p>
            <h1 className="font-serif text-[20px] italic text-ink">dashboard</h1>
          </div>
          <Link to="/write/new">
            <PrimaryButton type="button">+ new letter</PrimaryButton>
          </Link>
        </header>

        <div className="mb-8 grid grid-cols-3 gap-3">
          <div className="rounded-[10px] border border-border bg-card p-4 text-center">
            <p className="font-serif text-2xl text-rose">{loading ? '—' : letters.length}</p>
            <p className="mt-1 font-sans text-[11px] text-ink-muted">letters</p>
          </div>
          <div className="rounded-[10px] border border-border bg-card p-4 text-center">
            <p className="font-serif text-2xl text-amber">{loading ? '—' : totalReplies}</p>
            <p className="mt-1 font-sans text-[11px] text-ink-muted">replies</p>
          </div>
          <div className="rounded-[10px] border border-border bg-card p-4 text-center">
            <p className="font-serif text-2xl text-ink">{loading ? '—' : daysSinceFirst}</p>
            <p className="mt-1 font-sans text-[11px] text-ink-muted">days</p>
          </div>
        </div>

        <p className="mb-2.5 font-sans text-[11px] uppercase tracking-[1.5px] text-ink-muted">recent</p>
        <div className="space-y-0">
          {loading && <p className="font-sans text-sm text-ink-muted">Loading…</p>}
          {!loading &&
            recent.map((l) => (
              <LetterCard
                key={l.id}
                variant="horizontal"
                title={l.title}
                createdAt={l.createdAt}
                replyCount={l.replyCount ?? 0}
                onCardClick={() => navigate(`/write/letters/${l.id}`)}
                onEditClick={() => navigate(`/write/letters/${l.id}?mode=edit`)}
              />
            ))}
        </div>

        <button
          type="button"
          onClick={signOut}
          className="mt-10 font-sans text-[11px] text-ink-muted underline decoration-transparent hover:decoration-ink-muted"
        >
          sign out
        </button>
      </div>
    </PageShell>
  )
}
