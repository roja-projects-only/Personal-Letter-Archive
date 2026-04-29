import TagNew from './TagNew'
import TagReplied from './TagReplied'
import GhostButton from './GhostButton'
import CornerOrnament from './CornerOrnament'

// Two-tier ornament scale shared across card variants
const ORNAMENT_SM = 20
const ORNAMENT_MD = 24

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

export default function LetterCard({
  variant = 'vertical',
  title,
  createdAt,
  excerpt,
  onCardClick,
  replyCount = 0,
  viewedAt,
  onEditClick,
  className = '',
  animationDelay,
}) {
  const showReplied = replyCount > 0
  const showNew = !showReplied && !viewedAt

  const delayStyle = animationDelay != null ? { animationDelay } : undefined

  if (variant === 'horizontal') {
    return (
      <div
        className={`paper-card paper-texture animate-slide-in-card relative mb-3 flex items-stretch gap-0 overflow-hidden transition-all duration-200 hover:-translate-y-px hover:shadow-md hover:border-gold ${className}`}
        style={delayStyle}
      >
        <CornerOrnament position="tr" size={ORNAMENT_SM} />
        <button
          type="button"
          onClick={onCardClick}
          className="min-w-0 flex-1 cursor-pointer p-4 text-left transition-colors hover:bg-white/25 focus-visible:z-[1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rose/50"
        >
          <p className="font-serif text-sm italic text-ink">
            {title?.trim() || 'Untitled letter'}
          </p>
          <p className="mt-0.5 font-sans text-xs text-ink-muted">{formatDate(createdAt)}</p>
          <p className="mt-1 font-sans text-[11px] text-ink-muted">
            {replyCount > 0 ? (
              <>
                <span className="text-rose-deep">
                  {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                </span>{' '}
                ♡
              </>
            ) : (
              'no replies yet'
            )}
          </p>
        </button>
        <div className="flex shrink-0 items-center bg-cream-dark/50 px-2">
          <GhostButton
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onEditClick?.()
            }}
          >
            edit
          </GhostButton>
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onCardClick}
      className={`paper-card paper-texture animate-slide-in-card relative mb-3 w-full p-5 text-left transition-all duration-200 hover:-translate-y-px hover:shadow-md hover:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/50 focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${className}`}
      style={delayStyle}
    >
      <CornerOrnament position="tr" size={ORNAMENT_MD} />
      <CornerOrnament position="bl" size={ORNAMENT_MD} />
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <span className="font-serif text-base italic text-ink leading-snug pr-2">
          {title?.trim() || 'Untitled letter'}
        </span>
        <span className="shrink-0">
          {showReplied ? <TagReplied /> : showNew ? <TagNew /> : null}
        </span>
      </div>
      <p className="mb-2 font-sans text-xs text-gold tracking-wide">{formatDate(createdAt)}</p>
      {excerpt != null && (
        <p className="font-serif text-sm leading-relaxed text-ink-muted italic">{excerpt}</p>
      )}
    </button>
  )
}
