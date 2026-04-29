/**
 * A small vine/curl SVG placed at a corner of its relatively-positioned parent.
 * position: 'tl' | 'tr' | 'bl' | 'br'
 */
export default function CornerOrnament({ position = 'tl', size = 28 }) {
  const isRight = position === 'tr' || position === 'br'
  const isBottom = position === 'bl' || position === 'br'

  const transforms = []
  if (isRight) transforms.push('scaleX(-1)')
  if (isBottom) transforms.push('scaleY(-1)')

  const style = {
    position: 'absolute',
    width: size,
    height: size,
    [isBottom ? 'bottom' : 'top']: 6,
    [isRight ? 'right' : 'left']: 6,
    transform: transforms.length ? transforms.join(' ') : undefined,
    opacity: 0.50,
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
      <g fill="none" stroke="#9A7000" strokeWidth="1.3" strokeLinecap="round">
        {/* Horizontal vine arm — sweeps right, curls gracefully at tip */}
        <path d="M4 5 C7 4.5 13 4.5 18 5.5 C21.5 6.5 24 9 21 12 C19.5 13.5 17 13.5 15 12.5" />
        {/* Vertical vine arm — drops down, mirrors the horizontal */}
        <path d="M5 4 C4.5 7 4.5 13 5.5 18 C6.5 21.5 9 24 12 21 C13.5 19.5 13.5 17 12.5 15" />
        {/* Leaf at horizontal tip — teardrop pressed against the curl */}
        <path d="M18 4 C21 2.5 24 5 22 7.5 C20 9 17.5 7 18 4Z" fill="#9A7000" fillOpacity="0.60" stroke="none" />
        {/* Leaf at vertical tip */}
        <path d="M4 18 C2.5 21 5 24 7.5 22 C9 20 7 17.5 4 18Z" fill="#9A7000" fillOpacity="0.60" stroke="none" />
        {/* Small mid-stem leaf on horizontal arm */}
        <path d="M13 4 C14 2.5 16 3 15 4.5 C14 5.5 12.5 5 13 4Z" fill="#9A7000" fillOpacity="0.40" stroke="none" />
        {/* Small mid-stem leaf on vertical arm */}
        <path d="M4 13 C2.5 14 3 16 4.5 15 C5.5 14 5 12.5 4 13Z" fill="#9A7000" fillOpacity="0.40" stroke="none" />
        {/* Corner jewel dot */}
        <circle cx="4.5" cy="4.5" r="1.5" fill="#9A7000" fillOpacity="0.80" stroke="none" />
      </g>
    </svg>
  )
}

