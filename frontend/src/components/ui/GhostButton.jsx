export default function GhostButton({ children, className = '', type = 'button', ...rest }) {
  return (
    <button
      type={type}
      className={`rounded-full border border-gold-soft bg-transparent px-3 py-1.5 font-sans text-xs text-ink-muted tracking-wide transition-all duration-200 hover:border-rose hover:bg-rose-light hover:text-rose-deep ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
