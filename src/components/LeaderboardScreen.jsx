import { useGameStore } from '../hooks/useGameStore'
import ThreeBackground from './ThreeBackground'

function fmt(n) {
  return '₹' + Math.abs(Math.round(n)).toLocaleString('en-IN')
}

const MEDALS = ['🥇', '🥈', '🥉']
const GRADE_MAP = (accuracy, cash) => {
  if (accuracy >= 80 && cash > 50000) return { label: 'Business Genius', color: '#00d68f' }
  if (accuracy >= 60 && cash > 20000) return { label: 'Strategic Thinker', color: '#f5a623' }
  if (accuracy >= 40)                  return { label: 'Rising Entrepreneur', color: '#7b5ea7' }
  return { label: 'Apprentice', color: '#ff4d6d' }
}

export default function LeaderboardScreen() {
  const { leaderboard, goToLanding, goToOnboarding } = useGameStore()

  const isEmpty = !leaderboard || leaderboard.length === 0

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ThreeBackground variant="game" />
      <div className="grain" />
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, transparent 50%, rgba(6,6,9,0.85) 100%)', zIndex: 1 }} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-12 pb-16">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <button onClick={goToLanding} className="text-white/30 hover:text-white/60 text-sm font-body transition-colors">
            ← Back
          </button>
          <div className="text-center">
            <h1 className="font-display font-bold text-2xl text-white" style={{ letterSpacing: '-0.02em' }}>
              🏆 Leaderboard
            </h1>
            <p className="text-white/30 text-xs font-body mt-1">Top Business Minds</p>
          </div>
          <button
            onClick={goToOnboarding}
            className="text-xs font-display font-semibold px-4 py-2 rounded-xl text-obsidian"
            style={{ background: 'linear-gradient(135deg, #f5a623, #ffd166)' }}
          >
            Play →
          </button>
        </div>

        {/* Top 3 podium */}
        {!isEmpty && leaderboard.length >= 1 && (
          <div className="mb-10">
            <div className="flex items-end justify-center gap-3">

              {/* 2nd place */}
              {leaderboard[1] && (
                <div className="flex-1 max-w-[140px] fade-in-up fade-in-up-delay-2">
                  <div className="text-center mb-2">
                    <div className="text-2xl mb-1">🥈</div>
                    <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-xl mb-1"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.15)' }}>
                      {leaderboard[1].businessEmoji}
                    </div>
                    <p className="text-white/80 text-xs font-display font-semibold truncate">{leaderboard[1].name}</p>
                    <p className="text-gold text-sm font-display font-bold">{leaderboard[1].score.toLocaleString()}</p>
                  </div>
                  <div className="rounded-t-xl py-4 text-center"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', height: '80px' }}>
                    <p className="text-white/40 text-xs font-mono">{fmt(leaderboard[1].finalCash)}</p>
                    <p className="text-white/30 text-xs">{leaderboard[1].accuracy}% acc</p>
                  </div>
                </div>
              )}

              {/* 1st place */}
              <div className="flex-1 max-w-[160px] fade-in-up fade-in-up-delay-1">
                <div className="text-center mb-2">
                  <div className="text-3xl mb-1 animate-float">🥇</div>
                  <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center text-2xl mb-1"
                    style={{ background: 'rgba(245,166,35,0.15)', border: '2px solid rgba(245,166,35,0.5)', boxShadow: '0 0 20px rgba(245,166,35,0.3)' }}>
                    {leaderboard[0].businessEmoji}
                  </div>
                  <p className="text-white font-display font-bold text-sm truncate">{leaderboard[0].name}</p>
                  <p className="text-gold text-lg font-display font-bold">{leaderboard[0].score.toLocaleString()}</p>
                </div>
                <div className="rounded-t-xl py-4 text-center"
                  style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.25)', height: '110px', boxShadow: '0 0 30px rgba(245,166,35,0.1)' }}>
                  <p className="text-gold/70 text-xs font-mono">{fmt(leaderboard[0].finalCash)}</p>
                  <p className="text-white/40 text-xs mt-1">{leaderboard[0].accuracy}% accuracy</p>
                  <p className="text-white/30 text-xs">🔥 {leaderboard[0].maxStreak} streak</p>
                </div>
              </div>

              {/* 3rd place */}
              {leaderboard[2] && (
                <div className="flex-1 max-w-[140px] fade-in-up fade-in-up-delay-3">
                  <div className="text-center mb-2">
                    <div className="text-2xl mb-1">🥉</div>
                    <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-xl mb-1"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.1)' }}>
                      {leaderboard[2].businessEmoji}
                    </div>
                    <p className="text-white/80 text-xs font-display font-semibold truncate">{leaderboard[2].name}</p>
                    <p className="text-gold text-sm font-display font-bold">{leaderboard[2].score.toLocaleString()}</p>
                  </div>
                  <div className="rounded-t-xl py-4 text-center"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', height: '60px' }}>
                    <p className="text-white/40 text-xs font-mono">{fmt(leaderboard[2].finalCash)}</p>
                    <p className="text-white/30 text-xs">{leaderboard[2].accuracy}% acc</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full leaderboard table */}
        <div className="glass-card overflow-hidden mb-8 fade-in-up fade-in-up-delay-4">

          {/* Header row */}
          <div className="px-5 py-3 flex items-center gap-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
            <span className="text-white/25 text-xs font-mono w-6">#</span>
            <span className="text-white/25 text-xs font-mono flex-1">Player</span>
            <span className="text-white/25 text-xs font-mono w-20 text-right">Score</span>
            <span className="text-white/25 text-xs font-mono w-20 text-right hidden sm:block">Cash</span>
            <span className="text-white/25 text-xs font-mono w-14 text-right hidden md:block">Acc</span>
          </div>

          {isEmpty ? (
            <div className="py-16 text-center">
              <p className="text-5xl mb-4">🎮</p>
              <p className="text-white/40 font-display font-semibold text-lg mb-2">No scores yet</p>
              <p className="text-white/25 text-sm font-body">Be the first to complete BizGenie!</p>
            </div>
          ) : (
            leaderboard.map((entry, i) => {
              const grade = GRADE_MAP(entry.accuracy, entry.finalCash)
              const isTop3 = i < 3
              return (
                <div
                  key={entry.timestamp || i}
                  className="px-5 py-4 flex items-center gap-3 transition-colors"
                  style={{
                    borderBottom: i < leaderboard.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    background: isTop3 ? 'rgba(245,166,35,0.03)' : 'transparent',
                  }}
                >
                  {/* Rank */}
                  <div className="w-6 text-center">
                    {i < 3
                      ? <span className="text-base">{MEDALS[i]}</span>
                      : <span className="text-white/25 text-xs font-mono">{i + 1}</span>
                    }
                  </div>

                  {/* Player info */}
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span className="text-lg flex-shrink-0">{entry.businessEmoji}</span>
                    <div className="min-w-0">
                      <p className="text-white/90 text-sm font-display font-semibold truncate">
                        {entry.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-body" style={{ color: grade.color }}>{grade.label}</span>
                        <span className="text-white/20 text-xs hidden sm:block">· {entry.businessLabel || entry.businessType}</span>
                        {entry.maxStreak > 2 && <span className="text-white/30 text-xs">🔥{entry.maxStreak}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="w-20 text-right">
                    <span className="font-display font-bold text-sm" style={{ color: isTop3 ? '#f5a623' : 'rgba(255,255,255,0.7)' }}>
                      {entry.score.toLocaleString()}
                    </span>
                  </div>

                  {/* Cash */}
                  <div className="w-20 text-right hidden sm:block">
                    <span className="text-xs font-mono"
                      style={{ color: entry.finalCash > 10000 ? '#00d68f' : '#ff4d6d' }}>
                      {fmt(entry.finalCash)}
                    </span>
                  </div>

                  {/* Accuracy */}
                  <div className="w-14 text-right hidden md:block">
                    <span className="text-xs font-mono text-white/40">{entry.accuracy}%</span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Legend */}
        <div className="glass-card p-5 mb-8">
          <p className="text-white/30 text-xs font-mono uppercase tracking-wider mb-4">Grade Legend</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Business Genius', desc: '80%+ accuracy, ₹50K+ cash', color: '#00d68f' },
              { label: 'Strategic Thinker', desc: '60%+ accuracy, ₹20K+ cash', color: '#f5a623' },
              { label: 'Rising Entrepreneur', desc: '40%+ accuracy', color: '#7b5ea7' },
              { label: 'Apprentice', desc: 'Still learning the ropes', color: '#ff4d6d' },
            ].map(g => (
              <div key={g.label} className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: g.color }} />
                <div>
                  <p className="text-xs font-display font-semibold" style={{ color: g.color }}>{g.label}</p>
                  <p className="text-white/30 text-xs font-body">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          <button onClick={goToLanding} className="flex-1 py-3.5 rounded-xl text-white/60 font-display font-semibold text-sm btn-outline">
            ← Home
          </button>
          <button onClick={goToOnboarding} className="flex-1 btn-gold py-3.5 rounded-xl text-obsidian font-display font-bold text-sm">
            Play & Climb the Board →
          </button>
        </div>
      </div>
    </div>
  )
}
