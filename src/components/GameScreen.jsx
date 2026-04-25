import { useGameStore } from '../hooks/useGameStore'
import { SCENARIOS } from '../data/scenarios'
import ThreeBackground from './ThreeBackground'
import GameHUD from './GameHUD'

function fmt(n) {
  const abs = Math.abs(Math.round(n))
  return (n < 0 ? '-' : '+') + '₹' + abs.toLocaleString('en-IN')
}

function DifficultyBadge({ d }) {
  const map = { easy: ['BEGINNER', 'difficulty-easy'], med: ['INTERMEDIATE', 'difficulty-med'], hard: ['ADVANCED', 'difficulty-hard'] }
  const [label, cls] = map[d]
  return (
    <span className={`text-xs font-mono font-semibold px-3 py-1 rounded-full ${cls}`}>
      {label}
    </span>
  )
}

function ChoiceCard({ choice, index, selected, revealed, correctIndex }) {
  const { selectChoice, submitted } = useGameStore(s => ({
    selectChoice: s.selectChoice,
    submitted: s.revealed,
  }))

  let extraClass = ''
  if (revealed) {
    if (index === correctIndex) extraClass = 'correct'
    else if (index === selected && index !== correctIndex) extraClass = 'wrong'
  } else if (index === selected) {
    extraClass = 'selected'
  }

  return (
    <button
      className={`choice-option ${extraClass} w-full text-left`}
      onClick={() => selectChoice(index)}
      disabled={revealed}
    >
      <div className="flex items-start gap-3">
        {/* Index */}
        <span
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-semibold mt-0.5"
          style={{
            background: index === selected ? 'rgba(245,166,35,0.2)' : 'rgba(255,255,255,0.06)',
            color: index === selected ? '#f5a623' : 'rgba(255,255,255,0.4)',
            border: `1px solid ${index === selected ? 'rgba(245,166,35,0.4)' : 'rgba(255,255,255,0.08)'}`,
          }}
        >
          {String.fromCharCode(65 + index)}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-white/90 text-sm font-body font-medium leading-snug mb-1">
            {choice.label}
          </p>
          <p className="text-white/35 text-xs font-body leading-relaxed">
            {choice.effect}
          </p>
          {choice.cost !== 0 && (
            <span
              className="inline-block mt-1.5 text-xs font-mono px-2 py-0.5 rounded"
              style={{
                background: choice.cost > 0 ? 'rgba(255,77,109,0.1)' : 'rgba(0,214,143,0.1)',
                color: choice.cost > 0 ? '#ff4d6d' : '#00d68f',
                border: `1px solid ${choice.cost > 0 ? 'rgba(255,77,109,0.2)' : 'rgba(0,214,143,0.2)'}`,
              }}
            >
              {choice.cost > 0 ? `Costs ₹${choice.cost.toLocaleString('en-IN')}` : `Earns ₹${Math.abs(choice.cost).toLocaleString('en-IN')}`}
            </span>
          )}
        </div>

        {/* Reveal indicator */}
        {revealed && index === correctIndex && (
          <span className="text-emerald text-lg flex-shrink-0">✓</span>
        )}
        {revealed && index === selected && index !== correctIndex && (
          <span className="text-crimson text-lg flex-shrink-0">✗</span>
        )}
      </div>
    </button>
  )
}

