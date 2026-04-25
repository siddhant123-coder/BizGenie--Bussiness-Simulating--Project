import { create } from 'zustand'
import { SCENARIOS } from '../data/scenarios'
import { saveGameSession, fetchLeaderboard, setToken } from '../lib/api-client'

function loadLeaderboard() {
  return []
}

async function saveToLeaderboard(entry) {
  try {
    await saveGameSession(entry)
    const { leaderboard } = await fetchLeaderboard()
    return leaderboard
  } catch (err) {
    console.warn('Backend unavailable:', err)
    return []
  }
}

export const BUSINESS_TYPES = [
  { id: 'food',     label: 'Food & Beverage',    emoji: '🍕', desc: 'Restaurant, cloud kitchen, food brand' },
  { id: 'tech',     label: 'Tech Startup',        emoji: '💻', desc: 'App, SaaS, platform product' },
  { id: 'fashion',  label: 'Fashion & Lifestyle', emoji: '👗', desc: 'Clothing, accessories, D2C brand' },
  { id: 'retail',   label: 'Retail / E-commerce', emoji: '🛒', desc: 'Online store, marketplace seller' },
  { id: 'edu',      label: 'Edtech / Coaching',   emoji: '📚', desc: 'Online courses, tutoring, skill dev' },
  { id: 'health',   label: 'Health & Wellness',   emoji: '💊', desc: 'Fitness, supplements, clinic' },
  { id: 'creative', label: 'Creative Agency',     emoji: '🎨', desc: 'Design, content, marketing' },
  { id: 'other',    label: 'Surprise Me!',        emoji: '🚀', desc: 'Let BizGenie pick the best fit' },
]

export const useGameStore = create((set, get) => ({
  screen: 'landing',
  playerName: '',
  businessType: null,
  businessEmoji: '🚀',
  businessLabel: '',
  scenarioIndex: 0,
  cash: 10000,
  score: 0,
  correctCount: 0,
  totalAnswered: 0,
  journal: [],
  conceptsLearned: [],
  selectedChoice: null,
  revealed: false,
  streak: 0,
  maxStreak: 0,
  leaderboard: loadLeaderboard(),

  goToOnboarding: () => set({ screen: 'onboarding' }),
  goToLeaderboard: () => set({ screen: 'leaderboard' }),
  goToLanding:     () => set({ screen: 'landing' }),
  goToAuth:        () => set({ screen: 'auth' }),

  // Called after successful login/register — saves name from auth
  setAuthUser: (name, token) => {
    setToken(token)
    set({ playerName: name, screen: 'onboarding' })
  },

  setPlayerProfile: (name, businessId) => {
    const bt = BUSINESS_TYPES.find(b => b.id === businessId) || BUSINESS_TYPES[7]
    set({
      playerName: name.trim() || 'Player',
      businessType: businessId,
      businessEmoji: bt.emoji,
      businessLabel: bt.label,
    })
  },

  startGame: () => set({
    screen: 'game',
    scenarioIndex: 0,
    cash: 10000,
    score: 0,
    correctCount: 0,
    totalAnswered: 0,
    journal: [],
    conceptsLearned: [],
    selectedChoice: null,
    revealed: false,
    streak: 0,
    maxStreak: 0,
  }),

  selectChoice: (index) => {
    if (!get().revealed) set({ selectedChoice: index })
  },

  submitChoice: () => {
    const {
      selectedChoice, scenarioIndex, cash, score,
      correctCount, totalAnswered, journal, conceptsLearned,
      streak, maxStreak,
    } = get()

    if (selectedChoice === null || get().revealed) return

    const scenario = SCENARIOS[scenarioIndex]
    const isCorrect = selectedChoice === scenario.correct
    const moneyDelta = scenario.moneyChange[selectedChoice]
    const newCash = Math.max(0, cash + moneyDelta)
    const newStreak = isCorrect ? streak + 1 : 0
    const bonusPoints = isCorrect
      ? (100 + (scenario.difficulty === 'easy' ? 0 : scenario.difficulty === 'med' ? 50 : 100))
      : 0
    const deltaStr = (moneyDelta >= 0 ? '+' : '') + '₹' + Math.abs(moneyDelta).toLocaleString('en-IN')

    set({
      revealed: true,
      cash: newCash,
      score: score + bonusPoints,
      correctCount: isCorrect ? correctCount + 1 : correctCount,
      totalAnswered: totalAnswered + 1,
      journal: [
        ...journal,
        {
          scenario: scenarioIndex + 1,
          title: scenario.title,
          choice: scenario.choices[selectedChoice].label,
          delta: deltaStr,
          positive: moneyDelta >= 0,
          correct: isCorrect,
        },
      ],
      conceptsLearned: conceptsLearned.includes(scenario.concept.title)
        ? conceptsLearned
        : [...conceptsLearned, scenario.concept.title],
      streak: newStreak,
      maxStreak: Math.max(maxStreak, newStreak),
    })
  },

  nextScenario: () => {
    const {
      scenarioIndex, cash, businessType, businessEmoji,
      businessLabel, score, correctCount, totalAnswered,
      maxStreak, conceptsLearned, journal,
    } = get()

    const next = scenarioIndex + 1

    if (cash <= 0 || next >= SCENARIOS.length) {
      const entry = {
        businessType,
        businessLabel,
        businessEmoji,
        score,
        finalCash: cash,
        correctCount,
        totalAnswered,
        accuracyPct: totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0,
        maxStreak,
        grade: getGrade(
          totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0,
          cash
        ),
        journal,
        conceptsLearned,
      }

      saveToLeaderboard(entry).then(updated => {
        set({ leaderboard: updated })
      })

      set({ screen: 'final', scenarioIndex: next })
    } else {
      set({ scenarioIndex: next, selectedChoice: null, revealed: false })
    }
  },

  restartGame: () => set({
    screen: 'onboarding',
    scenarioIndex: 0,
    cash: 10000,
    score: 0,
    correctCount: 0,
    totalAnswered: 0,
    journal: [],
    conceptsLearned: [],
    selectedChoice: null,
    revealed: false,
    streak: 0,
    maxStreak: 0,
    businessType: null,
    businessEmoji: '🚀',
    businessLabel: '',
  }),
}))

function getGrade(accuracy, cash) {
  if (accuracy >= 80 && cash > 50000) return 'Business Genius'
  if (accuracy >= 60 && cash > 20000) return 'Strategic Thinker'
  if (accuracy >= 40 || cash > 10000) return 'Rising Entrepreneur'
  return 'Business Apprentice'
}
