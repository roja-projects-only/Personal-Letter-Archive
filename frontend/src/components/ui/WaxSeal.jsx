export default function WaxSeal({ size = 72, letter = '✦', className = '' }) {
  const r = size / 2
  const petals = 8
  const petalRx = r * 0.38
  const petalRy = r * 0.22

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
          <radialGradient id="sealGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffd600" />
            <stop offset="60%" stopColor="#f5c000" />
            <stop offset="100%" stopColor="#c49000" />
          </radialGradient>
          <filter id="sealShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#1a1200" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Star-burst petals */}
        <g transform={`translate(${r},${r})`} filter="url(#sealShadow)">
          {Array.from({ length: petals }).map((_, i) => (
            <ellipse
              key={i}
              cx={0}
              cy={-(r * 0.55)}
              rx={petalRy}
              ry={petalRx}
              fill="url(#sealGrad)"
              transform={`rotate(${(360 / petals) * i})`}
              opacity="0.9"
            />
          ))}
          {/* Center circle */}
          <circle cx={0} cy={0} r={r * 0.52} fill="url(#sealGrad)" />
          {/* Inner ring */}
          <circle
            cx={0}
            cy={0}
            r={r * 0.44}
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.8"
          />
        </g>

        {/* Letter / glyph */}
        <text
          x="50%"
          y="54%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(255,255,255,0.92)"
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
