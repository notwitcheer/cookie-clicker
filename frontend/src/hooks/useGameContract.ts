import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { megaClickerAbi, getContractAddress } from '../config/contracts'
import type { Address } from 'viem'

/**
 * Hook for player registration
 */
export function useRegister() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess, error: receiptError } = useWaitForTransactionReceipt({ hash })

  const register = () => {
    try {
      writeContract({
        address: getContractAddress(),
        abi: megaClickerAbi,
        functionName: 'register',
      })
    } catch (err) {
      console.error('Registration failed:', err)
    }
  }

  return {
    register,
    isPending,           // Transaction submitted, waiting for confirmation
    isConfirming,        // Transaction in mempool
    isSuccess,          // Transaction confirmed
    error: error || receiptError,
    hash,
  }
}

/**
 * Hook for clicking (core game mechanic)
 */
export function useClick() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess, error: receiptError } = useWaitForTransactionReceipt({ hash })

  const click = () => {
    try {
      writeContract({
        address: getContractAddress(),
        abi: megaClickerAbi,
        functionName: 'click',
      })
    } catch (err) {
      console.error('Click failed:', err)
    }
  }

  return {
    click,
    isPending,           // Transaction submitted, waiting for confirmation
    isConfirming,        // Transaction in mempool
    isSuccess,          // Transaction confirmed
    error: error || receiptError,
    hash,
  }
}

/**
 * Hook to check if the connected wallet is ready to play
 */
export function useGameStatus() {
  const { address, isConnected } = useAccount()

  return {
    isConnected,
    address: address as Address | undefined,
    canPlay: isConnected && !!address,
  }
}