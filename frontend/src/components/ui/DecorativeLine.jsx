export default function DecorativeLine({ className = '' }) {
  return (
    <div
      className={`mx-auto h-px w-10 bg-blush ${className}`}
      aria-hidden
    />
  )
}
