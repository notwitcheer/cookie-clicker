import { useState } from 'react'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Welcome to MegaETH Cookie Clicker! 🍪",
      content: (
        <div className="space-y-4">
          <p>This is the world's first fully on-chain cookie clicker game!</p>
          <p>Every click you make sends a real transaction to the MegaETH blockchain.</p>
          <p className="text-primary-600 font-semibold">
            Thanks to MegaETH's lightning-fast 10ms block times, each click feels instant!
          </p>
        </div>
      )
    },
    {
      title: "Step 1: Connect Your Wallet 👛",
      content: (
        <div className="space-y-4">
          <p>First, you'll need to connect a Web3 wallet to play.</p>
          <ul className="list-disc list-inside space-y-2 text-left">
            <li>MetaMask, WalletConnect, and other wallets are supported</li>
            <li>Click the "Connect Wallet" button to get started</li>
            <li>Make sure you're on the MegaETH testnet</li>
          </ul>
        </div>
      )
    },
    {
      title: "Step 2: Get Testnet ETH ⛽",
      content: (
        <div className="space-y-4">
          <p>You'll need some testnet ETH to pay for transaction fees.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-blue-800">Free Testnet ETH:</p>
            <p className="text-blue-700">Visit the MegaETH faucet to get 0.005 ETH</p>
            <a
              href="https://testnet.megaeth.com/#2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Open Faucet →
            </a>
          </div>
        </div>
      )
    },
    {
      title: "Step 3: Register to Play 📝",
      content: (
        <div className="space-y-4">
          <p>Before you can start clicking, you need to register as a player.</p>
          <ul className="list-disc list-inside space-y-2 text-left">
            <li>Registration is a one-time transaction</li>
            <li>It costs a small amount of gas (~$0.001)</li>
            <li>This creates your player profile on-chain</li>
          </ul>
        </div>
      )
    },
    {
      title: "Step 4: Start Clicking! 🎮",
      content: (
        <div className="space-y-4">
          <p>Now for the fun part - start clicking to earn points!</p>
          <ul className="list-disc list-inside space-y-2 text-left">
            <li><strong>Each click = 1 blockchain transaction</strong></li>
            <li>Rate limited to 1 click per block (~10ms)</li>
            <li>Your score is stored permanently on-chain</li>
            <li>Compete on the global leaderboard!</li>
          </ul>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
            <p className="text-purple-800 font-semibold">💡 Pro Tip:</p>
            <p className="text-purple-700">The faster you click, the higher you'll climb the leaderboard!</p>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Play! 🚀",
      content: (
        <div className="space-y-4">
          <p className="text-lg font-semibold">You're all set to start playing!</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h4 className="font-semibold text-green-800">What makes this special:</h4>
              <ul className="list-disc list-inside text-green-700 space-y-1">
                <li>Fully decentralized</li>
                <li>Transparent scoring</li>
                <li>Real-time blockchain gaming</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-semibold text-blue-800">Need help?</h4>
              <ul className="list-disc list-inside text-blue-700 space-y-1">
                <li>Check the MegaETH docs</li>
                <li>Ask in Discord</li>
                <li>Follow @megaeth_labs</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ]

  if (!isOpen) return null

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipToEnd = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{steps[currentStep].title}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl leading-none"
              title="Close"
            >
              ×
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded ${
                    index <= currentStep ? 'bg-white' : 'bg-white bg-opacity-30'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-200 mt-2">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="text-center text-gray-800">
            {steps[currentStep].content}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Back
            </button>
          </div>

          <div className="flex space-x-2">
            {currentStep < steps.length - 1 && (
              <button
                onClick={skipToEnd}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 underline"
              >
                Skip tutorial
              </button>
            )}
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
            >
              {currentStep === steps.length - 1 ? 'Start Playing!' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}