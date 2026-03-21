'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useTestStore, CATEGORY_LABELS } from '@/store/testStore'
import { StatisticsCharts } from './StatisticsCharts'
import { Leaderboard } from './Leaderboard'
import { TestHistory } from './TestHistory'
import { 
  FileText, 
  Plus,
  ArrowRight,
  Target,
  BookOpen,
  Award,
  Flame,
  TrendingUp,
  CheckCircle
} from 'lucide-react'

export function DashboardContent() {
  const { tests, attempts, getStatistics } = useTestStore()
  const stats = getStatistics()
  
  // Get active tests
  const activeTests = tests.filter(t => t.status === 'active')
  
  // Quick stats
  const quickStats = [
    { 
      icon: FileText, 
      label: 'Jami testlar', 
      value: stats.totalTests.toString(), 
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    { 
      icon: TrendingUp, 
      label: "O'rtacha ball", 
      value: stats.avgScore > 0 ? `${stats.avgScore}%` : '0%', 
      color: 'text-secondary',
      bg: 'bg-secondary/10'
    },
    { 
      icon: Target, 
      label: 'Urinishlar', 
      value: stats.totalAttempts.toString(), 
      color: 'text-accent',
      bg: 'bg-accent/10'
    },
    { 
      icon: Flame, 
      label: 'Kun ketma-ket', 
      value: stats.streakDays.toString(), 
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Xush kelibsiz! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Bugun yangi test yaratishga tayyormisiz?
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" asChild>
            <a href="/testai?view=create">
              <Plus className="h-4 w-4" />
              Test yaratish
            </a>
          </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Statistics Charts */}
      <StatisticsCharts />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test History */}
        <div className="lg:col-span-2">
          <TestHistory />
        </div>

        {/* Leaderboard */}
        <Leaderboard />
      </div>

      {/* Active Tests */}
      {activeTests.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  Faol testlar
                </CardTitle>
                <CardDescription>Hozirda ishlash mumkin bo'lgan testlar</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1" asChild>
                <a href="/testai?view=tests">
                  Barchasi
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeTests.slice(0, 6).map((test) => (
                <div
                  key={test.id}
                  className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all cursor-pointer group"
                  onClick={() => window.location.href = `/testai?view=solve&testId=${test.id}`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {test.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {CATEGORY_LABELS[test.category]}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <span>{test.questions.length} savol</span>
                    <span>{test.timeLimit || test.questions.length * 2} daqiqa</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={test.attempts > 0 ? 100 : 0} 
                      className="flex-1 h-1.5" 
                    />
                    <span className="text-xs text-muted-foreground">
                      {test.attempts} urinish
                    </span>
                  </div>
                  
                  <Button size="sm" className="w-full mt-3 gap-2">
                    Boshlash
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Tezkor amallar</CardTitle>
          <CardDescription>Tez kirish</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <a href="/testai?view=create">
                <Plus className="h-5 w-5 text-primary" />
                <span>Yangi test</span>
              </a>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <a href="/testai?view=tests">
                <FileText className="h-5 w-5 text-secondary" />
                <span>Testlarim</span>
              </a>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <a href="/testai?view=profile">
                <Award className="h-5 w-5 text-accent" />
                <span>Natijalar</span>
              </a>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <a href="/?view=tests&tab=public">
                <BookOpen className="h-5 w-5 text-yellow-500" />
                <span>Ommaviy testlar</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
