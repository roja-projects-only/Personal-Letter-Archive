import { useState } from 'react'

/**
 * Full-viewport decorative botanical layer (fixed, non-interactive).
 * Delicate light petals on the deep amber-night background.
 */

const PETALS = [
  { x: 320, y: 220, r: 10, rot: 22, drift: 0, duration: 11, delay: 0 },
  { x: 580, y: 180, r: 9, rot: -15, drift: 1, duration: 14, delay: 1.2 },
  { x: 720, y: 280, r: 12, rot: 48, drift: 2, duration: 9, delay: 0.4 },
  { x: 900, y: 200, r: 8, rot: -40, drift: 0, duration: 16, delay: 2.1 },
  { x: 1050, y: 340, r: 11, rot: 12, drift: 1, duration: 10, delay: 3 },
  { x: 480, y: 420, r: 8, rot: 65, drift: 2, duration: 13, delay: 0.8 },
  { x: 650, y: 520, r: 9, rot: -22, drift: 0, duration: 12, delay: 4.2 },
  { x: 820, y: 480, r: 10, rot: 30, drift: 1, duration: 15, delay: 1.5 },
  { x: 400, y: 650, r: 9, rot: -55, drift: 2, duration: 11, delay: 2.8 },
  { x: 1000, y: 620, r: 8, rot: 18, drift: 0, duration: 14, delay: 5 },
  { x: 250, y: 380, r: 11, rot: -30, drift: 1, duration: 10, delay: 0.2 },
  { x: 1180, y: 320, r: 10, rot: 55, drift: 2, duration: 12, delay: 3.6 },
  { x: 520, y: 720, r: 9, rot: -12, drift: 0, duration: 13, delay: 1.8 },
  { x: 920, y: 680, r: 12, rot: 40, drift: 1, duration: 9, delay: 4.8 },
  { x: 200, y: 560, r: 8, rot: 72, drift: 2, duration: 16, delay: 0.6 },
  { x: 1280, y: 180, r: 9, rot: -48, drift: 0, duration: 11, delay: 2.4 },
]

const DRIFT_NAMES = ['petalDrift1', 'petalDrift2', 'petalDrift3']

function RoseBloom({ cx, cy, scale = 1 }) {
  const petals = 8
  const s = 28 * scale
  return (
    <g transform={`translate(${cx},${cy})`}>
      {Array.from({ length: petals }).map((_, i) => (
        <ellipse
          key={i}
          cx={0}
          cy={-s * 0.55}
          rx={s * 0.22}
          ry={s * 0.48}
          fill="rgba(255,220,0,0.55)"
          transform={`rotate(${(360 / petals) * i})`}
          opacity={0.9}
        />
      ))}
      <circle cx={0} cy={0} r={s * 0.2} fill="rgba(255,214,0,0.8)" opacity={0.9} />
      <circle cx={0} cy={0} r={s * 0.08} fill="rgba(255,245,120,0.6)" opacity={0.6} />
    </g>
  )
}

