import { usePlayerData } from '../../hooks'

interface ScoreDisplayProps {
  className?: string
  showRank?: boolean
}

export function ScoreDisplay({ className = '', showRank = true }: ScoreDisplayProps) {
  const { score, rank, isLoading } = usePlayerData()

  if (isLoading) {
    return (
      <div className={`score-display ${className}`}>
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  const formatScore = (score: number) => {
    if (score === 0) return '0 Clicks'
    if (score === 1) return '1 Click'
    if (score < 1000) return `${score} Clicks`
    if (score < 1000000) return `${(score / 1000).toFixed(1)}K Clicks`
    return `${(score / 1000000).toFixed(1)}M Clicks`
  }

  return (
    <div className={`score-display ${className}`}>
      <div className="text-center">
        <div className="text-4xl font-bold mb-1">
          {formatScore(score)}
        </div>
        {showRank && rank > 0 && (
          <div className="text-sm text-gray-600">
            Rank #{rank} on the leaderboard
          </div>
        )}
        {showRank && rank === 0 && score > 0 && (
          <div className="text-sm text-gray-500">
            Not yet on leaderboard
          </div>
        )}
      </div>
    </div>
  )
}