import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import PrimaryButton from '../components/ui/PrimaryButton'
import WaxSeal from '../components/ui/WaxSeal'
import FloralDivider from '../components/ui/FloralDivider'
import PaperCard from '../components/ui/PaperCard'
import { login } from '../api/auth'

export default function WriterLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/write/dashboard', { replace: true })
    } catch (err) {
      setError(err.userMessage || 'incorrect email or password')
      setShake(true)
      setTimeout(() => setShake(false), 450)
    }
  }

  return (
    <PageShell maxWidthClassName="max-w-xs" centered>
      <div className="animate-fade-up flex flex-col items-center py-6">

        <WaxSeal size={72} letter="W" className="mb-5" />

        <p className="mb-1 font-sans text-xs uppercase tracking-[3px] text-ink-muted">
          writer&apos;s entrance
        </p>
        <h1 className="mb-4 font-display text-[34px] font-semibold italic leading-none text-ink">
          welcome back
        </h1>

        <FloralDivider className="mb-7 w-36" />

        <PaperCard ribbon corners className={`w-full p-6 pb-safe ${shake ? 'animate-shake' : ''}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="w-email" className="mb-1.5 block font-sans text-[11px] uppercase tracking-widest text-ink-muted">
                email
              </label>
              <input
                id="w-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="username"
                className="w-full rounded-xl border border-gold-soft bg-white px-4 py-3.5 font-sans text-base text-ink outline-none transition-colors focus:border-rose focus:bg-cream focus-visible:ring-2 focus-visible:ring-rose/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              />
            </div>
            <div>
              <label htmlFor="w-password" className="mb-1.5 block font-sans text-[11px] uppercase tracking-widest text-ink-muted">
                password
              </label>
              <div className="relative">
                <input
                  id="w-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-gold-soft bg-white px-4 py-3.5 pr-14 font-sans text-base text-ink outline-none transition-colors focus:border-rose focus:bg-cream focus-visible:ring-2 focus-visible:ring-rose/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-1 top-1/2 flex h-10 min-w-10 -translate-y-1/2 items-center justify-center rounded-lg px-2 font-sans text-sm text-ink-muted hover:bg-rose-light hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? 'hide' : 'show'}
                </button>
              </div>
            </div>

            <PrimaryButton type="submit" className="mt-1 w-full">
              enter
            </PrimaryButton>

            {error && (
              <p className="text-center font-serif text-base italic text-rose-deep">{error}</p>
            )}
          </form>
        </PaperCard>
      </div>
    </PageShell>
  )
}
