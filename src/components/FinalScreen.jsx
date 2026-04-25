import { useGameStore } from '../hooks/useGameStore'
import ThreeBackground from './ThreeBackground'

function fmt(n) {
  return '₹' + Math.abs(Math.round(n)).toLocaleString('en-IN')
}

function CircleProgress({ value, max, color, size = 80 }) {
  const pct = Math.min(100, Math.round((value / Math.max(max, 1)) * 100))
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={size} height={size} className="progress-ring">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s ease' }} />
      <text x={size/2} y={size/2+5} textAnchor="middle" fill={color} fontSize={14} fontWeight={700} fontFamily="Syne">
        {pct}%
      </text>
    </svg>
  )
}

export default function FinalScreen() {
  const { cash, score, correctCount, totalAnswered, journal, conceptsLearned, maxStreak, restartGame, goToLeaderboard, playerName, businessEmoji, businessLabel, leaderboard } = useGameStore()

  const startCash = 10000
  const roi = Math.round(((cash - startCash) / startCash) * 100)
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0

  // Find player rank in leaderboard
  const myRank = leaderboard.findIndex(e => e.score === score && e.name === playerName) + 1

  let grade, gradeColor, icon, tagline
  if (accuracy >= 80 && cash > 50000) {
    grade = 'Business Genius'; gradeColor = '#00d68f'; icon = '🏆'
    tagline = `Exceptional, ${playerName}! You think like a real strategist.`
  } else if (accuracy >= 60 && cash > 20000) {
    grade = 'Strategic Thinker'; gradeColor = '#f5a623'; icon = '🎯'
    tagline = `Strong instincts, ${playerName}. You understand tradeoffs well.`
  } else if (accuracy >= 40 || cash > 10000) {
    grade = 'Rising Entrepreneur'; gradeColor = '#7b5ea7'; icon = '📈'
    tagline = `Good start, ${playerName}. Play again to sharpen your edge.`
  } else {
    grade = 'Business Apprentice'; gradeColor = '#ff4d6d'; icon = '📚'
    tagline = `Every legend started here, ${playerName}. Cash flow is your focus.`
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ThreeBackground variant="landing" />
      <div className="grain" />
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(6,6,9,0.85) 100%)', zIndex: 1 }} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-8 fade-in-up">
          <div className="text-5xl mb-3">{icon}</div>
          <h1 className="font-display font-extrabold text-4xl text-white mb-2" style={{ letterSpacing: '-0.02em' }}>
            Game Complete!
          </h1>
          <p className="font-display font-bold text-2xl mb-2" style={{ color: gradeColor }}>{grade}</p>
          <p className="text-white/40 text-sm font-body max-w-sm mx-auto">{tagline}</p>
        </div>

        {/* Player identity + leaderboard rank */}
        <div className="glass-card p-4 mb-5 flex items-center gap-4 fade-in-up fade-in-up-delay-1">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)' }}>
            {businessEmoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-white/90">{playerName}</p>
            <p className="text-white/40 text-xs font-body">{businessLabel} Founder</p>
          </div>
          {myRank > 0 && (
            <div className="text-right flex-shrink-0">
              <p className="text-white/30 text-xs font-mono">Leaderboard</p>
              <p className="font-display font-bold text-xl" style={{ color: myRank <= 3 ? '#f5a623' : 'rgba(255,255,255,0.7)' }}>
                {myRank <= 3 ? ['🥇','🥈','🥉'][myRank-1] : `#${myRank}`}
              </p>
            </div>
          )}
        </div>

        {/* Final cash */}
        <div className="glass-card p-7 text-center mb-5 fade-in-up fade-in-up-delay-1"
          style={{
            border: `1px solid ${cash > startCash ? 'rgba(0,214,143,0.3)' : 'rgba(255,77,109,0.3)'}`,
            background: cash > startCash ? 'rgba(0,214,143,0.05)' : 'rgba(255,77,109,0.05)',
          }}>
          <p className="text-white/40 text-xs font-mono uppercase tracking-wider mb-2">Final Cash Balance</p>
          <p className="font-display font-extrabold mb-2"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', color: cash > startCash ? '#00d68f' : '#ff4d6d', letterSpacing: '-0.03em' }}>
            {fmt(cash)}
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-white/30 text-sm">Started with {fmt(startCash)}</span>
            <span className="text-white/20">·</span>
            <span className={`text-sm font-display font-semibold ${roi >= 0 ? 'text-emerald' : 'text-crimson'}`}>
              ROI: {roi >= 0 ? '+' : ''}{roi}%
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5 fade-in-up fade-in-up-delay-2">
          <div className="glass-card p-4 flex flex-col items-center text-center">
            <CircleProgress value={correctCount} max={totalAnswered} color="#f5a623" size={70} />
            <p className="text-white/50 text-xs font-body mt-2">Accuracy</p>
          </div>
          <div className="glass-card p-4 flex flex-col items-center justify-center text-center">
            <p className="font-display font-bold text-3xl gold-text">{score.toLocaleString()}</p>
            <p className="text-white/50 text-xs font-body mt-1">Total Score</p>
          </div>
          <div className="glass-card p-4 flex flex-col items-center justify-center text-center">
            <p className="font-display font-bold text-3xl text-crimson">🔥{maxStreak}</p>
            <p className="text-white/50 text-xs font-body mt-1">Best Streak</p>
          </div>
        </div>

        {/* Concepts learned */}
        <div className="glass-card p-5 mb-5 fade-in-up fade-in-up-delay-3">
          <p className="text-white/30 text-xs font-mono uppercase tracking-wider mb-4">Business Concepts You Mastered</p>
          <div className="flex flex-wrap gap-2">
            {conceptsLearned.length === 0
              ? <span className="text-white/30 text-xs">No concepts unlocked yet — play more!</span>
              : conceptsLearned.map(c => (
                <span key={c} className="text-xs font-body px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(123,94,167,0.15)', border: '1px solid rgba(123,94,167,0.3)', color: '#b4a0d4' }}>
                  ✓ {c}
                </span>
              ))
            }
          </div>
        </div>

        {/* Decision journal */}
        <div className="glass-card p-5 mb-8 fade-in-up fade-in-up-delay-4">
          <p className="text-white/30 text-xs font-mono uppercase tracking-wider mb-4">{playerName}'s Decision Journal</p>
          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {journal.map((entry, i) => (
              <div key={i} className="flex items-start justify-between gap-3 py-2"
                style={{ borderBottom: i < journal.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <span className="text-white/20 text-xs font-mono flex-shrink-0 mt-0.5">#{entry.scenario}</span>
                  <div className="min-w-0">
                    <p className="text-white/60 text-xs font-body leading-snug">{entry.title}</p>
                    <p className="text-white/30 text-xs font-body truncate">{entry.choice}</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold flex-shrink-0"
                  style={{ color: entry.positive ? '#00d68f' : '#ff4d6d' }}>
                  {entry.delta}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 fade-in-up fade-in-up-delay-5">
          <button onClick={goToLeaderboard}
            className="flex-1 py-4 rounded-2xl font-display font-bold text-sm btn-outline">
            🏆 View Leaderboard
          </button>
          <button onClick={restartGame}
            className="flex-1 btn-gold py-4 rounded-2xl text-obsidian font-display font-bold text-base">
            Play Again →
          </button>
        </div>

        <p className="text-center text-white/20 text-xs font-body mt-6">
          BTech CSE Project · Business Simulation Game · React + Vite + Three.js
        </p>
      </div>
    </div>
  )
}
