import { useCallback, useMemo, useState } from 'react'
import { ToastContext } from '../context/toastContext'

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const push = useCallback((message, variant) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const value = useMemo(
    () => ({
      error: (message) => push(message, 'error'),
      success: (message) => push(message, 'success'),
    }),
    [push],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[100] flex max-w-sm flex-col gap-2 p-2"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-xl border px-4 py-3 font-sans text-sm shadow-sm ${
              t.variant === 'success'
                ? 'border-green-text/30 bg-green-soft text-green-text'
                : 'border-rose-deep/30 bg-rose-light text-rose-deep'
            }`}
            role="status"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
