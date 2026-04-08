/**
 * A small vine/curl SVG placed at a corner of its relatively-positioned parent.
 * position: 'tl' | 'tr' | 'bl' | 'br'
 */
export default function CornerOrnament({ position = 'tl', size = 28 }) {
  const isRight = position === 'tr' || position === 'br'
  const isBottom = position === 'bl' || position === 'br'

  const style = {
    position: 'absolute',
    width: size,
    height: size,
    [isBottom ? 'bottom' : 'top']: 6,
    [isRight ? 'right' : 'left']: 6,
    transform: `
      ${isRight ? 'scaleX(-1)' : ''}
      ${isBottom ? ' scaleY(-1)' : ''}
    `.trim(),
    opacity: 0.45,
    pointerEvents: 'none',
  }

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-hidden="true"
      style={style}
    >
      {/* Elegant vine corner: two curved strokes meeting at top-left */}
      <g fill="none" stroke="#7a6408" strokeWidth="1.4" strokeLinecap="round">
        {/* Horizontal curl */}
        <path d="M4 4 Q4 4 14 4 Q20 4 22 8 Q24 12 20 14" />
        {/* Vertical curl */}
        <path d="M4 4 Q4 4 4 14 Q4 20 8 22 Q12 24 14 20" />
        {/* Leaf on horizontal */}
        <path d="M18 5 Q22 2 24 6 Q20 8 18 5Z" fill="#7a6408" opacity="0.6" />
        {/* Leaf on vertical */}
        <path d="M5 18 Q2 22 6 24 Q8 20 5 18Z" fill="#7a6408" opacity="0.6" />
        {/* Small dot at corner */}
        <circle cx="4" cy="4" r="1.2" fill="#7a6408" />
      </g>
    </svg>
  )
}
