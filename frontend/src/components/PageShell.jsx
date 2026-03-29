import BackgroundScene from './BackgroundScene'

/**
 * Root layout wrapper for every routed page.
 *
 * Page entrance convention: every page's top-level content div should carry
 * `className="animate-fade-up"` so routes consistently fade in on navigation.
 * This is intentionally kept as a per-page class (not applied here) so pages
 * can opt in with their own timing and stagger without a shared transition layer.
 */
export default function PageShell({
  children,
  maxWidthClassName = 'max-w-xl',
  centered = false,
}) {
  return (
    <div
      className={`page-watermark ${
        centered
          ? 'flex min-h-screen flex-col items-center justify-center py-6 sm:py-8'
          : 'min-h-screen'
      }`}
    >
      <BackgroundScene />
      <div
        className={`relative z-10 mx-auto w-full px-4 ${centered ? '' : 'py-6 sm:py-8'} ${maxWidthClassName}`}
      >
        <div className="page-panel animate-panel-in pb-safe">{children}</div>
      </div>
    </div>
  )
}
