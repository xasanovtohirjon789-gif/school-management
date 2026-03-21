'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTestStore, CATEGORY_LABELS } from '@/store/testStore'
import { BarChart3, TrendingUp, TrendingDown, Target, Clock, Award, Flame } from 'lucide-react'

export function StatisticsCharts() {
  const { getStatistics, getCategoryStats, attempts } = useTestStore()
  const stats = getStatistics()
  const categoryStats = getCategoryStats()
  
  // Get last 7 days data
  const getLast7Days = () => {
    const days = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateStr = date.toDateString()
      
      const dayAttempts = attempts.filter(a => 
        new Date(a.completedAt).toDateString() === dateStr
      )
      
      const avgScore = dayAttempts.length > 0
        ? Math.round(dayAttempts.reduce((sum, a) => sum + a.score, 0) / dayAttempts.length)
        : 0
      
      days.push({
        day: ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'][date.getDay()],
        score: avgScore,
        count: dayAttempts.length,
      })
    }
    
    return days
  }
  
  const last7Days = getLast7Days()
  const maxScore = Math.max(...last7Days.map(d => d.score), 1)
  
  // Get top categories
  const topCategories = Object.entries(categoryStats)
    .filter(([, data]) => data.count > 0)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 4)
  
  // Score distribution
  const getScoreDistribution = () => {
    const ranges = [
      { label: '0-20%', min: 0, max: 20, count: 0, color: 'bg-red-500' },
      { label: '21-40%', min: 21, max: 40, count: 0, color: 'bg-orange-500' },
      { label: '41-60%', min: 41, max: 60, count: 0, color: 'bg-yellow-500' },
      { label: '61-80%', min: 61, max: 80, count: 0, color: 'bg-blue-500' },
      { label: '81-100%', min: 81, max: 100, count: 0, color: 'bg-green-500' },
    ]
    
    attempts.forEach(a => {
      const range = ranges.find(r => a.score >= r.min && a.score <= r.max)
      if (range) range.count++
    })
    
    return ranges
  }
  
  const scoreDistribution = getScoreDistribution()
  const maxDistribution = Math.max(...scoreDistribution.map(r => r.count), 1)
  
  if (attempts.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Statistika
          </CardTitle>
          <CardDescription>Batafsil tahlil</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Hali ma'lumot yo'q</p>
            <p className="text-sm text-muted-foreground mt-1">
              Test ishlaganingizdan so'ng statistika ko'rinadi
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.avgScore}%</p>
                <p className="text-xs text-muted-foreground">O'rtacha ball</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.bestScore}%</p>
                <p className="text-xs text-muted-foreground">Eng yaxshi</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(stats.totalTimeSpent / 60)}
                </p>
                <p className="text-xs text-muted-foreground">Daqiqa</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-500/10">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.streakDays}</p>
                <p className="text-xs text-muted-foreground">Kun ketma-ket</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Last 7 Days Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base font-semibold">So'nggi 7 kun</CardTitle>
            <CardDescription>Kunlik o'rtacha ball</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-40">
              {last7Days.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center justify-end h-32 gap-1">
                    <span className="text-xs font-medium text-foreground">
                      {day.score > 0 ? `${day.score}%` : ''}
                    </span>
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        day.score >= 80 ? 'bg-green-500' :
                        day.score >= 60 ? 'bg-blue-500' :
                        day.score >= 40 ? 'bg-yellow-500' :
                        day.score > 0 ? 'bg-orange-500' : 'bg-muted'
                      }`}
                      style={{ height: day.score > 0 ? `${(day.score / 100) * 100}%` : '8px' }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Score Distribution */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Ball taqsimoti</CardTitle>
            <CardDescription>Natijalar bo'yicha taqsimot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scoreDistribution.map((range, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{range.label}</span>
                    <span className="font-medium text-foreground">{range.count} ta</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${range.color} rounded-full transition-all`}
                      style={{ width: `${(range.count / maxDistribution) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Categories */}
      {topCategories.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Mashhur kategoriyalar</CardTitle>
            <CardDescription>Eng ko'p ishlangan fanlar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {topCategories.map(([category, data]) => (
                <div
                  key={category}
                  className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <p className="font-medium text-foreground">
                    {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">{data.count} ta test</span>
                    <span className="text-sm font-bold text-primary">{data.avgScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