export default function GameScreen() {
  const {
    scenarioIndex, selectedChoice, revealed,
    submitChoice, nextScenario, cash,
  } = useGameStore()

  const scenario = SCENARIOS[scenarioIndex]
  if (!scenario) return null

  const moneyDelta = revealed ? scenario.moneyChange[selectedChoice] : null
  const isCorrect = revealed && selectedChoice === scenario.correct
  const isBankrupt = cash <= 0

  return (
    <div className="relative min-h-screen">
      <ThreeBackground variant="game" />
      <div className="grain" />

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, transparent 50%, rgba(6,6,9,0.7) 100%)',
          zIndex: 1,
        }}
      />

      <GameHUD />

      {/* Main content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-24 pb-16">

        {/* Scenario header */}
        <div className="mb-6 fade-in-up">
          <div className="flex items-center gap-3 mb-3">
            <DifficultyBadge d={scenario.difficulty} />
            <span className="text-white/25 text-xs font-mono tracking-wider">{scenario.category}</span>
            <span className="text-white/15 text-xs font-mono">#{scenario.id}/10</span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{scenario.icon}</span>
            <h2
              className="font-display font-bold text-white"
              style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', letterSpacing: '-0.02em' }}
            >
              {scenario.title}
            </h2>
          </div>
        </div>

        {/* Scenario card */}
        <div className="glass-card p-6 mb-4 fade-in-up fade-in-up-delay-1">
          {/* Context */}
          <p className="text-white/40 text-xs font-mono uppercase tracking-wider mb-3">
            SCENARIO CONTEXT
          </p>
          <p className="text-white/80 text-sm font-body leading-relaxed mb-4">
            {scenario.context}
          </p>

          {/* Situation */}
          <div
            className="p-4 rounded-xl mb-4 text-sm font-body leading-relaxed text-white/65"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {scenario.situation}
          </div>

          {/* Question */}
          <div
            className="p-4 rounded-xl"
            style={{
              background: 'rgba(245,166,35,0.06)',
              border: '1px solid rgba(245,166,35,0.2)',
              borderLeft: '3px solid #f5a623',
            }}
          >
            <p className="text-gold font-display font-semibold text-sm">
              {scenario.question}
            </p>
          </div>
        </div>

        {/* Choices */}
        <div className="flex flex-col gap-3 mb-4 fade-in-up fade-in-up-delay-2">
          {scenario.choices.map((choice, i) => (
            <ChoiceCard
              key={i}
              choice={choice}
              index={i}
              selected={selectedChoice}
              revealed={revealed}
              correctIndex={scenario.correct}
            />
          ))}
        </div>

        {/* Submit button */}
        {!revealed && (
          <button
            className="btn-gold w-full py-4 rounded-2xl text-obsidian font-display font-bold text-base transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
            onClick={submitChoice}
            disabled={selectedChoice === null}
          >
            {selectedChoice === null ? 'Select your decision above' : 'Confirm Decision →'}
          </button>
        )}

        {/* Reveal section */}
        {revealed && (
          <div className="space-y-4 fade-in-up">
            {/* Money change */}
            <div
              className="flex items-center justify-between p-4 rounded-xl font-display font-bold text-lg"
              style={{
                background: moneyDelta >= 0 ? 'rgba(0,214,143,0.1)' : 'rgba(255,77,109,0.1)',
                border: `1px solid ${moneyDelta >= 0 ? 'rgba(0,214,143,0.3)' : 'rgba(255,77,109,0.3)'}`,
              }}
            >
              <span className={moneyDelta >= 0 ? 'text-emerald' : 'text-crimson'}>
                {moneyDelta >= 0 ? '📈' : '📉'} Cash change: {fmt(moneyDelta)}
              </span>
              <span className="text-white/60 text-sm font-body font-normal">
                Balance: ₹{cash.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Result reveal */}
            <div className={`p-5 rounded-xl reveal-${isCorrect ? 'win' : moneyDelta > 0 ? 'neutral' : 'lose'}`}>
              <p className="font-display font-semibold text-sm mb-1">
                {isCorrect ? '✓ Correct Decision!' : '✗ Costly Lesson'}
              </p>
              <p className="text-sm font-body leading-relaxed opacity-90">
                {isCorrect ? scenario.reveal.win : scenario.reveal.lose}
              </p>
            </div>

            {/* Concept box */}
            <div className="concept-box">
              <p className="text-electric/70 text-xs font-mono tracking-wider mb-1 uppercase">
                Business Concept Unlocked
              </p>
              <p className="font-display font-bold text-white/90 text-sm mb-2">
                {scenario.concept.title}
              </p>
              <p className="text-white/55 text-xs font-body leading-relaxed">
                {scenario.concept.body}
              </p>
            </div>

            {/* Real example */}
            <div
              className="p-4 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <p className="text-white/30 text-xs font-mono uppercase tracking-wider mb-1">Real-World Example</p>
              <p className="text-white/60 text-xs font-body leading-relaxed">
                {scenario.realExample}
              </p>
            </div>

            {/* Bankrupt warning */}
            {isBankrupt && (
              <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)' }}>
                <p className="text-crimson font-display font-bold text-lg mb-1">💸 Bankrupt!</p>
                <p className="text-crimson/70 text-sm">Cash ran out — just like 90% of real startups. Cash is oxygen.</p>
              </div>
            )}

            {/* Next button */}
            <button
              className="btn-gold w-full py-4 rounded-2xl text-obsidian font-display font-bold text-base"
              onClick={nextScenario}
            >
              {isBankrupt
                ? 'See Results →'
                : scenarioIndex + 1 >= SCENARIOS.length
                ? 'See Final Results 🏆'
                : `Next: ${SCENARIOS[scenarioIndex + 1]?.title} →`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
