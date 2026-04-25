import { useGameStore } from '../hooks/useGameStore'
import ThreeBackground from './ThreeBackground'

const TICKER_ITEMS = 'LEAN STARTUP  •  BLUE OCEAN STRATEGY  •  D2C MODEL  •  EQUITY NEGOTIATION  •  CRISIS MANAGEMENT  •  CASH FLOW  •  FIXED vs VARIABLE COSTS  •  PRE-ORDER MODEL  •  EXIT STRATEGY  •  MVP  •  '

export default function LandingScreen() {
  // const { goToOnboarding, goToLeaderboard, leaderboard } = useGameStore()
  const { goToAuth, goToLeaderboard, leaderboard } = useGameStore()
  const topPlayer = leaderboard && leaderboard[0]

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <ThreeBackground variant="landing" />
      <div className="grain" />

      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(245,166,35,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px', zIndex: 1 }} />

      {/* Vignette */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(6,6,9,0.9) 100%)', zIndex: 2 }} />

      {/* Leaderboard peek — top right */}
      <div className="fixed top-5 right-5 z-30">
        <button
          onClick={goToLeaderboard}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-display font-semibold transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
        >
          🏆 Leaderboard
          {topPlayer && (
            <span className="text-gold ml-1">{topPlayer.name}</span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 fade-in-up fade-in-up-delay-1"
          style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="text-gold text-xs font-display font-semibold tracking-widest uppercase">Business Simulation Game</span>
        </div>

        {/* Main heading */}
        <h1 className="font-display font-extrabold mb-4 fade-in-up fade-in-up-delay-2"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', lineHeight: 1.0, letterSpacing: '-0.03em' }}>
          <span className="text-white">Biz</span>
          <span className="gold-text">Genie</span>
        </h1>

        {/* Subheading */}
        <p className="text-white/50 mb-3 fade-in-up fade-in-up-delay-3 font-body"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.35rem)', maxWidth: '560px', lineHeight: 1.6 }}>
          Start with <span className="text-gold font-semibold">₹10,000</span> and navigate{' '}
          <span className="text-white/80">10 real business scenarios</span>.
          Make decisions. Face consequences. Learn what it actually takes.
        </p>

        {/* Concept pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 fade-in-up fade-in-up-delay-3">
          {['MVP', 'Blue Ocean', 'D2C', 'Equity', 'Crisis Mgmt', 'Cash Flow', 'Exit Strategy'].map(tag => (
            <span key={tag} className="text-xs font-mono px-3 py-1 rounded-full text-white/40"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-8 mb-10 fade-in-up fade-in-up-delay-4">
          {[
            { val: '₹10K', label: 'Starting Capital' },
            { val: '10', label: 'Real Scenarios' },
            { val: '10+', label: 'Concepts Taught' },
          ].map(({ val, label }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="font-display font-bold text-2xl gold-text">{val}</span>
              <span className="text-white/30 text-xs font-body mt-0.5">{label}</span>
            </div>
          ))}
        </div>

        {/* Leaderboard mini preview */}
        {topPlayer && (
          <div className="mb-8 fade-in-up fade-in-up-delay-4 cursor-pointer" onClick={goToLeaderboard}>
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl"
              style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.15)' }}>
              <span className="text-lg">🥇</span>
              <div className="text-left">
                <p className="text-white/30 text-xs font-mono">Current champion</p>
                <p className="text-gold font-display font-semibold text-sm">
                  {topPlayer.businessEmoji} {topPlayer.name} — {topPlayer.score.toLocaleString()} pts
                </p>
              </div>
              <span className="text-white/30 text-xs">→</span>
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 fade-in-up fade-in-up-delay-5">
          {/* <button onClick={goToOnboarding} */}
          <button onClick={goToAuth}
            className="btn-gold px-10 py-4 rounded-2xl text-obsidian text-base font-display font-bold tracking-wide shadow-gold"
            style={{ background: 'linear-gradient(135deg, #f5a623, #ffd166, #c47d0e)', backgroundSize: '200% auto' }}>
            Start Your Business →
          </button>
          <button onClick={goToLeaderboard}
            className="px-8 py-4 rounded-2xl text-sm font-display font-semibold btn-outline">
            🏆 View Leaderboard
          </button>
        </div>

        <p className="text-white/20 text-xs mt-8 font-body fade-in-up fade-in-up-delay-5">
          Scenarios inspired by Amazon · Netflix · Zomato · Flipkart · Airbnb · Apple · Mamaearth
        </p>
      </div>

      {/* Bottom ticker tape */}
      <div className="fixed bottom-0 left-0 right-0 z-20 overflow-hidden py-2"
        style={{ background: 'rgba(245,166,35,0.06)', borderTop: '1px solid rgba(245,166,35,0.15)' }}>
        <div className="flex whitespace-nowrap ticker-tape">
          {[TICKER_ITEMS, TICKER_ITEMS].map((item, i) => (
            <span key={i} className="text-gold/50 text-xs font-mono mx-8 tracking-widest">{item}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
