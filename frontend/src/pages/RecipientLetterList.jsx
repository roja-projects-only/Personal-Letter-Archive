import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import LoadingIndicator from '../components/LoadingIndicator'
import LetterCard from '../components/ui/LetterCard'
import FloralDivider from '../components/ui/FloralDivider'
import WaxSeal from '../components/ui/WaxSeal'
import { listLetters } from '../api/letters'
import { recipientLogout } from '../api/recipient'
import { letterExcerpt } from '../lib/excerpt'
import { normalizeLetterList } from '../lib/letters'
import { LIST_STAGGER_MS } from '../lib/motion'

export default function RecipientLetterList() {
  const navigate = useNavigate()
  const [letters, setLetters] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmLeave, setConfirmLeave] = useState(false)

  useEffect(() => {
    listLetters()
      .then((res) => setLetters(normalizeLetterList(res.data)))
      .catch(() => setLetters([]))
      .finally(() => setLoading(false))
  }, [])

  const sorted = [...letters].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  const leave = async () => {
    try {
      await recipientLogout()
    } catch {
      /* ignore */
    }
    navigate('/', { replace: true })
  }

  return (
    <PageShell maxWidthClassName="max-w-xl">
      <div className="animate-fade-up">

        {/* Header */}
        <header className="mb-8 pt-4 text-center">
          <p className="mb-1 font-sans text-xs uppercase tracking-[3px] text-ink-muted">
            letters written
          </p>
          <h1 className="font-display text-[34px] font-semibold italic leading-tight text-ink">
            for her
          </h1>
          <FloralDivider ornament="✦" className="mx-auto mt-3 mb-3 w-48" />
          <p className="font-sans text-xs text-ink-muted">
            {sorted.length} letter{sorted.length !== 1 ? 's' : ''}
          </p>
        </header>

        {loading && (
          <LoadingIndicator message="Gathering your letters…" className="py-8" />
        )}

        {/* Empty state */}
        {!loading && sorted.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <WaxSeal size={64} letter="♡" className="mb-4" />
            <p className="max-w-xs font-serif text-base italic text-ink-muted">
              nothing here yet — check back soon.
            </p>
          </div>
        )}

        {/* Cards with stagger */}
        <div>
          {sorted.map((l, i) => (
            <LetterCard
              key={l.id}
              title={l.title}
              createdAt={l.createdAt}
              excerpt={letterExcerpt(l.content)}
              viewedAt={l.viewedAt}
              replyCount={l.replyCount ?? 0}
              onCardClick={() => navigate(`/letters/${l.id}`)}
              animationDelay={`${i * LIST_STAGGER_MS}ms`}
            />
          ))}
        </div>

        <FloralDivider className="my-10 opacity-50" />

        {confirmLeave ? (
          <div className="flex items-center justify-center gap-4">
            <span className="font-sans text-sm text-ink-muted">leave?</span>
            <button
              type="button"
              onClick={leave}
              className="font-sans text-sm text-rose-deep underline underline-offset-2 transition-colors hover:text-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              yes, leave
            </button>
            <button
              type="button"
              onClick={() => setConfirmLeave(false)}
              className="font-sans text-sm text-ink-muted underline underline-offset-2 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmLeave(true)}
            className="min-h-[48px] w-full py-3 text-center font-sans text-sm uppercase tracking-widest text-ink-muted underline decoration-transparent transition-colors hover:text-rose hover:decoration-rose/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            leave
          </button>
        )}
      </div>
    </PageShell>
  )
}
