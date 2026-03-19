'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useTestStore } from '@/store/testStore'
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react'

export function Leaderboard() {
  const { getLeaderboard } = useTestStore()
  const leaderboard = getLeaderboard()
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
    }
  }
  
  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-500/10 border-yellow-500/30'
      case 2:
        return 'bg-gray-500/10 border-gray-500/30'
      case 3:
        return 'bg-amber-600/10 border-amber-600/30'
      default:
        return 'bg-muted/50'
    }
  }
  
  if (leaderboard.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Reyting
          </CardTitle>
          <CardDescription>Eng yaxshi natijalar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Hali reyting yo'q</p>
            <p className="text-sm text-muted-foreground mt-1">
              Test ishlang va reytingga kirganlaringizdan yuqori o'ringa chiqing!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Reyting
        </CardTitle>
        <CardDescription>Eng yaxshi natijalar</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboard.slice(0, 5).map((entry) => (
            <div
              key={entry.userId}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:scale-[1.01] ${getRankBg(entry.rank)}`}
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-8">
                {getRankIcon(entry.rank)}
              </div>
              
              {/* Avatar */}
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                  {entry.userName[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{entry.userName}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{entry.totalTests} ta test</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {entry.avgScore}% o'rtacha
                  </span>
                </div>
              </div>
              
              {/* Score */}
              <div className="text-right">
                <p className="text-xl font-bold text-foreground">{entry.totalScore}</p>
                <p className="text-xs text-muted-foreground">ball</p>
              </div>
            </div>
          ))}
        </div>
        
        {leaderboard.length > 5 && (
          <div className="mt-4 text-center">
            <Badge variant="secondary" className="gap-1">
              +{leaderboard.length - 5} ta ko'proq
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
