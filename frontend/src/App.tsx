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
        <h1 className="text-5xl font-bold text-gradient mb-4">
          MegaETH Cookie Clicker
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          The world's first fully on-chain cookie clicker game.
          Every click is a blockchain transaction on MegaETH's lightning-fast network.
        </p>
      </header>

      <main className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-6xl">
        {/* Game Section */}
        <section className="flex-1 text-center">
          <div className="leaderboard-card mb-6">
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
                <ClickButton className="w-48 h-48 rounded-full text-2xl font-bold" />
              </div>
            )}

            {!isConnected && (
              <>
                <p className="text-gray-600 mb-6">
                  Connect your wallet to start clicking!
                </p>
                <button
                  className="click-button mobile-friendly w-48 h-48 rounded-full text-2xl font-bold opacity-50 cursor-not-allowed"
                  disabled
                >
                  🍪
                  <div className="text-sm mt-2">Click Me!</div>
                </button>
              </>
            )}
          </div>

          {/* Wallet Connection */}
          <div className="text-center">
            <ConnectButton />
            <p className="text-sm text-gray-500 mt-2">
              Need testnet ETH? Visit the{' '}
              <a
                href="https://testnet.megaeth.com/#2"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-800 underline"
              >
                MegaETH Faucet
              </a>
            </p>
          </div>
        </section>

        {/* Leaderboard Section */}
        <section className="flex-1 w-full lg:w-auto">
          <LeaderboardTable />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>Built on MegaETH • Every click is on-chain • Open Source</p>
        <div className="mt-2 space-x-4">
          <button
            onClick={handleShowOnboarding}
            className="hover:text-primary-600 underline"
          >
            Tutorial
          </button>
          <a href="#" className="hover:text-primary-600">About</a>
          <a href="#" className="hover:text-primary-600">GitHub</a>
          <a href="https://docs.megaeth.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600">
            MegaETH Docs
          </a>
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