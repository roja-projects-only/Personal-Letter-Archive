import { useCallback, useEffect, useRef } from 'react'

export default function PinInput({ value, onChange, shake, onFilledPulseIndex, pulsingIndex = null }) {
  const wrapRef = useRef(null)
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

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return undefined
    const onKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault()
        if (value.length < 4) {
          setFromString(value + e.key)
        }
        return
      }
      if (e.key === 'Backspace') {
        e.preventDefault()
        setFromString(value.slice(0, -1))
      }
    }
    const onPaste = (e) => {
      const text = e.clipboardData?.getData('text') || ''
      if (!/\d/.test(text)) return
      e.preventDefault()
      setFromString(`${value}${text}`)
    }
    el.addEventListener('keydown', onKeyDown)
    el.addEventListener('paste', onPaste)
    return () => {
      el.removeEventListener('keydown', onKeyDown)
      el.removeEventListener('paste', onPaste)
    }
  }, [value, setFromString])

  const cells = [0, 1, 2, 3]

  return (
    <div
      ref={wrapRef}
      role="group"
      aria-label="PIN"
      tabIndex={0}
      className={`flex justify-center gap-2 outline-none ${shake ? 'animate-shake' : ''}`}
    >
      {cells.map((i) => {
        const filled = i < value.length
        const ch = filled ? '•' : ''
        return (
          <div
            key={i}
            className={`flex h-[52px] w-11 select-none items-center justify-center rounded-[10px] border-[1.5px] font-sans text-xl text-rose transition-colors ${
              filled ? 'border-rose bg-rose-light' : 'border-border bg-card'
            } ${pulsingIndex === i ? 'animate-pulse-pop' : ''}`}
          >
            {ch}
          </div>
        )
      })}
    </div>
  )
}
