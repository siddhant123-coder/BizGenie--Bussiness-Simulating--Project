import { Router } from 'express'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/authenticate.js'

const router = Router()

const RegisterSchema = z.object({
  name:     z.string().min(2).max(24).trim(),
  email:    z.string().email().toLowerCase(),
  password: z.string().min(8).max(72),
})

const LoginSchema = z.object({
  email:    z.string().email().toLowerCase(),
  password: z.string().min(1),
})

function signAccess(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '15m' })
}

function signRefresh(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
}

function setRefreshCookie(res, token) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth/refresh',
  })
}

// POST /api/auth/register
router.post('/register', validate(RegisterSchema), async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ error: 'Email already registered.' })

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { name, email, passwordHash, refreshToken: '' },
    })

    const access  = signAccess(user.id)
    const refresh = signRefresh(user.id)
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: refresh } })

    setRefreshCookie(res, refresh)
    res.status(201).json({ accessToken: access, user: { id: user.id, name, email } })
  } catch (err) { next(err) }
})

// POST /api/auth/login
router.post('/login', validate(LoginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    const match = user ? await bcrypt.compare(password, user.passwordHash) : false
    if (!user || !match) return res.status(401).json({ error: 'Invalid email or password.' })

    const access  = signAccess(user.id)
    const refresh = signRefresh(user.id)
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: refresh, lastLogin: new Date() },
    })

    setRefreshCookie(res, refresh)
    res.json({ accessToken: access, user: { id: user.id, name: user.name, email } })
  } catch (err) { next(err) }
})

// POST /api/auth/refresh
router.post('/refresh', async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken
    if (!token) return res.status(401).json({ error: 'No refresh token.' })

    let payload
    try {
      payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    } catch {
      return res.status(401).json({ error: 'Invalid or expired refresh token.' })
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } })
    if (!user || user.refreshToken !== token) {
      if (user) await prisma.user.update({ where: { id: user.id }, data: { refreshToken: null } })
      return res.status(401).json({ error: 'Refresh token reuse detected.' })
    }

    const newAccess  = signAccess(user.id)
    const newRefresh = signRefresh(user.id)
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: newRefresh } })

    setRefreshCookie(res, newRefresh)
    res.json({ accessToken: newAccess })
  } catch (err) { next(err) }
})

// POST /api/auth/logout
router.post('/logout', authenticate, async (req, res, next) => {
  try {
    await prisma.user.update({ where: { id: req.userId }, data: { refreshToken: null } })
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' })
    res.json({ message: 'Logged out.' })
  } catch (err) { next(err) }
})

export default router
