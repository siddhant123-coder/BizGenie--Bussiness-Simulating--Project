import { useState } from 'react'
import { useGameStore, BUSINESS_TYPES } from '../hooks/useGameStore'
import ThreeBackground from './ThreeBackground'

const STEPS = ['name', 'business', 'ready']

export default function OnboardingScreen() {
  const { setPlayerProfile, startGame, goToLanding } = useGameStore()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [selectedBiz, setSelectedBiz] = useState(null)
  const [nameError, setNameError] = useState('')

  const currentStep = STEPS[step]

  const handleNameNext = () => {
    if (!name.trim() || name.trim().length < 2) {
      setNameError('Please enter at least 2 characters')
      return
    }
    setNameError('')
    setStep(1)
  }

  const handleBizSelect = (bizId) => {
    setSelectedBiz(bizId)
  }

  const handleBizNext = () => {
    if (!selectedBiz) return
    setPlayerProfile(name, selectedBiz)
    setStep(2)
  }

  const handleStart = () => {
    startGame()
  }

  const biz = BUSINESS_TYPES.find(b => b.id === selectedBiz)

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      <ThreeBackground variant="landing" />
      <div className="grain" />

      {/* Grid bg */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(245,166,35,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px', zIndex: 1 }} />

      {/* Vignette */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(6,6,9,0.92) 100%)', zIndex: 2 }} />

      <div className="relative z-10 w-full max-w-lg">

        {/* Back button */}
        <button onClick={step === 0 ? goToLanding : () => setStep(s => s - 1)} className="flex items-center gap-2 text-white/30 hover:text-white/60 text-sm font-body mb-8 transition-colors">
          ← {step === 0 ? 'Back to home' : 'Back'}
        </button>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-300"
                style={{
                  background: i <= step ? 'rgba(245,166,35,0.9)' : 'rgba(255,255,255,0.06)',
                  color: i <= step ? '#0a0a0f' : 'rgba(255,255,255,0.3)',
                  border: i === step ? '2px solid #ffd166' : '1px solid transparent',
                }}>
                {i < step ? '✓' : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className="h-px w-8 transition-all duration-500" style={{ background: i < step ? '#f5a623' : 'rgba(255,255,255,0.1)' }} />
              )}
            </div>
          ))}
          <span className="ml-2 text-white/30 text-xs font-mono">
            {step === 0 ? 'Your name' : step === 1 ? 'Business type' : 'Ready to play'}
          </span>
        </div>

        {/* ── STEP 0: Name ── */}
        {currentStep === 'name' && (
          <div className="fade-in-up">
            <div className="mb-2">
              <span className="text-gold/70 text-xs font-mono uppercase tracking-widest">Step 1 of 3</span>
            </div>
            <h2 className="font-display font-bold text-3xl text-white mb-2" style={{ letterSpacing: '-0.02em' }}>
              What's your name?
            </h2>
            <p className="text-white/40 text-sm font-body mb-8">
              BizGenie will personalise your experience and put you on the leaderboard.
            </p>

            <div className="glass-card p-6">
              <label className="block text-white/40 text-xs font-mono uppercase tracking-wider mb-3">
                Your Name / Nickname
              </label>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setNameError('') }}
                onKeyDown={e => e.key === 'Enter' && handleNameNext()}
                placeholder="e.g. Arjun, TechFounder99..."
                autoFocus
                maxLength={24}
                className="w-full px-4 py-3 rounded-xl text-white font-body text-base outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: nameError ? '1px solid rgba(255,77,109,0.5)' : '1px solid rgba(255,255,255,0.1)',
                  caretColor: '#f5a623',
                }}
              />
              {nameError && <p className="text-crimson text-xs mt-2 font-body">{nameError}</p>}

              <div className="flex justify-between items-center mt-2 mb-6">
                <span className="text-white/20 text-xs font-mono">{name.length}/24</span>
              </div>

              <button onClick={handleNameNext} className="btn-gold w-full py-3.5 rounded-xl text-obsidian font-display font-bold text-sm">
                Continue →
              </button>
            </div>

            {/* Name preview */}
            {name.trim().length >= 2 && (
              <div className="mt-4 flex items-center gap-2 px-4 fade-in-up">
                <span className="text-white/30 text-sm">Hello,</span>
                <span className="text-gold font-display font-bold text-lg">{name.trim()}</span>
                <span className="text-white/30 text-sm">— ready to build your empire? 🔥</span>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 1: Business type ── */}
        {currentStep === 'business' && (
          <div className="fade-in-up">
            <div className="mb-2">
              <span className="text-gold/70 text-xs font-mono uppercase tracking-widest">Step 2 of 3</span>
            </div>
            <h2 className="font-display font-bold text-3xl text-white mb-2" style={{ letterSpacing: '-0.02em' }}>
              What kind of business, <span className="gold-text">{name}</span>?
            </h2>
            <p className="text-white/40 text-sm font-body mb-6">
              BizGenie will flavour the scenarios to match your industry.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {BUSINESS_TYPES.map(bt => (
                <button
                  key={bt.id}
                  onClick={() => handleBizSelect(bt.id)}
                  className="p-4 rounded-xl text-left transition-all duration-200 group"
                  style={{
                    background: selectedBiz === bt.id ? 'rgba(245,166,35,0.1)' : 'rgba(255,255,255,0.03)',
                    border: selectedBiz === bt.id ? '1.5px solid rgba(245,166,35,0.5)' : '1px solid rgba(255,255,255,0.07)',
                    boxShadow: selectedBiz === bt.id ? '0 0 20px rgba(245,166,35,0.1)' : 'none',
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{bt.emoji}</span>
                    {selectedBiz === bt.id && <span className="text-gold text-xs">✓</span>}
                  </div>
                  <p className="font-display font-semibold text-sm text-white/90 mb-0.5">{bt.label}</p>
                  <p className="text-white/35 text-xs font-body leading-snug">{bt.desc}</p>
                </button>
              ))}
            </div>

            <button
              onClick={handleBizNext}
              disabled={!selectedBiz}
              className="btn-gold w-full py-3.5 rounded-xl text-obsidian font-display font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
            >
              {selectedBiz ? `Start as ${biz?.label} Founder →` : 'Select your business type'}
            </button>
          </div>
        )}

        {/* ── STEP 2: Ready ── */}
        {currentStep === 'ready' && (
          <div className="fade-in-up text-center">
            <div className="text-7xl mb-6 animate-float">{biz?.emoji || '🚀'}</div>

            <div className="mb-2">
              <span className="text-gold/70 text-xs font-mono uppercase tracking-widest">All set!</span>
            </div>
            <h2 className="font-display font-bold text-3xl text-white mb-3" style={{ letterSpacing: '-0.02em' }}>
              Welcome, <span className="gold-text">{name}</span>!
            </h2>
            <p className="text-white/50 text-sm font-body mb-8 leading-relaxed">
              You're starting a <span className="text-white/80 font-medium">{biz?.label}</span> venture with{' '}
              <span className="text-gold font-semibold">₹10,000</span>.<br/>
              10 real business scenarios await. Your decisions will make or break you.
            </p>

            {/* Summary card */}
            <div className="glass-card p-5 mb-8 text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)' }}>
                  {biz?.emoji}
                </div>
                <div>
                  <p className="text-white/90 font-display font-semibold">{name}'s {biz?.label}</p>
                  <p className="text-white/40 text-xs font-body mt-0.5">Starting capital: ₹10,000 · 10 scenarios</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-gold font-display font-bold text-lg">₹10,000</p>
                  <p className="text-white/30 text-xs">seed money</p>
                </div>
              </div>
            </div>

            {/* Rules quick glance */}
            <div className="text-left mb-8 space-y-2">
              {[
                'Every decision changes your real cash balance',
                'Right choices unlock business concept explanations',
                'Run out of cash = game over (like real life)',
                'Your final score goes on the global leaderboard',
              ].map((rule, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-white/50 font-body">
                  <span className="text-gold mt-0.5 flex-shrink-0">▹</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleStart}
              className="btn-gold w-full py-4 rounded-2xl text-obsidian font-display font-bold text-base shadow-gold-lg"
              style={{ fontSize: '1.05rem' }}
            >
              Launch My {biz?.label} →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
