import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { authenticate } from '../middleware/authenticate.js'
import { validate } from '../middleware/validate.js'

const router = Router()

const SaveSessionSchema = z.object({
  businessType:    z.string().min(1).max(20),
  businessLabel:   z.string().min(1).max(50),
  businessEmoji:   z.string().max(8),
  finalCash:       z.number().int().min(0),
  score:           z.number().int().min(0),
  correctCount:    z.number().int().min(0),
  totalAnswered:   z.number().int().min(0),
  maxStreak:       z.number().int().min(0),
  accuracyPct:     z.number().int().min(0).max(100),
  grade:           z.string().max(30),
  journal:         z.array(z.object({
    scenario: z.number().int(),
    title:    z.string(),
    choice:   z.string(),
    delta:    z.string(),
    positive: z.boolean(),
    correct:  z.boolean(),
  })),
  conceptsLearned: z.array(z.string()),
  answers: z.array(z.object({
    scenarioIndex: z.number().int(),
    choiceIndex:   z.number().int(),
    isCorrect:     z.boolean(),
    moneyDelta:    z.number().int(),
  })).optional(),
})

// POST /api/game/sessions
router.post('/sessions', authenticate, validate(SaveSessionSchema), async (req, res, next) => {
  try {
    const { answers, ...sessionData } = req.body
    const session = await prisma.gameSession.create({
      data: {
        userId: req.userId,
        ...sessionData,
        answers: answers?.length ? {
          create: answers.map(a => ({
            scenarioIndex: a.scenarioIndex,
            choiceIndex:   a.choiceIndex,
            isCorrect:     a.isCorrect,
            moneyDelta:    a.moneyDelta,
          }))
        } : undefined,
      },
    })
    res.status(201).json({ session })
  } catch (err) { next(err) }
})

// GET /api/game/sessions
router.get('/sessions', authenticate, async (req, res, next) => {
  try {
    const sessions = await prisma.gameSession.findMany({
      where: { userId: req.userId },
      orderBy: { completedAt: 'desc' },
      take: 20,
      select: {
        id: true, score: true, finalCash: true, accuracyPct: true,
        maxStreak: true, grade: true, businessLabel: true,
        businessEmoji: true, completedAt: true,
      },
    })
    res.json({ sessions })
  } catch (err) { next(err) }
})

export default router
