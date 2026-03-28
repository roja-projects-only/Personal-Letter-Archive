import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import LetterCard from '../components/ui/LetterCard'
import { listLetters } from '../api/letters'
import { recipientLogout } from '../api/recipient'
import { letterExcerpt } from '../lib/excerpt'
import { normalizeLetterList } from '../lib/letters'

export default function RecipientLetterList() {
  const navigate = useNavigate()
  const [letters, setLetters] = useState([])
  const [loading, setLoading] = useState(true)

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
        <header className="mb-6 flex flex-wrap items-end justify-between gap-2 border-b border-border pb-4">
          <div>
            <p className="mb-1 font-sans text-[11px] uppercase tracking-[2px] text-ink-muted">
              letters written
            </p>
            <h1 className="font-serif text-[26px] italic text-ink">for her</h1>
          </div>
          <p className="font-sans text-xs text-ink-muted">
            {sorted.length} letter{sorted.length !== 1 ? 's' : ''}
          </p>
        </header>

        {loading && <p className="font-sans text-sm text-ink-muted">Loading…</p>}

        {!loading && sorted.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="mb-3 font-serif text-2xl text-ink-muted">♡</span>
            <p className="max-w-xs font-serif text-base italic text-ink-muted">
              nothing here yet. check back soon.
            </p>
          </div>
        )}

        <div>
          {sorted.map((l) => (
            <LetterCard
              key={l.id}
              title={l.title}
              createdAt={l.createdAt}
              excerpt={letterExcerpt(l.content)}
              viewedAt={l.viewedAt}
              replyCount={l.replyCount ?? 0}
              onCardClick={() => navigate(`/letters/${l.id}`)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={leave}
          className="mt-12 w-full text-center font-sans text-[11px] text-ink-muted underline decoration-transparent hover:decoration-ink-muted"
        >
          leave
        </button>
      </div>
    </PageShell>
  )
}
