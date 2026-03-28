import { useCallback, useEffect, useRef } from 'react'

export default function PinInput({ value, onChange, shake, onFilledPulseIndex, pulsingIndex = null }) {
  const hiddenRef = useRef(null)
  const prevLen = useRef(value.length)

  const setFromString = useCallback(
    (next) => {
      const cleaned = next.replace(/\D/g, '').slice(0, 4)
      onChange(cleaned)
    },
    [onChange],
  )

  useEffect(() => {
    if (value.length > prevLen.current && value.length <= 4) {
      onFilledPulseIndex?.(value.length - 1)
    }
    prevLen.current = value.length
  }, [value, onFilledPulseIndex])

  const cells = [0, 1, 2, 3]

  return (
    <div
      className={`relative mx-auto flex w-full max-w-[15rem] justify-center ${shake ? 'animate-shake' : ''}`}
    >
      {/* Real input: opens numeric keyboard on mobile */}
      <input
        ref={hiddenRef}
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="one-time-code"
        maxLength={4}
        value={value}
        onChange={(e) => setFromString(e.target.value)}
        aria-label="PIN"
        className="absolute inset-0 z-20 h-[56px] w-full cursor-text opacity-0"
      />

      {/* Visual cells (non-interactive; taps hit the overlay input) */}
      <div className="pointer-events-none relative z-10 flex justify-center gap-3">
        {cells.map((i) => {
          const filled = i < value.length
          const ch = filled ? '•' : ''
          return (
            <div
              key={i}
              className={`flex h-14 w-12 select-none items-center justify-center rounded-xl border-[1.5px] font-serif text-2xl text-rose-deep shadow-sm transition-all duration-200 ${
                filled
                  ? 'border-rose bg-rose-light shadow-rose/10'
                  : 'border-gold-soft bg-parchment'
              } ${pulsingIndex === i ? 'animate-pulse-pop' : ''}`}
            >
              {ch}
            </div>
          )
        })}
      </div>
    </div>
  )
}
