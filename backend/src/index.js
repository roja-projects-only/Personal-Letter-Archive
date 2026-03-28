import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.js'
import recipientRouter from './routes/recipient.js'
import lettersRouter from './routes/letters.js'

const app = express()
app.set('trust proxy', 1)

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

const port = Number(process.env.PORT) || 3000
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})
