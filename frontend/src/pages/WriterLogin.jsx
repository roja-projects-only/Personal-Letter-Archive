import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import DecorativeLine from '../components/ui/DecorativeLine'
import PrimaryButton from '../components/ui/PrimaryButton'
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
    } catch {
      setError('incorrect email or password')
      setShake(true)
      setTimeout(() => setShake(false), 450)
    }
  }

  return (
    <PageShell maxWidthClassName="max-w-xs">
      <div className="animate-fade-up flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-10">
        <div className={`w-full rounded-xl ${shake ? 'animate-shake' : ''}`}>
          <p className="mb-1 text-center font-sans text-[11px] uppercase tracking-[2px] text-ink-muted">
            writer&apos;s entrance
          </p>
          <h1 className="mb-3 text-center font-serif text-[28px] italic text-ink">welcome back</h1>
          <DecorativeLine className="my-3.5" />
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="w-email" className="mb-1 block font-sans text-xs text-ink-muted">
                email
              </label>
              <input
                id="w-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="username"
                className="w-full rounded-[10px] border-[1.5px] border-border bg-card px-3 py-2.5 font-sans text-sm text-ink outline-none focus:border-rose"
              />
            </div>
            <div>
              <label htmlFor="w-password" className="mb-1 block font-sans text-xs text-ink-muted">
                password
              </label>
              <div className="relative">
                <input
                  id="w-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="w-full rounded-[10px] border-[1.5px] border-border bg-card px-3 py-2.5 pr-10 font-sans text-sm text-ink outline-none focus:border-rose"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 font-sans text-[11px] text-ink-muted hover:text-ink"
                >
                  {showPw ? 'hide' : 'show'}
                </button>
              </div>
            </div>
            <PrimaryButton type="submit" className="mt-2 w-full">
              enter
            </PrimaryButton>
            {error && <p className="text-center font-sans text-[13px] text-rose-deep">{error}</p>}
          </form>
        </div>
      </div>
    </PageShell>
  )
}
