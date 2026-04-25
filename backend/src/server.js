import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import compression from 'compression'
import morgan from 'morgan'
import authRoutes from './routes/auth.js'
import gameRoutes from './routes/game.js'
import leaderboardRoutes from './routes/leaderboard.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet({ crossOriginEmbedderPolicy: false }))

// ── CORS ──────────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true)
    cb(new Error(`CORS blocked: ${origin}`))
  },
  credentials: true,
}))

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
}))

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many auth attempts.' },
})

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(compression())
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: false }))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/game', gameRoutes)
app.use('/api/leaderboard', leaderboardRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', ts: Date.now() })
})

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`BizGenie API listening on :${PORT}`))
