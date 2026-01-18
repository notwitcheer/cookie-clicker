import { useRegister, useIsRegistered, useGameStatus } from '../../hooks'
import { trackError, trackAction } from '../../lib/errorTracking'
import { useEffect } from 'react'

interface RegisterButtonProps {
  onRegistrationSuccess?: () => void
  className?: string
}

export function RegisterButton({
  onRegistrationSuccess,
  className = ''
}: RegisterButtonProps) {
  const { canPlay } = useGameStatus()
  const { isRegistered, isLoading: checkingRegistration } = useIsRegistered()
  const { register, isPending, isConfirming, isSuccess, error } = useRegister()

  // Handle successful registration
  useEffect(() => {
    if (isSuccess) {
      trackAction('Registration Success', {
        component: 'RegisterButton'
      })
      if (onRegistrationSuccess) {
        onRegistrationSuccess()
      }
    }
  }, [isSuccess, onRegistrationSuccess])

  // Handle registration errors
  useEffect(() => {
    if (error) {
      trackError(error, {
        component: 'RegisterButton',
        action: 'Registration Transaction',
        additional: {
          canPlay,
          checkingRegistration
        }
      })
    }
  }, [error, canPlay, checkingRegistration])

  // Don't show if already registered
  if (isRegistered) {
    return null
  }

  const handleRegister = () => {
    if (!canPlay || isPending || isConfirming) {
      return
    }
    register()
  }

  const isDisabled = !canPlay || isPending || isConfirming || checkingRegistration

  const getButtonText = () => {
    if (!canPlay) return 'Connect Wallet First'
    if (checkingRegistration) return 'Checking...'
    if (isPending) return 'Submitting...'
    if (isConfirming) return 'Confirming...'
    return 'Register to Play'
  }

  const getHelpfulErrorMessage = (error: Error) => {
    const message = error.message.toLowerCase()

    if (message.includes('user rejected') || message.includes('user denied')) {
      return {
        title: 'Registration Cancelled',
        message: 'You cancelled the registration in your wallet. Try again when ready.',
        action: 'Try Again'
      }
    }

    if (message.includes('insufficient funds') || message.includes('insufficient balance')) {
      return {
        title: 'Not Enough ETH',
        message: 'You need more ETH to pay for registration gas fees.',
        action: 'Get Testnet ETH',
        actionUrl: 'https://testnet.megaeth.com/#2'
      }
    }

    if (message.includes('already registered') || message.includes('already exists')) {
      return {
        title: 'Already Registered',
        message: 'This wallet is already registered. You can start clicking!',
        action: 'Refresh Page'
      }
    }

    if (message.includes('network') || message.includes('connection') || message.includes('rpc')) {
      return {
        title: 'Network Issue',
        message: 'Having trouble connecting to MegaETH. Check your network and try again.',
        action: 'Retry'
      }
    }

    // Default error
    return {
      title: 'Registration Failed',
      message: 'Something went wrong with registration. Please try again.',
      action: 'Try Again'
    }
  }

  return (
    <div className="text-center">
      <button
        onClick={handleRegister}
        disabled={isDisabled}
        className={`
          wallet-button
          ${isPending || isConfirming ? 'opacity-75 cursor-not-allowed' : ''}
          ${error ? 'bg-red-500 hover:bg-red-600' : ''}
          ${isSuccess ? 'bg-green-500 hover:bg-green-600' : ''}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
      >
        {getButtonText()}
      </button>

      {/* Enhanced Error Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4 max-w-sm mx-auto">
          {(() => {
            const helpfulError = getHelpfulErrorMessage(error)
            return (
              <div className="text-center">
                <h4 className="font-semibold text-red-800 mb-2">{helpfulError.title}</h4>
                <p className="text-red-700 text-sm mb-3 error-message">{helpfulError.message}</p>
                {helpfulError.actionUrl ? (
                  <a
                    href={helpfulError.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                  >
                    {helpfulError.action} →
                  </a>
                ) : (
                  <button
                    onClick={() => register()}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                  >
                    {helpfulError.action}
                  </button>
                )}
              </div>
            )
          })()}
        </div>
      )}

      {(isPending || isConfirming) && (
        <div className="text-blue-600 text-xs mt-2">
          {isPending ? 'Sending registration...' : 'Confirming registration...'}
        </div>
      )}

      {/* Help text */}
      <div className="text-gray-500 text-xs mt-2 max-w-xs mx-auto">
        Registration is required before you can start clicking. This is a one-time transaction.
      </div>
    </div>
  )
}