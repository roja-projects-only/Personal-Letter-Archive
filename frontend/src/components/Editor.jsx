export default function Editor({
  content = '',
  placeholder = 'begin here...',
  onChange,
  className = '',
  editable = true,
}) {
  if (!editable) {
    return (
      <div
        className={`letter-editor-view font-serif text-base leading-[1.8] text-ink whitespace-pre-wrap ${className}`}
      >
        {content}
      </div>
    )
  }

  return (
    <textarea
      value={content}
      onChange={(e) => onChange?.(e.target.value)}
      onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
      placeholder={placeholder}
      autoCapitalize="sentences"
      autoCorrect="on"
      spellCheck
      className={`letter-editor font-serif text-base leading-[1.8] text-ink ${className}`}
    />
  )
}
