import { useAccount, useReadContract } from 'wagmi'
import { megaClickerAbi, getContractAddress } from '../config/contracts'
import type { Address } from 'viem'

/**
 * Hook to get current player's score
 */
export function usePlayerScore(playerAddress?: Address) {
  const { address } = useAccount()
  const targetAddress = playerAddress || address

  const { data: score, isLoading, error, refetch } = useReadContract({
    address: getContractAddress(),
    abi: megaClickerAbi,
    functionName: 'getScore',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
      refetchInterval: 2000, // Poll every 2 seconds for real-time updates
    },
  })

  return {
    score: score ? Number(score) : 0,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook to check if player is registered
 */
export function useIsRegistered(playerAddress?: Address) {
  const { address } = useAccount()
  const targetAddress = playerAddress || address

  const { data: isRegistered, isLoading, error, refetch } = useReadContract({
    address: getContractAddress(),
    abi: megaClickerAbi,
    functionName: 'isRegistered',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
      refetchInterval: 5000, // Poll every 5 seconds
    },
  })

  return {
    isRegistered: !!isRegistered,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook to get player's rank on the leaderboard
 */
export function usePlayerRank(playerAddress?: Address) {
  const { address } = useAccount()
  const targetAddress = playerAddress || address

  const { data: rank, isLoading, error, refetch } = useReadContract({
    address: getContractAddress(),
    abi: megaClickerAbi,
    functionName: 'getPlayerRank',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
      refetchInterval: 5000, // Poll every 5 seconds
    },
  })

  return {
    rank: rank ? Number(rank) : 0,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook to get player's last click block (for rate limiting display)
 */
export function useLastClickBlock(playerAddress?: Address) {
  const { address } = useAccount()
  const targetAddress = playerAddress || address

  const { data: lastClickBlock, isLoading, error, refetch } = useReadContract({
    address: getContractAddress(),
    abi: megaClickerAbi,
    functionName: 'getLastClickBlock',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
      refetchInterval: 1000, // Poll every second for rate limiting
    },
  })

  return {
    lastClickBlock: lastClickBlock ? Number(lastClickBlock) : 0,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Combined hook for all player data
 */
export function usePlayerData(playerAddress?: Address) {
  const { address } = useAccount()
  const targetAddress = playerAddress || address

  const { score, isLoading: scoreLoading, error: scoreError } = usePlayerScore(targetAddress)
  const { isRegistered, isLoading: regLoading, error: regError } = useIsRegistered(targetAddress)
  const { rank, isLoading: rankLoading, error: rankError } = usePlayerRank(targetAddress)
  const { lastClickBlock, isLoading: blockLoading, error: blockError } = useLastClickBlock(targetAddress)

  return {
    score,
    isRegistered,
    rank,
    lastClickBlock,
    isLoading: scoreLoading || regLoading || rankLoading || blockLoading,
    error: scoreError || regError || rankError || blockError,
    address: targetAddress,
  }
}