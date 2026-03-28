export default function FloralDivider({ ornament = '❧', className = '' }) {
  return (
    <div className={`floral-divider ${className}`} aria-hidden="true">
      <span>{ornament}</span>
    </div>
  )
}
