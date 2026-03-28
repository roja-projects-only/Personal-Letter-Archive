import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'

export default function NotFound() {
  return (
    <PageShell maxWidthClassName="max-w-sm">
      <div className="animate-fade-up py-20 text-center">
        <p className="mb-4 font-serif text-lg italic text-ink-muted">nothing here</p>
        <Link to="/" className="font-sans text-sm text-rose underline decoration-transparent hover:decoration-rose">
          go home
        </Link>
      </div>
    </PageShell>
  )
}
