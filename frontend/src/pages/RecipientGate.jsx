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
  const [pin, setPin] = useState('')
  const [name, setName] = useState('')
  const [shake, setShake] = useState(false)
  const [attemptsLeft, setAttemptsLeft] = useState(5)
  const [lockSeconds, setLockSeconds] = useState(null)
  const [pulseIndex, setPulseIndex] = useState(null)
  const [submitting, setSubmitting] = useState(false)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (locked || submitting) return
    if (pin.length !== 4 || !name.trim()) return
    setSubmitting(true)
    try {
      await verifyRecipient(pin, name.trim())
      navigate('/letters', { replace: true })
    } catch (err) {
      const status = err.response?.status
      const retryAfter = err.response?.data?.retryAfter
      if (status === 429 && retryAfter != null) {
        setLockSeconds(Number(retryAfter) || 300)
        setAttemptsLeft(0)
        return
      }
      setAttemptsLeft((a) => Math.max(0, a - 1))
      setShake(true)
      setTimeout(() => setShake(false), 450)
    } finally {
      setSubmitting(false)
    }
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

  const canSubmit = !locked && !submitting && pin.length === 4 && name.trim().length > 0

  return (
    <PageShell maxWidthClassName="max-w-xs" centered>
      <div className="animate-fade-up flex flex-col items-center py-4 sm:py-6">
        <PaperCard corners className="flex w-full flex-col items-center gap-5 px-7 py-10 sm:px-10 sm:py-12">

          {/* WaxSeal: the ceremonial centerpiece */}
          <WaxSeal size={110} letter="♡" className="mt-1" />

          {/* Title block */}
          <div className="flex flex-col items-center gap-1.5 text-center">
            <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-ink-muted">
              a letter
            </p>
            <h1 className="font-display text-[40px] font-semibold italic leading-none text-ink">
              sealed for you
            </h1>
          </div>

          <FloralDivider className="w-36 opacity-70" />

          <p className="max-w-[22ch] text-center font-serif text-[15px] italic leading-relaxed text-ink-muted">
            enter your name and PIN to read your letters
          </p>

          {/* Single-step form: name + PIN together */}
          <form onSubmit={handleSubmit} className="mt-1 w-full space-y-4">
            {/* Name */}
            <div>
              <label className="sr-only" htmlFor="recipient-name">
                Your name
              </label>
              <input
                id="recipient-name"
                ref={nameInputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="your name…"
                disabled={locked || submitting}
                autoComplete="name"
                autoCapitalize="words"
                autoCorrect="off"
                enterKeyHint="next"
                style={{ fontSize: 'max(16px, 1rem)' }}
                className="w-full rounded-xl border border-gold-soft bg-parchment/95 px-4 py-3.5 text-center font-serif italic text-ink outline-none transition-colors placeholder:text-ink-muted/60 focus:border-rose focus:bg-cream focus-visible:ring-2 focus-visible:ring-rose/50 focus-visible:ring-offset-2 focus-visible:ring-offset-parchment disabled:opacity-50"
              />
            </div>

            {/* PIN */}
            <PinInput
              value={pin}
              onChange={setPin}
              shake={shake}
              onFilledPulseIndex={setPulseIndex}
              pulsingIndex={pulseIndex}
            />

            {/* Inline feedback */}
            {locked && (
              <p className="text-center font-sans text-sm text-rose-deep" role="alert">
                too many attempts — try again in {fmtTime(lockSeconds)}.
              </p>
            )}
            {!locked && attemptsLeft < 5 && attemptsLeft > 0 && (
              <p
                className={`text-center font-sans text-sm ${
                  attemptsLeft <= 2 ? 'text-rose-deep' : 'text-ink-muted'
                }`}
                role="alert"
              >
                {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining
              </p>
            )}

            <PrimaryButton type="submit" disabled={!canSubmit} className="mt-1 w-full">
              {submitting ? 'opening…' : 'open the letters'}
            </PrimaryButton>
          </form>

        </PaperCard>
      </div>
    </PageShell>
  )
}
