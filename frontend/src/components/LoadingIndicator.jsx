import WaxSeal from './ui/WaxSeal'

/**
 * Thematic loading state — respects prefers-reduced-motion via .animate-seal-pulse in index.css.
 */
export default function LoadingIndicator({ message = 'Opening the letters…', className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-12 ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <WaxSeal size={56} letter="✦" className="animate-seal-pulse opacity-90" />
      <p className="max-w-xs text-center font-serif text-sm italic text-ink-muted">{message}</p>
    </div>
  )
}
