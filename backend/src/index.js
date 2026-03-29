import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import pinoHttp from 'pino-http'
import { logger } from './lib/logger.js'
import { cookieBaseOptions } from './lib/jwt.js'
import authRouter from './routes/auth.js'
import recipientRouter from './routes/recipient.js'
import lettersRouter from './routes/letters.js'

const app = express()
app.set('trust proxy', 1)

app.use(
  pinoHttp({
    logger,
    autoLogging: true,
    customLogLevel: (_req, res, err) => {
      if (res.statusCode >= 500 || err) return 'error'
      if (res.statusCode >= 400) return 'warn'
      return 'info'
    },
  }),
)

const frontendOrigin = process.env.FRONTEND_URL || 'http://localhost:5173'

app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  }),
)

app.use(express.json({ limit: '2mb' }))
app.use(cookieParser())

app.get('/health', (req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRouter)
app.use('/api/recipient', recipientRouter)
app.use('/api/letters', lettersRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((err, req, res, next) => {
  const log = req.log || logger
  log.error({ err }, 'Unhandled request error')
  if (res.headersSent) {
    return next(err)
  }
  const status = Number(err.statusCode || err.status) || 500
  const safeStatus = status >= 400 && status < 600 ? status : 500
  const message =
    safeStatus === 500
      ? 'Server error'
      : typeof err.message === 'string' && err.message
        ? err.message
        : 'Request failed'
  res.status(safeStatus).json({ error: message })
})

const port = Number(process.env.PORT) || 3000
app.listen(port, () => {
  const cookieOpts = cookieBaseOptions()
  logger.info(
    {
      port,
      nodeEnv: process.env.NODE_ENV || 'development',
      frontendUrl: frontendOrigin,
      cookie: { sameSite: cookieOpts.sameSite, secure: cookieOpts.secure },
      hasJwtSecret: Boolean(process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 16),
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      hasUpstashRedis: Boolean(
        process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
      ),
    },
    'API started',
  )
})
