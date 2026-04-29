export default function GhostButton({ children, className = '', type = 'button', ...rest }) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-gold-soft bg-transparent px-4 py-2.5 font-sans text-sm text-ink-muted tracking-wide transition-all duration-200 hover:border-gold hover:bg-rose-light hover:-translate-y-px hover:shadow-[0_2px_8px_rgba(180,120,0,0.12)] hover:text-ink active:scale-[0.97] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/50 focus-visible:ring-offset-2 focus-visible:ring-offset-parchment ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
