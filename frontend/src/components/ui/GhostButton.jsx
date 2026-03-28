export default function GhostButton({ children, className = '', type = 'button', ...rest }) {
  return (
    <button
      type={type}
      className={`rounded-full border border-border bg-transparent px-3 py-1.5 font-sans text-xs text-ink-muted transition-colors hover:border-rose hover:text-ink ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
