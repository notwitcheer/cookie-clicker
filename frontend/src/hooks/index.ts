// Game contract interaction hooks
export { useRegister, useClick, useGameStatus } from './useGameContract'

// Player data hooks
export {
  usePlayerScore,
  useIsRegistered,
  usePlayerRank,
  useLastClickBlock,
  usePlayerData
} from './usePlayerData'

// Leaderboard and game stats hooks
export {
  useLeaderboard,
  useGameStats,
  useLeaderboardEntry,
  type LeaderboardEntry
} from './useLeaderboard'