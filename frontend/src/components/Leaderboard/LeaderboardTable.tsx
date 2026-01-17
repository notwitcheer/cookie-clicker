import { useLeaderboard, useGameStats, type LeaderboardEntry } from '../../hooks'

interface LeaderboardTableProps {
  className?: string
  showStats?: boolean
  maxEntries?: number
}

export function LeaderboardTable({
  className = '',
  showStats = true,
  maxEntries
}: LeaderboardTableProps) {
  const { leaderboard, isLoading, error } = useLeaderboard()
  const { totalClicks, totalPlayers } = useGameStats()

  const displayedLeaderboard = maxEntries
    ? leaderboard.slice(0, maxEntries)
    : leaderboard

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatScore = (score: number) => {
    if (score < 1000) return score.toString()
    if (score < 1000000) return `${(score / 1000).toFixed(1)}K`
    return `${(score / 1000000).toFixed(1)}M`
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  if (error) {
    return (
      <div className={`leaderboard-card ${className}`}>
        <h2 className="text-2xl font-bold mb-6 text-center">
          🏆 Leaderboard
        </h2>
        <div className="text-center text-red-500 py-8">
          <p>Failed to load leaderboard</p>
          <p className="text-sm mt-2">Check your connection and try again</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`leaderboard-card ${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-center">
        🏆 Leaderboard
      </h2>

      {isLoading && (
        <div className="text-center text-gray-500 py-8">
          <div className="animate-pulse">Loading leaderboard...</div>
        </div>
      )}

      {!isLoading && displayedLeaderboard.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>No players yet!</p>
          <p className="text-sm mt-2">Be the first to click and claim the top spot.</p>
        </div>
      )}

      {!isLoading && displayedLeaderboard.length > 0 && (
        <div className="space-y-3">
          {displayedLeaderboard.map((entry: LeaderboardEntry) => (
            <div
              key={entry.address}
              className={`
                flex items-center justify-between p-3 rounded-lg
                ${entry.rank <= 3
                  ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200'
                  : 'bg-gray-50 hover:bg-gray-100'
                }
                transition-colors
              `}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`
                    text-lg font-bold
                    ${entry.rank <= 3 ? 'text-amber-600' : 'text-gray-600'}
                  `}
                >
                  {getRankIcon(entry.rank)}
                </span>
                <div>
                  <div className="font-mono text-sm">
                    {formatAddress(entry.address)}
                  </div>
                  {entry.rank <= 3 && (
                    <div className="text-xs text-gray-500">
                      {entry.rank === 1 ? 'Champion'
                       : entry.rank === 2 ? 'Runner-up'
                       : 'Third place'}
                    </div>
                  )}
                </div>
              </div>
              <div className={`
                font-bold text-lg
                ${entry.rank <= 3 ? 'text-amber-600' : 'text-gray-800'}
              `}>
                {formatScore(entry.score)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Global Stats */}
      {showStats && (
        <div className="border-t pt-4 mt-6">
          <h3 className="font-semibold mb-3">Global Stats</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className={`
                text-2xl font-bold text-primary-600
                ${isLoading ? 'animate-pulse' : ''}
              `}>
                {isLoading ? '...' : formatScore(totalClicks)}
              </div>
              <div className="text-gray-600">Total Clicks</div>
            </div>
            <div>
              <div className={`
                text-2xl font-bold text-accent-600
                ${isLoading ? 'animate-pulse' : ''}
              `}>
                {isLoading ? '...' : totalPlayers.toLocaleString()}
              </div>
              <div className="text-gray-600">Total Players</div>
            </div>
          </div>
        </div>
      )}

      {/* Refresh indicator */}
      <div className="text-xs text-gray-400 text-center mt-4">
        Updates every 3 seconds
      </div>
    </div>
  )
}