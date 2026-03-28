import { getRedis } from '../lib/redis.js'
import { logger } from '../lib/logger.js'

const WINDOW_SEC = 300
const MAX_ATTEMPTS = 5

function clientIp(req) {
  return req.ip || req.connection?.remoteAddress || 'unknown'
}

function log(req) {
  return req?.log || logger
}

export function pinRateLimitKey(ip) {
  return `pin_attempts:${ip}`
}

/**
 * Call when PIN verification fails. Returns { locked, count, retryAfter }.
 * If Redis is unavailable, fails open (no lockout).
 */
export async function recordPinFailure(req) {
  const ip = clientIp(req)
  const key = pinRateLimitKey(ip)
  const redis = getRedis()

  if (!redis) {
    return { locked: false, count: 0, retryAfter: 0 }
  }

  const count = await redis.incr(key)
  if (count === 1) {
    await redis.expire(key, WINDOW_SEC)
  }

  if (count >= MAX_ATTEMPTS) {
    const ttl = await redis.ttl(key)
    const retryAfter = ttl > 0 ? ttl : WINDOW_SEC
    log(req).warn({ ip, count, retryAfter }, 'PIN rate limit: lockout after failures')
    return { locked: true, count, retryAfter }
  }

  return { locked: false, count, retryAfter: 0 }
}

export async function clearPinFailures(req) {
  const ip = clientIp(req)
  const redis = getRedis()
  if (!redis) return
  await redis.del(pinRateLimitKey(ip))
}

/**
 * If already locked, returns { locked: true, retryAfter }. Otherwise { locked: false }.
 */
export async function checkPinLocked(req) {
  const redis = getRedis()
  if (!redis) return { locked: false, retryAfter: 0 }

  const ip = clientIp(req)
  const key = pinRateLimitKey(ip)
  const countRaw = await redis.get(key)
  const count = countRaw != null ? Number(countRaw) : 0
  if (count >= MAX_ATTEMPTS) {
    const ttl = await redis.ttl(key)
    const retryAfter = ttl > 0 ? ttl : WINDOW_SEC
    log(req).warn({ ip, count, retryAfter }, 'PIN verify blocked: existing lockout')
    return { locked: true, retryAfter }
  }
  return { locked: false, retryAfter: 0 }
}
