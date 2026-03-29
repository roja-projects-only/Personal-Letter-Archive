import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import LoadingIndicator from '../components/LoadingIndicator'
import PrimaryButton from '../components/ui/PrimaryButton'
import LetterCard from '../components/ui/LetterCard'
import FloralDivider from '../components/ui/FloralDivider'
import PaperCard from '../components/ui/PaperCard'
import CornerOrnament from '../components/ui/CornerOrnament'
import { listLetters } from '../api/letters'

const ORNAMENT_SM = 20
import { LIST_STAGGER_MS } from '../lib/motion'
import { logout } from '../api/auth'
import { normalizeLetterList } from '../lib/letters'
import { useToast } from '../hooks/useToast'

export default function WriterDashboard() {
  const navigate = useNavigate()
  const toast = useToast()
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
      .catch((err) => {
        setLetters([])
        toast.error(err.userMessage || 'Could not load letters.')
      })
      .finally(() => setLoading(false))
  }, [toast])

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

        {/* Header */}
        <header className="mb-8 pt-2">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-1 font-sans text-xs uppercase tracking-[3px] text-ink-muted">
                your letters
              </p>
              <h1 className="font-display text-[28px] font-semibold italic leading-none text-ink">
                dashboard
              </h1>
            </div>
            <Link to="/write/new">
              <PrimaryButton type="button">+ new letter</PrimaryButton>
            </Link>
          </div>
          <FloralDivider ornament="✦" className="mt-5" />
        </header>

        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-3 gap-3">
          {[
            { value: loading ? '—' : letters.length, label: 'letters', color: 'text-rose' },
            { value: loading ? '—' : totalReplies, label: 'replies', color: 'text-amber' },
            { value: loading ? '—' : daysSinceFirst, label: 'days', color: 'text-gold' },
          ].map(({ value, label, color }) => (
            <PaperCard key={label} className="relative p-4 text-center">
              <CornerOrnament position="tr" size={ORNAMENT_SM} />
              <p className={`font-display text-3xl font-semibold italic ${color}`}>{value}</p>
              <p className="mt-1 font-sans text-[11px] uppercase tracking-widest text-ink-muted">
                {label}
              </p>
            </PaperCard>
          ))}
        </div>

        {/* Recent letters */}
        <div className="mb-2 flex items-center gap-3">
          <p className="font-sans text-xs uppercase tracking-[3px] text-ink-muted">recent</p>
        </div>

        <div>
          {loading && (
            <LoadingIndicator message="Gathering your letters…" className="py-6" />
          )}
          {!loading && letters.length === 0 && (
            <div className="flex flex-col items-center py-14 text-center">
              <PaperCard ribbon className="max-w-sm p-8">
                <p className="font-serif text-base italic leading-relaxed text-ink-muted">
                  your desk is quiet — begin with a first letter.
                </p>
                <PrimaryButton
                  type="button"
                  className="mt-6"
                  onClick={() => navigate('/write/new')}
                >
                  + new letter
                </PrimaryButton>
              </PaperCard>
            </div>
          )}
          {!loading &&
            letters.length > 0 &&
            recent.map((l, i) => (
              <LetterCard
                key={l.id}
                variant="horizontal"
                title={l.title}
                createdAt={l.createdAt}
                replyCount={l.replyCount ?? 0}
                onCardClick={() => navigate(`/write/letters/${l.id}`)}
                onEditClick={() => navigate(`/write/letters/${l.id}?mode=edit`)}
                animationDelay={`${i * LIST_STAGGER_MS}ms`}
              />
            ))}
        </div>

        <FloralDivider className="my-10 opacity-40" />

        <button
          type="button"
          onClick={signOut}
          className="min-h-[48px] w-full py-3 text-left font-sans text-sm uppercase tracking-widest text-ink-muted underline decoration-transparent transition-colors hover:text-rose hover:decoration-rose/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto"
        >
          sign out
        </button>
      </div>
    </PageShell>
  )
}
