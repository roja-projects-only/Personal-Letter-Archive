import { Redis } from '@upstash/redis'

let redisSingleton = null

export function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    return null
  }
  if (!redisSingleton) {
    redisSingleton = new Redis({ url, token })
  }
  return redisSingleton
}
