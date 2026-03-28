export function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

export function letterExcerpt(html, maxLen = 120) {
  const text = stripHtml(html)
  if (text.length <= maxLen) return text
  return `${text.slice(0, maxLen).trim()}...`
}
