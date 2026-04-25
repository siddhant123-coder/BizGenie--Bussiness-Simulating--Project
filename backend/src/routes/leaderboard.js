import { Router } from 'express'
import { prisma } from '../lib/prisma.js'

const router = Router()

// GET /api/leaderboard
router.get('/', async (req, res, next) => {
  try {
    const data = await prisma.gameSession.findMany({
      orderBy: { score: 'desc' },
      take: 20,
      select: {
        score: true, finalCash: true, accuracyPct: true,
        maxStreak: true, grade: true, businessLabel: true,
        businessEmoji: true, completedAt: true,
        user: { select: { name: true } },
      },
    })

    const leaderboard = data.map((s, i) => ({
      rank:          i + 1,
      name:          s.user.name,
      businessEmoji: s.businessEmoji,
      businessLabel: s.businessLabel,
      score:         s.score,
      finalCash:     s.finalCash,
      accuracy:      s.accuracyPct,
      maxStreak:     s.maxStreak,
      date:          new Date(s.completedAt).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: '2-digit'
      }),
      timestamp: s.completedAt.getTime(),
    }))

    res.json({ leaderboard })
  } catch (err) { next(err) }
})

export default router
