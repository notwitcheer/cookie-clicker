import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useClick, usePlayerData, useGameStatus } from '../../hooks'
import { trackError, trackAction } from '../../lib/errorTracking'

interface ClickButtonProps {
  onSuccessfulClick?: () => void
  disabled?: boolean
  className?: string
}

export function ClickButton({
  onSuccessfulClick,
  disabled = false,
  className = ''
}: ClickButtonProps) {
  const { canPlay } = useGameStatus()
  const { isRegistered, lastClickBlock } = usePlayerData()
  const { click, isPending, isConfirming, isSuccess, error } = useClick()

  const [showClickEffect, setShowClickEffect] = useState(false)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)
  const [ripples, setRipples] = useState<Array<{id: number, x: number, y: number}>>([])
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Handle successful click
  useEffect(() => {
    if (isSuccess && onSuccessfulClick) {
      trackAction('Click Success', {
        component: 'ClickButton',
        additional: { isRegistered, lastClickBlock }
      })
      onSuccessfulClick()
    }
  }, [isSuccess, onSuccessfulClick, isRegistered, lastClickBlock])

  // Handle click effect animation - trigger on isSuccess change
  useEffect(() => {
    if (isSuccess) {
      // Use a microtask to avoid direct setState in effect warning
      Promise.resolve().then(() => {
        setShowClickEffect(true)
        setTimeout(() => setShowClickEffect(false), 300)
      })
    }
  }, [isSuccess])

  // Handle errors
  useEffect(() => {
    if (error) {
      trackError(error, {
        component: 'ClickButton',
        action: 'Click Transaction',
        additional: {
          canPlay,
          isRegistered,
          isPending,
          isConfirming
        }
      })
    }
  }, [error, canPlay, isRegistered, isPending, isConfirming])

  // Calculate cooldown (approximate - MegaETH has ~10ms blocks)
  useEffect(() => {
    if (lastClickBlock > 0) {
      // Simple cooldown display - reset every second
      const interval = setInterval(() => {
        setCooldownRemaining(0)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [lastClickBlock])

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!canPlay || !isRegistered || disabled || isPending || isConfirming) {
      return
    }

    // Create ripple effect at click position
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const newRipple = {
        id: Date.now(),
        x,
        y
      }

      setRipples(prev => [...prev, newRipple])

      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
      }, 400)
    }

    click()
  }, [canPlay, isRegistered, disabled, isPending, isConfirming, click])

  const isDisabled = useMemo(() =>
    disabled || !canPlay || !isRegistered || isPending || isConfirming,
    [disabled, canPlay, isRegistered, isPending, isConfirming]
  )

  const buttonText = useMemo(() => {
    if (!canPlay) return 'Connect Wallet'
    if (!isRegistered) return 'Register First'
    if (isPending) return 'Submitting...'
    if (isConfirming) return 'Confirming...'
    return 'Click Me!'
  }, [canPlay, isRegistered, isPending, isConfirming])

  const buttonStatus = useMemo(() => {
    if (error) return 'error'
    if (isSuccess) return 'success'
    if (isPending || isConfirming) return 'loading'
    return 'default'
  }, [error, isSuccess, isPending, isConfirming])

  const getHelpfulErrorMessage = useCallback((error: Error) => {
    const message = error.message.toLowerCase()

    if (message.includes('user rejected') || message.includes('user denied')) {
      return {
        title: 'Transaction Cancelled',
        message: 'You cancelled the transaction in your wallet. Try clicking again when ready.',
        action: 'Try Again'
      }
    }

    if (message.includes('insufficient funds') || message.includes('insufficient balance')) {
      return {
        title: 'Not Enough ETH',
        message: 'You need more ETH to pay for gas fees.',
        action: 'Get Testnet ETH',
        actionUrl: 'https://testnet.megaeth.com/#2'
      }
    }

    if (message.includes('nonce') || message.includes('replacement')) {
      return {
        title: 'Transaction Conflict',
        message: 'Another transaction is pending. Wait for it to complete, then try again.',
        action: 'Wait & Retry'
      }
    }

    if (message.includes('one click per block') || message.includes('rate limit')) {
      return {
        title: 'Clicking Too Fast!',
        message: 'You can only click once per block (~10ms). Slow down slightly.',
        action: 'Try Again'
      }
    }

    if (message.includes('network') || message.includes('connection') || message.includes('rpc')) {
      return {
        title: 'Network Issue',
        message: 'Having trouble connecting to MegaETH. Check your network and try again.',
        action: 'Retry'
      }
    }

    if (message.includes('gas') && message.includes('limit')) {
      return {
        title: 'Gas Limit Too Low',
        message: 'The transaction needs more gas. This usually resolves itself.',
        action: 'Try Again'
      }
    }

    // Default error
    return {
      title: 'Transaction Failed',
      message: 'Something went wrong with your click. Please try again.',
      action: 'Try Again'
    }
  }, [])

  const buttonClassName = useMemo(() => `
    click-button mobile-friendly relative overflow-hidden
    ${showClickEffect ? 'animate-click' : ''}
    ${buttonStatus === 'loading' ? 'opacity-75 cursor-not-allowed' : ''}
    ${buttonStatus === 'error' ? 'bg-red-500 hover:bg-red-600' : ''}
    ${buttonStatus === 'success' ? 'bg-green-500 hover:bg-green-600' : ''}
    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `, [showClickEffect, buttonStatus, isDisabled, className])

  const titleText = useMemo(() => {
    if (error) return 'Click failed - try again'
    if (isPending) return 'Transaction submitted...'
    if (isConfirming) return 'Waiting for confirmation...'
    return 'Click to score!'
  }, [error, isPending, isConfirming])

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        ref={buttonRef}
        onClick={handleClick}
        disabled={isDisabled}
        className={buttonClassName}
        title={titleText}
      >
        {/* Cookie Emoji */}
        <div className="text-6xl mb-2">
          {buttonStatus === 'loading' ? (
            <div className="animate-spin text-4xl">⏳</div>
          ) : buttonStatus === 'error' ? (
            '❌'
          ) : buttonStatus === 'success' ? (
            '✅'
          ) : (
            '🍪'
          )}
        </div>

        {/* Button Text */}
        <div className="text-sm font-medium">
          {buttonText}
        </div>

        {/* Loading spinner overlay */}
        {(isPending || isConfirming) && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="animate-pulse text-white text-xs">
              {isPending ? 'Sending...' : 'Confirming...'}
            </div>
          </div>
        )}

        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="click-ripple"
            style={{
              left: ripple.x - 25, // Half of ripple size
              top: ripple.y - 25,
              width: 50,
              height: 50
            }}
          />
        ))}
      </button>

      {/* Enhanced Error Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-sm">
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
                    onClick={() => click()}
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

      {cooldownRemaining > 0 && (
        <div className="text-amber-600 text-xs">
          Cooldown: {cooldownRemaining}ms
        </div>
      )}

      {/* Help text */}
      <div className="text-gray-500 text-xs text-center max-w-xs">
        {!canPlay ? 'Connect your wallet to start playing'
         : !isRegistered ? 'You need to register first'
         : 'Each click sends a transaction to MegaETH'}
      </div>
    </div>
  )
}