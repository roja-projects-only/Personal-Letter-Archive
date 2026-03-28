export default function PageShell({ children, maxWidthClassName = 'max-w-xl' }) {
  return (
    <div className="min-h-screen bg-cream">
      <div className={`mx-auto w-full px-6 py-8 ${maxWidthClassName}`}>{children}</div>
    </div>
  )
}
