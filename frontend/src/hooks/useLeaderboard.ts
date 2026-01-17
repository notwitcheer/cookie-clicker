import { useReadContract } from 'wagmi'
import { megaClickerAbi, getContractAddress } from '../config/contracts'
import type { Address } from 'viem'

export interface LeaderboardEntry {
  address: Address
  score: number
  rank: number
}

/**
 * Hook to get the full leaderboard
 */
export function useLeaderboard() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: getContractAddress(),
    abi: megaClickerAbi,
    functionName: 'getLeaderboard',
    query: {
      refetchInterval: 3000, // Poll every 3 seconds for leaderboard updates
      staleTime: 2000, // Consider data stale after 2 seconds
    },
  })

  // Transform the raw data into a more usable format
  const leaderboard: LeaderboardEntry[] = []
  if (data && Array.isArray(data) && data.length === 2) {
    const [addresses, scores] = data
    for (let i = 0; i < addresses.length; i++) {
      leaderboard.push({
        address: addresses[i] as Address,
        score: Number(scores[i]),
        rank: i + 1, // 1-indexed rank
      })
    }
  }

  return {
    leaderboard,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook to get global game statistics
 */
export function useGameStats() {
  const { data: totalClicks, isLoading: clicksLoading, error: clicksError } = useReadContract({
    address: getContractAddress(),
    abi: megaClickerAbi,
    functionName: 'totalClicks',
    query: {
      refetchInterval: 5000, // Poll every 5 seconds
    },
  })

  const { data: totalPlayers, isLoading: playersLoading, error: playersError } = useReadContract({
    address: getContractAddress(),
    abi: megaClickerAbi,
    functionName: 'totalPlayers',
    query: {
      refetchInterval: 10000, // Poll every 10 seconds (changes less frequently)
    },
  })

  const { data: maxLeaderboardSize, isLoading: maxLoading, error: maxError } = useReadContract({
    address: getContractAddress(),
    abi: megaClickerAbi,
    functionName: 'MAX_LEADERBOARD_SIZE',
    query: {
      refetchInterval: false, // This is constant, no need to poll
      staleTime: Infinity,
    },
  })

  return {
    totalClicks: totalClicks ? Number(totalClicks) : 0,
    totalPlayers: totalPlayers ? Number(totalPlayers) : 0,
    maxLeaderboardSize: maxLeaderboardSize ? Number(maxLeaderboardSize) : 20,
    isLoading: clicksLoading || playersLoading || maxLoading,
    error: clicksError || playersError || maxError,
  }
}

/**
 * Hook to get a specific leaderboard entry by rank
 */
export function useLeaderboardEntry(rank: number) {
  const { data: address, isLoading, error } = useReadContract({
    address: getContractAddress(),
    abi: megaClickerAbi,
    functionName: 'leaderboard',
    args: [BigInt(rank - 1)], // Convert to 0-indexed for contract
    query: {
      enabled: rank > 0,
      refetchInterval: 5000,
    },
  })

  return {
    address: address as Address | undefined,
    isLoading,
    error,
  }
}