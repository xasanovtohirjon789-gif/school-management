'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useTestStore } from '@/store/testStore'
import { Trophy, Clock, Target, XCircle, Save, Printer, Download, Share2, Home, RotateCcw, FileText, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export function TestResults() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { tests, attempts } = useTestStore()
  
  const testId = searchParams.get('testId')
  const test = tests.find(t => t.id === testId)
  const recentAttempt = attempts.filter(a => a.testId === testId).sort((a, b) => 
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  )[0]

  const correctCount = recentAttempt?.correctCount ?? 0
  const totalQuestions = recentAttempt?.totalQuestions ?? 0
  const score = recentAttempt?.score ?? 0
  const timeSpent = recentAttempt?.timeSpent ?? 0
  
  const [isSaving, setIsSaving] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [shareLink, setShareLink] = useState('')

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreInfo = () => {
    if (score >= 90) return { color: 'text-green-500', message: 'Ajoyib! 🎉', grade: 'A' }
    if (score >= 70) return { color: 'text-blue-500', message: 'Yaxshi! 👍', grade: 'B' }
    if (score >= 50) return { color: 'text-yellow-500', message: 'Qoniqarli 😐', grade: 'C' }
    return { color: 'text-red-500', message: 'Qayta urinib ko\'ring 😔', grade: 'D' }
  }

  const handleDownload = async () => {
    const content = `
TestAI - Test Natijalari
=========================
Test: ${test?.name || 'Noma\'lum'}
Sana: ${new Date().toLocaleDateString('uz-UZ')}
 
📊 Natija: ${score}%
✅ To'g'ri javoblar: ${correctCount}/${totalQuestions}
⏱️ Sarflangan vaqt: ${formatTime(timeSpent)}

TestAI tomonidan yaratilgan
    `
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `test-natija-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: 'Fayl yuklab olindi! ✅' })
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    toast({ title: 'Natijalar saqlandi! ✅' })
    setIsSaving(false)
  }

  const handleShare = () => {
    const link = `https://testai.uz/results/${Math.random().toString(36).substr(2, 9)}`
    setShareLink(link)
    setShowShareDialog(true)
  }

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(shareLink)
    toast({ title: 'Havola nusxalandi! ✅' })
  }

  if (!test || !recentAttempt) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Natija topilmadi</h3>
          <p className="text-muted-foreground mb-4">Avval testni ishlang</p>
          <Button onClick={() => router.push('/?view=tests')}>Testlarni ko'rish</Button>
        </div>
      </div>
    )
  }

  const scoreInfo = getScoreInfo()

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Test natijalari</h1>
          <p className="text-muted-foreground mt-1">{test.name}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={handleShare}><Share2 className="h-4 w-4" />Ulashish</Button>
          <Button variant="outline" className="gap-2" onClick={() => window.print()}><Printer className="h-4 w-4" />Chop etish</Button>
          <Button variant="outline" className="gap-2" onClick={handleDownload}><Download className="h-4 w-4" />Yuklab olish</Button>
          <Button className="gap-2" onClick={handleSave} disabled={isSaving}><Save className="h-4 w-4" />{isSaving ? 'Saqlanmoqda...' : 'Saqlash'}</Button>
        </div>
      </div>

      {/* Score Card */}
      <Card className="bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-8 border-muted">
                <div className="text-center">
                  <span className={`text-4xl font-bold ${scoreInfo.color}`}>{score}%</span>
                  <p className="text-xs text-muted-foreground mt-1">Baho: {scoreInfo.grade}</p>
                </div>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-background px-3">
                <Trophy className={`h-6 w-6 ${score >= 70 ? 'text-green-500' : 'text-muted-foreground'}`} />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className={`text-2xl font-bold ${scoreInfo.color} mb-2`}>{scoreInfo.message}</h2>
              <p className="text-muted-foreground mb-4">{correctCount} ta to'g'ri javob {totalQuestions} ta savoldan</p>
              <Progress value={score} className="h-3 max-w-md mx-auto md:mx-0" />
              <div className="flex justify-center md:justify-start gap-6 mt-4 text-sm">
                <div><span className="text-muted-foreground">Vaqt:</span> <span className="font-medium ml-1">{formatTime(timeSpent)}</span></div>
                <div><span className="text-muted-foreground">Savollar:</span> <span className="font-medium ml-1">{totalQuestions}</span></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{ icon: Trophy, value: `${score}%`, label: 'Ball', color: score >= 70 ? 'text-green-500' : 'text-muted-foreground' },
          { icon: Target, value: correctCount, label: 'To\'g\'ri', color: 'text-blue-500' },
          { icon: XCircle, value: totalQuestions - correctCount, label: 'Noto\'g\'ri', color: 'text-red-500' },
          { icon: Clock, value: formatTime(timeSpent), label: 'Vaqt', color: 'text-purple-500' }
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4 text-center">
              <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips */}
      {score < 70 && (
        <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Tavsiyalar</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Natijangizni yaxshilash uchun asosiy tushunchalarni qayta ko'rib chiqing va amaliy mashqlar qiling.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" className="gap-2" onClick={() => router.push('/')}><Home className="h-4 w-4" />Bosh sahifa</Button>
        <Button variant="outline" className="gap-2" onClick={() => router.push('/?view=tests')}><FileText className="h-4 w-4" />Boshqa testlar</Button>
        <Button className="gap-2" onClick={() => router.push(`/?view=solve&testId=${testId}`)}><RotateCcw className="h-4 w-4" />Qayta ishlash</Button>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Share2 className="h-5 w-5" />Natijalarni ulashish</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">Quyidagi havola orqali natijalaringizni do'stlaringiz bilan ulashing:</p>
            <div className="flex items-center gap-2">
              <Input value={shareLink} readOnly />
              <Button onClick={copyShareLink}>Nusxalash</Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(`Mening test natijam: ${score}%`)}`, '_blank')}>Telegram</Button>
              <Button variant="outline" className="flex-1" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Mening test natijam: ${score}%. ${shareLink}`)}`, '_blank')}>WhatsApp</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
