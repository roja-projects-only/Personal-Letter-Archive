import TagNew from './TagNew'
import TagReplied from './TagReplied'
import GhostButton from './GhostButton'

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
}) {
  const showReplied = replyCount > 0
  const showNew = !showReplied && !viewedAt

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
        className={`mb-2.5 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-[border-color] duration-200 hover:border-rose ${className}`}
      >
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
      className={`mb-2.5 w-full rounded-xl border border-border bg-card p-4 text-left transition-[border-color] duration-200 hover:border-rose ${className}`}
    >
      <div className="mb-1 flex items-start justify-between gap-2">
        <span className="font-serif text-[15px] italic text-ink">
          {title?.trim() || 'Untitled letter'}
        </span>
        <span className="shrink-0">
          {showReplied ? <TagReplied /> : showNew ? <TagNew /> : null}
        </span>
      </div>
      <p className="mb-1.5 font-sans text-xs text-ink-muted">{formatDate(createdAt)}</p>
      {excerpt != null && (
        <p className="font-sans text-[13px] leading-normal text-ink-muted">{excerpt}</p>
      )}
    </button>
  )
}
