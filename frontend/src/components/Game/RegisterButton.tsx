import { useRegister, useIsRegistered, useGameStatus } from '../../hooks'

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
  if (isSuccess && onRegistrationSuccess) {
    onRegistrationSuccess()
  }

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

      {/* Status Messages */}
      {error && (
        <div className="text-red-500 text-xs mt-2 max-w-xs mx-auto">
          Registration failed: {error.message || 'Unknown error'}
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