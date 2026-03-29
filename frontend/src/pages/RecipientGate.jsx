import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import PaperCard from '../components/ui/PaperCard'
import PrimaryButton from '../components/ui/PrimaryButton'
import PinInput from '../components/PinInput'
import WaxSeal from '../components/ui/WaxSeal'
import FloralDivider from '../components/ui/FloralDivider'
import LoadingIndicator from '../components/LoadingIndicator'
import { verifyRecipient, recipientSession } from '../api/recipient'

export default function RecipientGate() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const [step, setStep] = useState('pin')
  const [pin, setPin] = useState('')
  const [name, setName] = useState('')
  const [shake, setShake] = useState(false)
  const [attemptsLeft, setAttemptsLeft] = useState(5)
  const [lockSeconds, setLockSeconds] = useState(null)
  const [pulseIndex, setPulseIndex] = useState(null)
  const nameInputRef = useRef(null)

  useEffect(() => {
    recipientSession()
      .then(() => navigate('/letters', { replace: true }))
      .catch(() => {})
      .finally(() => setChecking(false))
  }, [navigate])

  useEffect(() => {
    if (lockSeconds == null || lockSeconds <= 0) return undefined
    const t = setInterval(() => {
      setLockSeconds((s) => (s != null && s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(t)
  }, [lockSeconds])

  useEffect(() => {
    if (pulseIndex == null) return undefined
    const t = setTimeout(() => setPulseIndex(null), 220)
    return () => clearTimeout(t)
  }, [pulseIndex])

  const locked = lockSeconds != null && lockSeconds > 0

  /* Auto-advance to name step when PIN is complete */
  useEffect(() => {
    if (step !== 'pin' || locked || pin.length < 4) return undefined
    const t = setTimeout(() => setStep('name'), 300)
    return () => clearTimeout(t)
  }, [pin, step, locked])

  /* Focus name field when entering step 2 (mobile keyboard) */
  useEffect(() => {
    if (step === 'name' && !locked) {
      const id = requestAnimationFrame(() => {
        nameInputRef.current?.focus()
      })
      return () => cancelAnimationFrame(id)
    }
    return undefined
  }, [step, locked])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (lockSeconds != null && lockSeconds > 0) return
    if (pin.length !== 4 || !name.trim()) return
    try {
      await verifyRecipient(pin, name.trim())
      navigate('/letters', { replace: true })
    } catch (err) {
      const status = err.response?.status
      const retryAfter = err.response?.data?.retryAfter
      if (status === 429 && retryAfter != null) {
        setLockSeconds(Number(retryAfter) || 300)
        setAttemptsLeft(0)
        setStep('pin')
        return
      }
      setAttemptsLeft((a) => Math.max(0, a - 1))
      setShake(true)
      setTimeout(() => setShake(false), 450)
    }
  }

  const goBackToPin = () => {
    setStep('pin')
    setPin('')
    setName('')
  }

  const fmtTime = (s) => {
    const m = Math.floor(s / 60)
    const r = s % 60
    return `${m}:${r.toString().padStart(2, '0')}`
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingIndicator message="" />
      </div>
    )
  }

  return (
    <PageShell maxWidthClassName="max-w-sm" centered>
      <div className="animate-fade-up flex flex-col items-center py-6">
        <PaperCard ribbon corners className="flex w-full flex-col items-center gap-4 px-8 py-10">

          <WaxSeal size={80} letter="♡" />

          <p className="font-sans text-xs uppercase tracking-[3px] text-ink-muted">
            something made just
          </p>
          <h1 className="font-display text-[38px] font-semibold italic leading-none text-ink">
            for you
          </h1>

          <FloralDivider className="w-40" />

          <p className="text-center font-serif text-base italic text-ink-muted">
            {step === 'pin' ? 'enter your PIN' : 'now, your name'}
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            {step === 'pin' && (
              <div className="animate-fade-up space-y-4">
                <PinInput
                  value={pin}
                  onChange={setPin}
                  shake={shake}
                  onFilledPulseIndex={setPulseIndex}
                  pulsingIndex={pulseIndex}
                />
                <p className="text-center font-sans text-xs text-ink-muted">4 digits</p>
              </div>
            )}

            {step === 'name' && (
              <div className="animate-fade-up space-y-5">
                <div className="flex justify-center gap-3" aria-hidden="true">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-3 w-3 rounded-full bg-rose shadow-sm ring-1 ring-rose-deep/20"
                    />
                  ))}
                </div>
                <FloralDivider ornament="✦" className="opacity-60" />
                <div>
                  <p className="mb-2 text-center font-sans text-[11px] uppercase tracking-widest text-ink-muted">
                    and your name
                  </p>
                  <input
                    ref={nameInputRef}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="your name…"
                    disabled={locked}
                    autoComplete="name"
                    autoCapitalize="words"
                    autoCorrect="off"
                    enterKeyHint="done"
                    className="w-full rounded-xl border border-gold-soft bg-white px-4 py-3.5 text-center font-serif text-base italic text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-rose focus:bg-cream focus-visible:ring-2 focus-visible:ring-rose/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  />
                </div>
                <PrimaryButton type="submit" disabled={locked || !name.trim()} className="w-full">
                  open ♡
                </PrimaryButton>
                <button
                  type="button"
                  onClick={goBackToPin}
                  disabled={locked}
                  className="w-full py-3 text-center font-sans text-sm text-ink-muted underline decoration-transparent transition-colors hover:text-rose hover:decoration-rose/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:opacity-50"
                >
                  ← change PIN
                </button>
              </div>
            )}
          </form>

          {locked && (
            <p className="text-center font-sans text-sm text-rose-deep">
              too many attempts — try again in {fmtTime(lockSeconds)}.
            </p>
          )}

          {!locked && attemptsLeft < 5 && attemptsLeft > 0 && (
            <p
              className={`text-center font-sans text-sm ${
                attemptsLeft <= 2 ? 'text-rose-deep' : 'text-ink-muted'
              }`}
            >
              {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining
            </p>
          )}
        </PaperCard>
      </div>
    </PageShell>
  )
}
