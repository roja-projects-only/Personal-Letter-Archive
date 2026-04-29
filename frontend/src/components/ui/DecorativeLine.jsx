export default function DecorativeLine({ className = '' }) {
  return (
    <div
      className={`mx-auto h-px w-14 bg-gold-soft/55 ${className}`}
      aria-hidden
    />
  )
}
