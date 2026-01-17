import { useState, useEffect } from 'react'
import { useClick, usePlayerData, useGameStatus } from '../../hooks'

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

  // Handle successful click
  useEffect(() => {
    if (isSuccess && onSuccessfulClick) {
      onSuccessfulClick()
      setShowClickEffect(true)
      setTimeout(() => setShowClickEffect(false), 300)
    }
  }, [isSuccess, onSuccessfulClick])

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

  const handleClick = () => {
    if (!canPlay || !isRegistered || disabled || isPending || isConfirming) {
      return
    }

    click()
  }

  const isDisabled = disabled || !canPlay || !isRegistered || isPending || isConfirming

  const getButtonText = () => {
    if (!canPlay) return 'Connect Wallet'
    if (!isRegistered) return 'Register First'
    if (isPending) return 'Submitting...'
    if (isConfirming) return 'Confirming...'
    return 'Click Me!'
  }

  const getButtonStatus = () => {
    if (error) return 'error'
    if (isSuccess) return 'success'
    if (isPending || isConfirming) return 'loading'
    return 'default'
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`
          click-button mobile-friendly relative overflow-hidden
          ${showClickEffect ? 'animate-click' : ''}
          ${getButtonStatus() === 'loading' ? 'opacity-75 cursor-not-allowed' : ''}
          ${getButtonStatus() === 'error' ? 'bg-red-500 hover:bg-red-600' : ''}
          ${getButtonStatus() === 'success' ? 'bg-green-500 hover:bg-green-600' : ''}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        title={
          error ? 'Click failed - try again'
          : isPending ? 'Transaction submitted...'
          : isConfirming ? 'Waiting for confirmation...'
          : 'Click to score!'
        }
      >
        {/* Cookie Emoji */}
        <div className="text-6xl mb-2">
          {getButtonStatus() === 'loading' ? (
            <div className="animate-spin text-4xl">⏳</div>
          ) : getButtonStatus() === 'error' ? (
            '❌'
          ) : getButtonStatus() === 'success' ? (
            '✅'
          ) : (
            '🍪'
          )}
        </div>

        {/* Button Text */}
        <div className="text-sm font-medium">
          {getButtonText()}
        </div>

        {/* Loading spinner overlay */}
        {(isPending || isConfirming) && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="animate-pulse text-white text-xs">
              {isPending ? 'Sending...' : 'Confirming...'}
            </div>
          </div>
        )}
      </button>

      {/* Status Messages */}
      {error && (
        <div className="text-red-500 text-xs text-center max-w-xs">
          Click failed: {error.message || 'Unknown error'}
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