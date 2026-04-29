import { useId } from 'react'

export default function WaxSeal({ size = 72, letter = '✦', className = '' }) {
  const uid = useId().replace(/:/g, 'x')
  const r = size / 2

  // 12-bump scalloped medallion — classic wax seal silhouette
  const N = 12
  const bumpCenterR = r * 0.81
  const bumpR = r * 0.155
  const discR = r * 0.74
  const bumps = Array.from({ length: N }, (_, i) => {
    const angle = ((360 / N) * i - 90) * (Math.PI / 180)
    return {
      cx: r + Math.cos(angle) * bumpCenterR,
      cy: r + Math.sin(angle) * bumpCenterR,
    }
  })

  return (
    <div className={`animate-seal-appear ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        aria-hidden="true"
        style={{ display: 'block' }}
      >
        <defs>
          {/* Main disc gradient: bright candlelight center, deep amber edge */}
          <radialGradient id={`sg-${uid}`} cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#ffe040" />
            <stop offset="50%" stopColor="#f5b200" />
            <stop offset="100%" stopColor="#996000" />
          </radialGradient>
          {/* Bump gradient: slightly darker than disc */}
          <radialGradient id={`bg-${uid}`} cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#f0ab00" />
            <stop offset="100%" stopColor="#7a4c00" />
          </radialGradient>
          {/* Warm ink-brown shadow — never grey */}
          <filter id={`sf-${uid}`} x="-28%" y="-28%" width="156%" height="156%">
            <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#4a2800" floodOpacity="0.50" />
          </filter>
        </defs>

        {/* Shadow layer: bumps + disc together */}
        <g filter={`url(#sf-${uid})`}>
          {/* Scalloped bumps rendered behind disc */}
          {bumps.map((b, i) => (
            <circle key={i} cx={b.cx} cy={b.cy} r={bumpR} fill={`url(#bg-${uid})`} />
          ))}
          {/* Main disc */}
          <circle cx={r} cy={r} r={discR} fill={`url(#sg-${uid})`} />
          {/* Outer emboss ring */}
          <circle
            cx={r} cy={r} r={discR * 0.87}
            fill="none"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="0.9"
          />
          {/* Inner dashed impression ring */}
          <circle
            cx={r} cy={r} r={discR * 0.60}
            fill="none"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="0.7"
            strokeDasharray={`${r * 0.10} ${r * 0.08}`}
          />
        </g>

        {/* Glyph: dark ink-brown — reads as pressed into the wax */}
        <text
          x="50%"
          y="52%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(55, 30, 0, 0.82)"
          fontSize={size * 0.28}
          fontFamily="Cormorant Garamond, EB Garamond, Georgia, serif"
          fontWeight="700"
          fontStyle="italic"
        >
          {letter}
        </text>
      </svg>
    </div>
  )
}

