import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import DecorativeLine from '../components/ui/DecorativeLine'
import PrimaryButton from '../components/ui/PrimaryButton'
import PinInput from '../components/PinInput'
import { verifyRecipient } from '../api/recipient'

export default function RecipientGate() {
  const navigate = useNavigate()
  const [pin, setPin] = useState('')
  const [name, setName] = useState('')
  const [shake, setShake] = useState(false)
  const [attemptsLeft, setAttemptsLeft] = useState(5)
  const [lockSeconds, setLockSeconds] = useState(null)
  const [pulseIndex, setPulseIndex] = useState(null)

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
        return
      }
      setAttemptsLeft((a) => Math.max(0, a - 1))
      setShake(true)
      setTimeout(() => setShake(false), 450)
    }
  }

  const locked = lockSeconds != null && lockSeconds > 0
  const fmtTime = (s) => {
    const m = Math.floor(s / 60)
    const r = s % 60
    return `${m}:${r.toString().padStart(2, '0')}`
  }

  return (
    <PageShell maxWidthClassName="max-w-sm">
      <div className="animate-fade-up flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-10">
        <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-blush font-serif text-2xl text-rose-deep">
          ♡
        </div>
        <p className="mb-1 font-sans text-[11px] uppercase tracking-[2px] text-ink-muted">
          something made just
        </p>
        <h1 className="mb-3 font-serif text-[32px] italic text-ink">for you</h1>
        <DecorativeLine className="my-3.5" />
        <p className="mb-5 font-sans text-[13px] text-ink-muted">enter your pin to continue</p>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <PinInput
            value={pin}
            onChange={setPin}
            shake={shake}
            onFilledPulseIndex={setPulseIndex}
            pulsingIndex={pulseIndex}
          />
          <p className="text-center font-sans text-xs text-ink-muted">and your name</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="your name..."
            disabled={locked}
            className="w-full rounded-[10px] border-[1.5px] border-border bg-card py-3 text-center font-sans text-sm text-ink outline-none placeholder:text-ink-muted focus:border-rose"
          />
          <PrimaryButton type="submit" disabled={locked || pin.length !== 4 || !name.trim()} className="w-full">
            open ♡
          </PrimaryButton>
        </form>

        {locked && (
          <p className="mt-4 text-center font-sans text-[11px] text-rose-deep">
            too many attempts. try again in {fmtTime(lockSeconds)}.
          </p>
        )}

        {!locked && attemptsLeft < 5 && attemptsLeft > 0 && (
          <p
            className={`mt-3 text-center font-sans text-[11px] ${
              attemptsLeft <= 2 ? 'text-rose-deep' : 'text-blush'
            }`}
          >
            {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining
          </p>
        )}
      </div>
    </PageShell>
  )
}