function Leaf({ x, y, rot, flip = false }) {
  const sx = flip ? -1 : 1
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${sx},1)`}>
      <path
        d="M0 0 Q12 -18 28 -8 Q18 4 0 0 M0 0 Q8 14 22 10"
        fill="none"
        stroke="rgba(255,214,0,0.65)"
        strokeWidth={1.4}
        strokeLinecap="round"
        opacity={0.8}
      />
      <path
        d="M2 -2 Q14 -12 24 -6"
        fill="none"
        stroke="rgba(255,224,0,0.5)"
        strokeWidth={0.8}
        strokeLinecap="round"
        opacity={0.6}
      />
    </g>
  )
}

function BranchSpray({ x, y, rot }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      <path
        d="M0 0 Q-8 40 -4 85 Q0 110 12 130"
        fill="none"
        stroke="rgba(255,214,0,0.6)"
        strokeWidth={1.6}
        strokeLinecap="round"
        opacity={0.7}
      />
      <ellipse cx={-6} cy={35} rx={8} ry={14} fill="rgba(255,214,0,0.42)" opacity={0.8} transform="rotate(-25 -6 35)" />
      <ellipse cx={4} cy={72} rx={7} ry={12} fill="rgba(255,214,0,0.36)" opacity={0.7} transform="rotate(18 4 72)" />
      <circle cx={8} cy={105} r={5} fill="rgba(255,214,0,0.5)" opacity={0.7} />
    </g>
  )
}

function MicroPetal({ x, y, r, rot, driftIndex, durationSec, delaySec, allowMotion }) {
  const name = DRIFT_NAMES[driftIndex % 3]
  const motionStyle =
    allowMotion ?
      {
        animation: `${name} ${durationSec}s ease-in-out infinite`,
        animationDelay: `${delaySec}s`,
        willChange: 'transform',
        transformBox: 'fill-box',
        transformOrigin: 'center',
      }
    : undefined

  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      <ellipse cx={0} cy={0} rx={r} ry={r * 1.6} fill="rgba(255,214,0,0.6)" opacity={0.9} style={motionStyle} />
    </g>
  )
}

export default function BackgroundScene() {
  const [allowDrift] = useState(
    () =>
      typeof window !== 'undefined' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full min-h-full min-w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bgRoseFade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,214,0,0.45)" stopOpacity="1" />
            <stop offset="100%" stopColor="rgba(220,170,0,0.28)" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Candlelight halo — single warm source, candle between writer and page */}
        <ellipse cx={720} cy={340} rx={520} ry={310} fill="rgba(255,183,28,0.09)" opacity={1} />
        <ellipse cx={720} cy={310} rx={260} ry={155} fill="rgba(255,208,60,0.07)" opacity={1} />

        {/* Top vine border */}
        <path
          d="M0 40 Q180 20 360 45 T720 35 T1080 50 T1440 38"
          fill="none"
          stroke="rgba(255,214,0,0.55)"
          strokeWidth={1.2}
          strokeLinecap="round"
          opacity={1}
        />
        <path
          d="M0 55 Q200 75 400 50 T800 60 T1200 48 T1440 58"
          fill="none"
          stroke="rgba(255,220,0,0.4)"
          strokeWidth={0.9}
          strokeLinecap="round"
          opacity={1}
        />

        {/* Bottom vine border */}
        <path
          d="M0 860 Q220 880 440 855 T880 865 T1320 850 L1440 862"
          fill="none"
          stroke="rgba(255,214,0,0.55)"
          strokeWidth={1.2}
          strokeLinecap="round"
          opacity={1}
        />
        <path
          d="M0 845 Q240 820 480 840 T960 830 T1440 848"
          fill="none"
          stroke="rgba(255,220,0,0.4)"
          strokeWidth={0.9}
          strokeLinecap="round"
          opacity={1}
        />

        {/* Left-center and right-center large roses */}
        <g opacity={0.38} transform="translate(50, 420) rotate(-12)">
          <RoseBloom cx={0} cy={0} scale={1.5} />
          <Leaf x={-50} y={20} rot={-30} />
          <Leaf x={45} y={15} rot={40} flip />
        </g>
        <g opacity={0.38} transform="translate(1390, 460) rotate(8)">
          <RoseBloom cx={0} cy={0} scale={1.45} />
          <Leaf x={-40} y={-25} rot={-140} />
          <Leaf x={35} y={28} rot={50} flip />
        </g>

        {/* Top-left cluster */}
        <g opacity={0.50} transform="translate(80, 70) rotate(-8)">
          <RoseBloom cx={0} cy={0} scale={1.35} />
          <Leaf x={-45} y={25} rot={-40} />
          <Leaf x={38} y={18} rot={55} flip />
          <Leaf x={-12} y={48} rot={10} />
        </g>

        {/* Top-right cluster */}
        <g opacity={0.50} transform="translate(1360, 90) rotate(12)">
          <RoseBloom cx={0} cy={0} scale={1.25} />
          <Leaf x={-42} y={22} rot={-35} />
          <Leaf x={35} y={30} rot={48} flip />
        </g>

        {/* Bottom-left cluster */}
        <g opacity={0.50} transform="translate(100, 820) rotate(5)">
          <RoseBloom cx={0} cy={0} scale={1.15} />
          <Leaf x={40} y={-35} rot={140} flip />
          <Leaf x={-35} y={-28} rot={-120} />
        </g>

        {/* Bottom-right cluster */}
        <g opacity={0.50} transform="translate(1320, 780) rotate(-6)">
          <RoseBloom cx={0} cy={0} scale={1.3} />
          <Leaf x={-40} y={-30} rot={-135} />
          <Leaf x={38} y={-22} rot={125} flip />
          <Leaf x={0} y={42} rot={180} />
        </g>

        {/* Left edge spray */}
        <g opacity={0.42}>
          <BranchSpray x={-20} y={380} rot={8} />
        </g>

        {/* Right edge spray */}
        <g opacity={0.42}>
          <BranchSpray x={1460} y={420} rot={172} />
        </g>

        {/* Upper side accents */}
        <g opacity={0.55} transform="translate(0, 200)">
          <path
            d="M40 0 Q120 30 180 0 Q140 80 60 100 Q20 50 40 0"
            fill="url(#bgRoseFade)"
            stroke="rgba(255,214,0,0.6)"
            strokeWidth={0.9}
            opacity={0.8}
          />
        </g>
        <g opacity={0.55} transform="translate(1260, 240)">
          <path
            d="M180 0 Q100 40 40 0 Q80 90 160 110 Q200 60 180 0"
            fill="url(#bgRoseFade)"
            stroke="rgba(255,214,0,0.6)"
            strokeWidth={0.9}
            opacity={0.8}
          />
        </g>

        {/* Scattered petals — CSS drift only */}
        {PETALS.map((p, i) => (
          <MicroPetal
            key={i}
            x={p.x}
            y={p.y}
            r={p.r}
            rot={p.rot}
            driftIndex={p.drift}
            durationSec={p.duration}
            delaySec={p.delay}
            allowMotion={allowDrift}
          />
        ))}
      </svg>
    </div>
  )
}
