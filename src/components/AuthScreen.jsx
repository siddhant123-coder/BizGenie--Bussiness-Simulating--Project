import { useState } from 'react'
import { useGameStore } from '../hooks/useGameStore'
import ThreeBackground from './ThreeBackground'
import { register, login } from '../lib/api-client'

export default function AuthScreen() {
  const { setAuthUser, goToLanding } = useGameStore()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (!email.trim() || !password.trim()) { setError('Please fill in all fields.'); return }
    if (mode === 'register' && name.trim().length < 2) { setError('Name must be at least 2 characters.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }

    setLoading(true)
    try {
      const data = mode === 'register'
        ? await register(name.trim(), email.trim().toLowerCase(), password)
        : await login(email.trim().toLowerCase(), password)
      setAuthUser(data.user.name, data.accessToken)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      <ThreeBackground variant="landing" />
      <div className="grain" />
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(245,166,35,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px', zIndex: 1 }} />
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(6,6,9,0.92) 100%)', zIndex: 2 }} />

      <div className="relative z-10 w-full max-w-md">
        <button onClick={goToLanding} className="flex items-center gap-2 text-white/30 hover:text-white/60 text-sm font-body mb-8 transition-colors">
          ← Back to home
        </button>

        <div className="text-center mb-8 fade-in-up">
          <h1 className="font-display font-extrabold mb-1" style={{ fontSize: '3rem', letterSpacing: '-0.03em' }}>
            <span className="text-white">Biz</span><span className="gold-text">Genie</span>
          </h1>
          <p className="text-white/30 text-sm font-body">
            {mode === 'login' ? 'Welcome back, founder 👋' : 'Create your founder account'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex mb-6 p-1 rounded-xl fade-in-up fade-in-up-delay-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError('') }}
              className="flex-1 py-2.5 rounded-lg text-sm font-display font-semibold transition-all duration-200"
              style={{
                background: mode === m ? 'rgba(245,166,35,0.15)' : 'transparent',
                color: mode === m ? '#f5a623' : 'rgba(255,255,255,0.3)',
                border: mode === m ? '1px solid rgba(245,166,35,0.3)' : '1px solid transparent',
              }}>
              {m === 'login' ? 'Log In' : 'Register'}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="glass-card p-6 fade-in-up fade-in-up-delay-2">
          {mode === 'register' && (
            <div className="mb-4">
              <label className="block text-white/40 text-xs font-mono uppercase tracking-wider mb-2">Your Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Arjun" maxLength={24}
                className="w-full px-4 py-3 rounded-xl text-white font-body text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', caretColor: '#f5a623' }} />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-white/40 text-xs font-mono uppercase tracking-wider mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              className="w-full px-4 py-3 rounded-xl text-white font-body text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', caretColor: '#f5a623' }} />
          </div>

          <div className="mb-5">
            <label className="block text-white/40 text-xs font-mono uppercase tracking-wider mb-2">
              Password {mode === 'register' && <span className="text-white/20">(min 8 chars)</span>}
            </label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              className="w-full px-4 py-3 rounded-xl text-white font-body text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', caretColor: '#f5a623' }} />
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-xs font-body"
              style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)', color: '#ff4d6d' }}>
              {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            className="btn-gold w-full py-3.5 rounded-xl text-obsidian font-display font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Please wait...' : mode === 'login' ? 'Log In & Play →' : 'Create Account & Play →'}
          </button>
        </div>

        <p className="text-center text-white/25 text-xs font-body mt-5">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
            className="text-gold/70 hover:text-gold transition-colors underline underline-offset-2">
            {mode === 'login' ? 'Register here' : 'Log in here'}
          </button>
        </p>
      </div>
    </div>
  )
}
