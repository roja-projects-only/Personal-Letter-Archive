import TagNew from './TagNew'
import TagReplied from './TagReplied'
import GhostButton from './GhostButton'
import CornerOrnament from './CornerOrnament'

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
        role="button"
        tabIndex={0}
        onClick={onCardClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onCardClick?.()
          }
        }}
        className={`paper-card paper-card-ribbon paper-texture animate-slide-in-card relative mb-3 flex cursor-pointer items-center justify-between gap-3 p-4 transition-all duration-200 hover:shadow-md hover:border-gold ${className}`}
        style={delayStyle}
      >
        <CornerOrnament position="tr" size={22} />
        <div className="min-w-0 flex-1 text-left">
          <p className="font-serif text-sm italic text-ink">
            {title?.trim() || 'Untitled letter'}
          </p>
          <p className="mt-0.5 font-sans text-xs text-ink-muted">{formatDate(createdAt)}</p>
          <p className="mt-1 font-sans text-[11px] text-ink-muted">
            {replyCount > 0 ? (
              <>
                <span className="text-rose">
                  {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                </span>{' '}
                ♡
              </>
            ) : (
              'no replies yet'
            )}
          </p>
        </div>
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
    )
  }

  return (
    <button
      type="button"
      onClick={onCardClick}
      className={`paper-card paper-texture animate-slide-in-card relative mb-3 w-full p-5 text-left transition-all duration-200 hover:shadow-md hover:border-gold ${className}`}
      style={delayStyle}
    >
      <CornerOrnament position="tr" size={24} />
      <CornerOrnament position="bl" size={24} />
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
