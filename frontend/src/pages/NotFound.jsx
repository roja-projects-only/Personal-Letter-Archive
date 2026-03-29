import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'
import WaxSeal from '../components/ui/WaxSeal'
import FloralDivider from '../components/ui/FloralDivider'

export default function NotFound() {
  return (
    <PageShell maxWidthClassName="max-w-sm" centered>
      <div className="animate-fade-up flex flex-col items-center py-8 text-center">
        <WaxSeal size={64} letter="?" className="mb-5" />
        <p className="mb-2 font-display text-[28px] font-semibold italic text-ink">nothing here</p>
        <FloralDivider className="mx-auto mb-5 w-32" />
        <Link
          to="/"
          className="inline-flex min-h-[48px] min-w-[120px] items-center justify-center px-4 py-3 font-sans text-sm uppercase tracking-widest text-ink-muted underline decoration-transparent transition-colors hover:text-rose hover:decoration-rose/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          go home
        </Link>
      </div>
    </PageShell>
  )
}
