'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useTestStore, CATEGORY_LABELS, DIFFICULTY_LABELS } from '@/store/testStore'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  RotateCcw,
  Calendar,
  ChevronRight,
  History
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export function TestHistory() {
  const router = useRouter()
  const { getRecentAttempts, getTest } = useTestStore()
  const recentAttempts = getRecentAttempts(10)
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return 'Hozir'
    if (minutes < 60) return `${minutes} daqiqa oldin`
    if (hours < 24) return `${hours} soat oldin`
    if (days < 7) return `${days} kun oldin`
    
    return date.toLocaleDateString('uz-UZ')
  }
  
  if (recentAttempts.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            So'nggi natijalar
          </CardTitle>
          <CardDescription>Test tarixi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Hali test ishlanmagan</p>
            <Button className="mt-4" onClick={() => router.push('/?view=tests')}>
              Testni boshlash
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              So'nggi natijalar
            </CardTitle>
            <CardDescription>Test tarixi</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => router.push('/?view=profile')}>
            Barchasi
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentAttempts.slice(0, 5).map((attempt) => {
            const test = getTest(attempt.testId)
            const passed = attempt.score >= 60
            
            return (
              <div
                key={attempt.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                onClick={() => router.push(`/?view=results&testId=${attempt.testId}`)}
              >
                {/* Score Circle */}
                <div className={`relative w-14 h-14 shrink-0`}>
                  <svg className="w-14 h-14 -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-muted"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${(attempt.score / 100) * 150.8} 150.8`}
                      className={passed ? 'text-green-500' : 'text-red-500'}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold">{attempt.score}%</span>
                  </div>
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {attempt.testName}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(attempt.completedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(attempt.timeSpent)}
                    </span>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {CATEGORY_LABELS[attempt.category]}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${DIFFICULTY_LABELS[attempt.difficulty]?.color}`}
                    >
                      {DIFFICULTY_LABELS[attempt.difficulty]?.label}
                    </Badge>
                  </div>
                </div>
                
                {/* Status */}
                <div className="flex flex-col items-end gap-1">
                  {passed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {attempt.correctCount}/{attempt.totalQuestions}
                  </span>
                </div>
                
                {/* Arrow */}
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
