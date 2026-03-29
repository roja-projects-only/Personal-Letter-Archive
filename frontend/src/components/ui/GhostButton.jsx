export default function GhostButton({ children, className = '', type = 'button', ...rest }) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-gold-soft bg-transparent px-4 py-2.5 font-sans text-sm text-ink-muted tracking-wide transition-all duration-200 hover:border-rose hover:bg-rose-light hover:text-rose-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
