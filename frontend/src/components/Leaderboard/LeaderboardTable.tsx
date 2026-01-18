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
      <div className={`bakery-card min-h-[400px] flex flex-col ${className}`}>
        <h2 className="text-2xl font-bold mb-6 text-center">
          🏆 Leaderboard
        </h2>
        <div className="text-center text-cherry-600 py-8">
          <p className="font-semibold">Failed to load leaderboard</p>
          <p className="text-sm mt-2 bakery-text">Check your connection and try again</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bakery-card min-h-[400px] flex flex-col ${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-center">
        🏆 Leaderboard
      </h2>

      {isLoading && (
        <div className="text-center bakery-text py-8">
          <div className="animate-pulse">Loading leaderboard...</div>
        </div>
      )}

      {!isLoading && displayedLeaderboard.length === 0 && (
        <div className="text-center bakery-text py-8">
          <p className="font-semibold">No players yet!</p>
          <p className="text-sm mt-2 text-caramel-600">Be the first to click and claim the top spot. 🚀</p>
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
                  ? 'bg-gradient-to-r from-accent-50 to-caramel-50 border-2 border-accent-200'
                  : 'bg-cream-50/70 hover:bg-accent-50/50'
                }
                transition-colors shadow-sm
              `}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`
                    text-lg font-bold
                    ${entry.rank <= 3 ? 'text-caramel-600' : 'text-primary-600'}
                  `}
                >
                  {getRankIcon(entry.rank)}
                </span>
                <div>
                  <div className="font-mono text-sm">
                    {formatAddress(entry.address)}
                  </div>
                  {entry.rank <= 3 && (
                    <div className="text-xs text-caramel-500">
                      {entry.rank === 1 ? 'Champion'
                       : entry.rank === 2 ? 'Runner-up'
                       : 'Third place'}
                    </div>
                  )}
                </div>
              </div>
              <div className={`
                font-bold text-lg
                ${entry.rank <= 3 ? 'text-accent-600' : 'text-primary-700'}
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
          <h3 className="font-semibold mb-3 bakery-text">Global Stats</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className={`
                text-2xl font-bold text-caramel-600
                ${isLoading ? 'animate-pulse' : ''}
              `}>
                {isLoading ? '...' : formatScore(totalClicks)}
              </div>
              <div className="bakery-text">Total Clicks</div>
            </div>
            <div>
              <div className={`
                text-2xl font-bold text-primary-600
                ${isLoading ? 'animate-pulse' : ''}
              `}>
                {isLoading ? '...' : totalPlayers.toLocaleString()}
              </div>
              <div className="bakery-text">Total Players</div>
            </div>
          </div>
        </div>
      )}

      {/* Refresh indicator */}
      <div className="text-xs text-primary-500 text-center mt-4">
        🔄 Updates every 3 seconds
      </div>
    </div>
  )
}