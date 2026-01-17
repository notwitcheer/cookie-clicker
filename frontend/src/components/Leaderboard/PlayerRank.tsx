import { usePlayerData } from '../../hooks'

interface PlayerRankProps {
  className?: string
  showScore?: boolean
}

export function PlayerRank({ className = '', showScore = true }: PlayerRankProps) {
  const { rank, score, isLoading } = usePlayerData()

  if (isLoading) {
    return (
      <div className={`text-gray-500 animate-pulse ${className}`}>
        Loading rank...
      </div>
    )
  }

  if (rank === 0) {
    return (
      <div className={`text-gray-500 ${className}`}>
        {score > 0 ? 'Not yet ranked' : 'Start clicking to get ranked!'}
      </div>
    )
  }

  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1: return { icon: '🥇', text: 'Champion!', color: 'text-yellow-600' }
      case 2: return { icon: '🥈', text: 'Runner-up!', color: 'text-gray-600' }
      case 3: return { icon: '🥉', text: 'Third place!', color: 'text-amber-600' }
      default: return { icon: '🏅', text: `Rank #${rank}`, color: 'text-blue-600' }
    }
  }

  const rankInfo = getRankDisplay(rank)

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-lg">{rankInfo.icon}</span>
      <div>
        <div className={`font-semibold ${rankInfo.color}`}>
          {rankInfo.text}
        </div>
        {showScore && (
          <div className="text-sm text-gray-600">
            {score} click{score !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  )
}