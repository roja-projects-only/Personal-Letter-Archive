import * as jose from 'jose'

const COOKIE_AUTHOR = 'pla_author'
const COOKIE_RECIPIENT = 'pla_recipient'

function getSecret() {
  const s = process.env.JWT_SECRET
  if (!s || s.length < 16) {
    throw new Error('JWT_SECRET must be set and at least 16 characters')
  }
  return new TextEncoder().encode(s)
}

export function getCookieNames() {
  return { author: COOKIE_AUTHOR, recipient: COOKIE_RECIPIENT }
}

export async function signAuthorJwt(userId) {
  return new jose.SignJWT({ role: 'author' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || '7d')
    .sign(getSecret())
}

export async function signRecipientJwt(recipientId) {
  return new jose.SignJWT({ role: 'recipient' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(recipientId)
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || '7d')
    .sign(getSecret())
}

export async function verifyAuthorJwt(token) {
  const { payload } = await jose.jwtVerify(token, getSecret())
  if (payload.role !== 'author') throw new Error('Invalid role')
  return payload.sub
}

export async function verifyRecipientJwt(token) {
  const { payload } = await jose.jwtVerify(token, getSecret())
  if (payload.role !== 'recipient') throw new Error('Invalid role')
  return payload.sub
}

/** @returns {Promise<{ role: 'author' | 'recipient', id: string } | null>} */
export async function getSessionFromRequest(req) {
  const a = req.cookies?.[COOKIE_AUTHOR]
  const r = req.cookies?.[COOKIE_RECIPIENT]
  if (a) {
    try {
      const id = await verifyAuthorJwt(a)
      if (id) return { role: 'author', id }
    } catch {
      /* invalid */
    }
  }
  if (r) {
    try {
      const id = await verifyRecipientJwt(r)
      if (id) return { role: 'recipient', id }
    } catch {
      /* invalid */
    }
  }
  return null
}

export function cookieBaseOptions() {
  const maxAgeSeconds = parseExpiresToSeconds(process.env.JWT_EXPIRES_IN || '7d')
  const isProd = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    // Cross-origin (Vercel → Railway): SameSite=None + Secure required for cookies on API calls
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    path: '/',
    maxAge: maxAgeSeconds * 1000,
  }
}

function parseExpiresToSeconds(exp) {
  const m = String(exp).trim().match(/^(\d+)([smhd])$/i)
  if (!m) return 7 * 24 * 60 * 60
  const n = parseInt(m[1], 10)
  const u = m[2].toLowerCase()
  if (u === 's') return n
  if (u === 'm') return n * 60
  if (u === 'h') return n * 3600
  if (u === 'd') return n * 86400
  return 7 * 24 * 60 * 60
}
