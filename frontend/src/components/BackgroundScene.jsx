/**
 * Full-viewport decorative botanical layer (fixed, non-interactive).
 * Keeps cream base visible while adding visible roses, branches, and petals.
 */
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
          fill="#c97b84"
          transform={`rotate(${(360 / petals) * i})`}
          opacity={0.85}
        />
      ))}
      <circle cx={0} cy={0} r={s * 0.2} fill="#a55a66" opacity={0.9} />
      <circle cx={0} cy={0} r={s * 0.08} fill="#fdf6f0" opacity={0.35} />
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
        stroke="#a55a66"
        strokeWidth={1.4}
        strokeLinecap="round"
        opacity={0.75}
      />
      <path
        d="M2 -2 Q14 -12 24 -6"
        fill="none"
        stroke="#c97b84"
        strokeWidth={0.8}
        strokeLinecap="round"
        opacity={0.5}
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
        stroke="#a55a66"
        strokeWidth={1.6}
        strokeLinecap="round"
        opacity={0.65}
      />
      <ellipse cx={-6} cy={35} rx={8} ry={14} fill="#c97b84" opacity={0.35} transform="rotate(-25 -6 35)" />
      <ellipse cx={4} cy={72} rx={7} ry={12} fill="#c97b84" opacity={0.3} transform="rotate(18 4 72)" />
      <circle cx={8} cy={105} r={5} fill="#a55a66" opacity={0.4} />
    </g>
  )
}

function MicroPetal({ x, y, r, rot }) {
  return (
    <ellipse
      cx={x}
      cy={y}
      rx={r}
      ry={r * 1.6}
      fill="#c97b84"
      transform={`rotate(${rot} ${x} ${y})`}
      opacity={0.11}
    />
  )
}

export default function BackgroundScene() {
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
            <stop offset="0%" stopColor="#c97b84" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#a55a66" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Top-left cluster */}
        <g opacity={0.2} transform="translate(80, 70) rotate(-8)">
          <RoseBloom cx={0} cy={0} scale={1.35} />
          <Leaf x={-45} y={25} rot={-40} />
          <Leaf x={38} y={18} rot={55} flip />
          <Leaf x={-12} y={48} rot={10} />
        </g>

        {/* Top-right cluster */}
        <g opacity={0.19} transform="translate(1360, 90) rotate(12)">
          <RoseBloom cx={0} cy={0} scale={1.25} />
          <Leaf x={-42} y={22} rot={-35} />
          <Leaf x={35} y={30} rot={48} flip />
        </g>

        {/* Bottom-left cluster */}
        <g opacity={0.18} transform="translate(100, 820) rotate(5)">
          <RoseBloom cx={0} cy={0} scale={1.15} />
          <Leaf x={40} y={-35} rot={140} flip />
          <Leaf x={-35} y={-28} rot={-120} />
        </g>

        {/* Bottom-right cluster */}
        <g opacity={0.2} transform="translate(1320, 780) rotate(-6)">
          <RoseBloom cx={0} cy={0} scale={1.3} />
          <Leaf x={-40} y={-30} rot={-135} />
          <Leaf x={38} y={-22} rot={125} flip />
          <Leaf x={0} y={42} rot={180} />
        </g>

        {/* Left edge spray */}
        <g opacity={0.17}>
          <BranchSpray x={-20} y={380} rot={8} />
        </g>

        {/* Right edge spray */}
        <g opacity={0.17}>
          <BranchSpray x={1460} y={420} rot={172} />
        </g>

        {/* Upper side accents */}
        <g opacity={0.14} transform="translate(0, 200)">
          <path
            d="M40 0 Q120 30 180 0 Q140 80 60 100 Q20 50 40 0"
            fill="url(#bgRoseFade)"
            stroke="#a55a66"
            strokeWidth={0.8}
            opacity={0.6}
          />
        </g>
        <g opacity={0.14} transform="translate(1260, 240)">
          <path
            d="M180 0 Q100 40 40 0 Q80 90 160 110 Q200 60 180 0"
            fill="url(#bgRoseFade)"
            stroke="#a55a66"
            strokeWidth={0.8}
            opacity={0.6}
          />
        </g>

        {/* Scattered micro-petals — middle field */}
        <MicroPetal x={320} y={220} r={6} rot={22} />
        <MicroPetal x={580} y={180} r={5} rot={-15} />
        <MicroPetal x={720} y={280} r={7} rot={48} />
        <MicroPetal x={900} y={200} r={5} rot={-40} />
        <MicroPetal x={1050} y={340} r={6} rot={12} />
        <MicroPetal x={480} y={420} r={4} rot={65} />
        <MicroPetal x={650} y={520} r={5} rot={-22} />
        <MicroPetal x={820} y={480} r={6} rot={30} />
        <MicroPetal x={400} y={650} r={5} rot={-55} />
        <MicroPetal x={1000} y={620} r={4} rot={18} />

        {/* Soft large blooms — very low opacity for depth */}
        <circle cx={200} cy={450} r={180} fill="#f5d5ce" opacity={0.12} />
        <circle cx={1240} cy={500} r={200} fill="#edd8d0" opacity={0.1} />
        <circle cx={720} cy={120} r={140} fill="#f5d5ce" opacity={0.08} />
      </svg>
    </div>
  )
}
