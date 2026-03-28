import BackgroundScene from './BackgroundScene'

export default function PageShell({
  children,
  maxWidthClassName = 'max-w-xl',
  centered = false,
}) {
  return (
    <div
      className={`page-watermark bg-cream ${
        centered
          ? 'flex min-h-screen flex-col items-center justify-center py-6 sm:py-8'
          : 'min-h-screen'
      }`}
    >
      <BackgroundScene />
      <div
        className={`relative z-10 mx-auto w-full px-4 ${centered ? '' : 'py-6 sm:py-8'} ${maxWidthClassName}`}
      >
        <div className="page-panel pb-safe">{children}</div>
      </div>
    </div>
  )
}
