import { useCallback, useEffect, useRef, useState } from 'react'

export default function PinInput({ value, onChange, shake, onFilledPulseIndex, pulsingIndex = null }) {
  const hiddenRef = useRef(null)
  const prevLen = useRef(value.length)
  const [focused, setFocused] = useState(false)

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
  const activeIdx = value.length < 4 ? value.length : -1

  return (
    <div
      className={`relative mx-auto w-full max-w-[15rem] rounded-2xl p-1 transition-all duration-200 hover:ring-2 hover:ring-gold/40 ${focused ? 'ring-2 ring-rose/50' : ''} ${shake ? 'animate-shake' : ''}`}
    >
      <div className="relative flex justify-center">
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
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label="PIN"
          className="absolute inset-0 z-20 h-[56px] w-full cursor-text text-base opacity-0"
        />

        {/* Visual cells (non-interactive; taps hit the overlay input) */}
        <div className="pointer-events-none relative z-10 flex justify-center gap-3">
          {cells.map((i) => {
            const filled = i < value.length
            const isActive = focused && i === activeIdx
            const cellClass = filled
              ? 'border-rose bg-rose-light shadow-rose/10'
              : isActive
                ? 'border-rose bg-rose-light ring-2 ring-rose/30 shadow-sm'
                : 'border-gold-soft bg-parchment'

            return (
              <div
                key={i}
                className={`flex h-14 w-12 select-none items-center justify-center rounded-xl border-[1.5px] font-serif text-2xl text-rose-deep shadow-sm transition-all duration-200 ${cellClass} ${pulsingIndex === i ? 'animate-pulse-pop' : ''}`}
              >
                {filled ? '•' : isActive ? <span className="animate-blink leading-none">|</span> : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
