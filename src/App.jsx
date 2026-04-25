import { useGameStore } from './hooks/useGameStore'
import LandingScreen from './components/LandingScreen'
import OnboardingScreen from './components/OnboardingScreen'
import GameScreen from './components/GameScreen'
import FinalScreen from './components/FinalScreen'
import LeaderboardScreen from './components/LeaderboardScreen'
import AuthScreen from './components/AuthScreen'
import CustomCursor from './components/CustomCursor'

export default function App() {
  const screen = useGameStore(s => s.screen)

  return (
    <>
    <CustomCursor />
      {screen === 'landing'     && <LandingScreen />}
      {screen === 'auth'        && <AuthScreen />}
      {screen === 'onboarding'  && <OnboardingScreen />}
      {screen === 'game'        && <GameScreen />}
      {screen === 'final'       && <FinalScreen />}
      {screen === 'leaderboard' && <LeaderboardScreen />}
    </>
  )
}
