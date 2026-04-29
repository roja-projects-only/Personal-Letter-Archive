import { useId } from 'react'

export default function WaxSeal({ size = 72, letter = '✦', className = '' }) {
  const uid = useId().replace(/:/g, 'x')
  const r = size / 2

  // Scalloped wax seal: single unified path via quadratic bezier arcs.
  // Each arc swells outward between valley points sitting on sealR.
  const N = 14          // 14 bumps — tight, fine scallop
  const sealR = r * 0.80   // valley radius
  const bumpH = r * 0.11   // how far each bump protrudes beyond sealR

  const sealPath = (() => {
    const pts = []
    for (let i = 0; i < N; i++) {
      const a0 = ((360 / N) * i - 90) * (Math.PI / 180)
      const a1 = ((360 / N) * (i + 0.5) - 90) * (Math.PI / 180)
      const a2 = ((360 / N) * (i + 1) - 90) * (Math.PI / 180)
      // Valley points on sealR
      const v0x = r + Math.cos(a0) * sealR
      const v0y = r + Math.sin(a0) * sealR
      // Bezier control / peak sits at sealR + bumpH
      const cpx = r + Math.cos(a1) * (sealR + bumpH)
      const cpy = r + Math.sin(a1) * (sealR + bumpH)
      // Next valley
      const v1x = r + Math.cos(a2) * sealR
      const v1y = r + Math.sin(a2) * sealR
      if (i === 0) pts.push(`M${v0x.toFixed(2)},${v0y.toFixed(2)}`)
      pts.push(`Q${cpx.toFixed(2)},${cpy.toFixed(2)} ${v1x.toFixed(2)},${v1y.toFixed(2)}`)
    }
    return pts.join(' ') + 'Z'
  })()

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
          {/* Candlelight: bright warm centre, deep amber-honey at edge */}
          <radialGradient id={`sg-${uid}`} cx="36%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#ffe566" />
            <stop offset="42%" stopColor="#f5ab00" />
            <stop offset="100%" stopColor="#7a4800" />
          </radialGradient>
          {/* Warm mahogany shadow — never neutral grey */}
          <filter id={`sf-${uid}`} x="-32%" y="-32%" width="164%" height="164%">
            <feDropShadow dx="0" dy="4" stdDeviation="7" floodColor="#2e1200" floodOpacity="0.55" />
          </filter>
        </defs>

        <g filter={`url(#sf-${uid})`}>
          {/* Unified scalloped seal body */}
          <path d={sealPath} fill={`url(#sg-${uid})`} />
          {/* Emboss ring: subtle highlight just inside the scallop valleys */}
          <circle
            cx={r} cy={r} r={sealR * 0.88}
            fill="none"
            stroke="rgba(255,255,255,0.20)"
            strokeWidth="0.9"
          />
          {/* Inner dashed impression — the die mark */}
          <circle
            cx={r} cy={r} r={sealR * 0.60}
            fill="none"
            stroke="rgba(255,255,255,0.13)"
            strokeWidth="0.7"
            strokeDasharray={`${r * 0.09} ${r * 0.07}`}
          />
        </g>

        {/* Glyph: dark ink-brown, pressed into wax (not glowing out) */}
        <text
          x="50%"
          y="52%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(48, 22, 0, 0.80)"
          fontSize={size * 0.30}
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



