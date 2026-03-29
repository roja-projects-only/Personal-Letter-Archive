export function stripHtml(html) {
  if (!html) return ''
  // Safety net for any legacy HTML rows not yet migrated
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

export function letterExcerpt(text, maxLen = 120) {
  const plain = stripHtml(text).replace(/\s+/g, ' ').trim()
  if (plain.length <= maxLen) return plain
  return `${plain.slice(0, maxLen).trim()}...`
}
