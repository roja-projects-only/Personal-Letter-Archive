/**
 * One-time migration: convert Letter.content from stored TipTap HTML to plain text.
 *
 * Run once against your database AFTER deploying the plain-text frontend:
 *
 *   node backend/scripts/migrate-letter-content-to-plain.js
 *
 * The script is idempotent — rows that contain no HTML tags are left unchanged.
 * Take a database backup before running against production.
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { convert } from 'html-to-text'

const prisma = new PrismaClient()

const CONVERT_OPTIONS = {
  wordwrap: false,
  selectors: [
    { selector: 'a', options: { ignoreHref: true } },
    { selector: 'img', format: 'skip' },
  ],
}

function looksLikeHtml(str) {
  return /<[a-z][\s\S]*?>/i.test(str)
}

function htmlToPlain(html) {
  if (!html) return ''
  if (!looksLikeHtml(html)) return html
  return convert(html, CONVERT_OPTIONS).trim()
}

async function main() {
  const letters = await prisma.letter.findMany({ select: { id: true, content: true } })

  console.log(`Found ${letters.length} letter(s). Checking for HTML content…`)

  let updated = 0

  for (const letter of letters) {
    if (!looksLikeHtml(letter.content)) continue

    const plain = htmlToPlain(letter.content)
    await prisma.letter.update({
      where: { id: letter.id },
      data: { content: plain },
    })
    updated++
    console.log(`  Updated letter ${letter.id}`)
  }

  console.log(`Done. ${updated} letter(s) converted to plain text.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
