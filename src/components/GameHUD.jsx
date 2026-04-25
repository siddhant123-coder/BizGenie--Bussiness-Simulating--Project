import { useGameStore } from '../hooks/useGameStore'
import { SCENARIOS } from '../data/scenarios'

function fmt(n) {
  return '₹' + Math.abs(Math.round(n)).toLocaleString('en-IN')
}

export default function GameHUD() {
  const { cash, score, correctCount, totalAnswered, scenarioIndex, streak, playerName, businessEmoji, businessLabel } = useGameStore()
  const progress = Math.round((scenarioIndex / SCENARIOS.length) * 100)
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Progress bar */}
      <div className="h-0.5 bg-white/5">
        <div className="h-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #f5a623, #ffd166)' }} />
      </div>

      {/* HUD bar */}
      <div className="flex items-center justify-between px-4 py-2.5"
        style={{ background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Left: Logo + player identity */}
        <div className="flex items-center gap-3">
          <span className="font-display font-bold text-base gold-text hidden sm:block">BizGenie</span>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <span className="text-base">{businessEmoji}</span>
            <span className="text-white/70 text-xs font-display font-semibold hidden sm:block">{playerName}</span>
            {businessLabel && <span className="text-white/25 text-xs hidden md:block">· {businessLabel}</span>}
          </div>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-white/30 text-xs font-mono">Q{scenarioIndex + 1}/{SCENARIOS.length}</span>
        </div>

        {/* Right: Stats */}
        <div className="flex items-center gap-2">
          {/* Cash */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
            style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)' }}>
            <span className="text-gold text-xs hidden sm:block">CASH</span>
            <span className={`font-display font-semibold text-sm ${cash > 15000 ? 'text-emerald' : cash > 8000 ? 'text-gold' : 'text-crimson'}`}>
              {fmt(cash)}
            </span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="text-white/40 text-xs hidden sm:block">SCORE</span>
            <span className="font-display font-semibold text-sm text-white">{score.toLocaleString()}</span>
          </div>

          {/* Streak */}
          {streak > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg animate-pulse-slow"
              style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)' }}>
              <span className="text-crimson text-sm font-display font-bold">🔥{streak}</span>
            </div>
          )}

          {/* Accuracy */}
          {totalAnswered > 0 && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
              style={{ background: 'rgba(0,214,143,0.08)', border: '1px solid rgba(0,214,143,0.2)' }}>
              <span className="text-emerald/70 text-xs">ACC</span>
              <span className="font-mono text-sm text-emerald">{accuracy}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
