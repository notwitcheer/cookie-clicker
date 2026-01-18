import { useState, useEffect, useCallback } from 'react'
import './index.css'
import { trackAction } from './lib/errorTracking'
import {
  ClickButton,
  ScoreDisplay,
  RegisterButton,
  LeaderboardTable,
  PlayerRank,
  ConnectButton,
  OnboardingModal
} from './components'
import { useGameStatus, useIsRegistered } from './hooks'

function App() {
  const { isConnected } = useGameStatus()
  const { isRegistered } = useIsRegistered()

  // Check if user has seen onboarding before - using useState initializer to avoid effect
  const [showOnboarding, setShowOnboarding] = useState(() => {
    const hasSeenOnboarding = localStorage.getItem('megaeth-clicker-onboarding-seen')
    return !hasSeenOnboarding
  })

  const handleOnboardingClose = useCallback(() => {
    setShowOnboarding(false)
    localStorage.setItem('megaeth-clicker-onboarding-seen', 'true')
  }, [])

  const handleShowOnboarding = useCallback(() => {
    trackAction('Show Onboarding Modal', {
      component: 'App'
    })
    setShowOnboarding(true)
  }, [])

  // Track wallet connection state changes
  useEffect(() => {
    if (isConnected) {
      trackAction('Wallet Connected', {
        component: 'App',
        additional: { isRegistered }
      })
    }
  }, [isConnected, isRegistered])

  // Track app initialization
  useEffect(() => {
    trackAction('App Initialized', {
      component: 'App',
      additional: {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      }
    })
  }, [])

  return (
    <div className="game-container safe-area">
      <header className="text-center mb-8">
        <h1 className="text-6xl font-bold cookie-title mb-4 animate-float">
          🍪 MegaETH Cookie Clicker 🍪
        </h1>
        <p className="text-lg bakery-text max-w-2xl mx-auto leading-relaxed">
          Welcome to the <span className="font-semibold text-caramel-600">sweetest</span> corner of Web3! 🧁<br/>
          Every delicious click is a <span className="font-semibold text-accent-600">real blockchain transaction</span> on MegaETH's lightning-fast network.
          <br/>
          <span className="text-primary-700 font-medium">Get ready to bake some serious blockchain magic! ✨</span>
        </p>
      </header>

      <main className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-6xl">
        {/* Game Section */}
        <section className="flex-1 text-center">
          <div className="bakery-card mb-6">
            {isConnected && <ScoreDisplay className="mb-4" />}

            {!isConnected && (
              <div className="score-display mb-4">
                0 Clicks
              </div>
            )}

            {isConnected && <PlayerRank className="mb-4 justify-center" />}

            {isConnected && !isRegistered && (
              <div className="mb-6">
                <RegisterButton />
              </div>
            )}

            {isConnected && isRegistered && (
              <div className="mb-6">
                <ClickButton className="w-48 h-48 rounded-full text-2xl font-bold cookie-hover" />
              </div>
            )}

            {!isConnected && (
              <>
                <p className="text-gray-600 mb-6">
                  Connect your wallet to start clicking!
                </p>
                <button
                  className="click-button mobile-friendly w-48 h-48 rounded-full text-2xl font-bold opacity-50 cursor-not-allowed relative"
                  disabled
                  title="Connect your wallet first! 🦊"
                >
                  🍪
                  <div className="text-sm mt-2">Click Me!</div>
                  <div className="absolute inset-0 bg-primary-200/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-primary-700 font-semibold text-sm">🔒 Locked</span>
                  </div>
                </button>
              </>
            )}
          </div>

          {/* Wallet Connection */}
          <div className="text-center">
            <ConnectButton />
            <div className="mt-4 p-3 bg-accent-50/50 rounded-xl border border-accent-200">
              <p className="text-sm bakery-text">
                🚰 Need testnet ETH? Visit the{' '}
                <a
                  href="https://testnet.megaeth.com/#2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-caramel-600 hover:text-caramel-800 underline font-semibold"
                >
                  MegaETH Faucet
                </a>
                {' '}for free tokens! 💰
              </p>
            </div>
          </div>
        </section>

        {/* Leaderboard Section */}
        <section className="flex-1 w-full lg:w-auto">
          <LeaderboardTable />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center">
        <div className="bg-cream-50/80 backdrop-blur-sm border-2 border-accent-200 rounded-2xl p-6 max-w-2xl mx-auto">
          <p className="bakery-text font-semibold mb-3">
            🚀 Built on <span className="text-caramel-600">MegaETH</span> •
            ⛓️ Every click is <span className="text-accent-600">on-chain</span> •
            💻 <span className="text-primary-600">Open Source</span> ✨
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <button
              onClick={handleShowOnboarding}
              className="fun-button px-3 py-2 bg-mint-100 hover:bg-mint-200 text-mint-800 rounded-lg font-medium transition-colors"
            >
              📚 Tutorial
            </button>
            <a href="#" className="fun-button px-3 py-2 bg-cherry-100 hover:bg-cherry-200 text-cherry-800 rounded-lg font-medium transition-colors">
              ℹ️ About
            </a>
            <a href="#" className="fun-button px-3 py-2 bg-primary-100 hover:bg-primary-200 text-primary-800 rounded-lg font-medium transition-colors">
              🐙 GitHub
            </a>
            <a
              href="https://docs.megaeth.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="fun-button px-3 py-2 bg-caramel-100 hover:bg-caramel-200 text-caramel-800 rounded-lg font-medium transition-colors"
            >
              📖 MegaETH Docs
            </a>
          </div>
        </div>
      </footer>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleOnboardingClose}
      />
    </div>
  )
}

export default App