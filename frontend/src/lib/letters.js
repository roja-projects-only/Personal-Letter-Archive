export function normalizeLetterList(data) {
  if (Array.isArray(data)) return data
  if (data?.letters && Array.isArray(data.letters)) return data.letters
  return []
}

export function letterNumberForId(letters, id) {
  const sorted = [...letters].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )
  const idx = sorted.findIndex((l) => l.id === id)
  return idx >= 0 ? idx + 1 : 1
}
