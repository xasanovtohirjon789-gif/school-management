'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useTestStore, type Test, type Question, CATEGORY_LABELS, DIFFICULTY_LABELS } from '@/store/testStore'
import { Clock, ChevronLeft, ChevronRight, Flag, AlertCircle, Send, Pause } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

export function TestSolve() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { getTest, addAttempt } = useTestStore()
  
  const testId = searchParams.get('testId') || ''
  const [test, setTest] = useState<Test | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set())
  const [timeLeft, setTimeLeft] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [showStartDialog, setShowStartDialog] = useState(true)
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([])

  useEffect(() => {
    if (testId) {
      const testData = getTest(testId)
      if (testData) {
        setTest(testData)
        const time = (testData.timeLimit || testData.questions.length * 2) * 60
        setTimeLeft(time)
        
        // Shuffle questions if enabled
        if (testData.shuffleQuestions) {
          const shuffled = [...testData.questions].sort(() => Math.random() - 0.5)
          setShuffledQuestions(shuffled)
        } else {
          setShuffledQuestions(testData.questions)
        }
      }
    }
  }, [testId, getTest])

  useEffect(() => {
    if (showStartDialog || isPaused || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [showStartDialog, isPaused])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    setShowStartDialog(false)
    toast({ title: 'Test boshlandi! 🎯', description: `Sizda ${formatTime(timeLeft)} vaqt bor` })
  }

  const handleAnswer = (questionId: string, answer: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) newSet.delete(questionId)
      else newSet.add(questionId)
      return newSet
    })
  }

  const handleSubmit = useCallback(() => {
    if (!test) return

    let correctCount = 0
    shuffledQuestions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) correctCount++
    })

    const score = Math.round((correctCount / shuffledQuestions.length) * 100)
    const timeSpent = ((test.timeLimit || shuffledQuestions.length * 2) * 60) - timeLeft

    addAttempt({
      testId: test.id,
      testName: test.name,
      answers: Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
        isCorrect: shuffledQuestions.find(q => q.id === questionId)?.correctAnswer === answer
      })),
      score,
      correctCount,
      totalQuestions: shuffledQuestions.length,
      timeSpent,
    })

    router.push(`/?view=results&testId=${test.id}`)
  }, [test, shuffledQuestions, answers, timeLeft, addAttempt, router])

  const getQuestionStatus = (question: Question, index: number) => {
    if (index === currentQuestion) return 'current'
    if (flaggedQuestions.has(question.id)) return 'flagged'
    if (answers[question.id] !== undefined) return 'answered'
    return 'unanswered'
  }

  if (!test) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Test yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  const currentQ = shuffledQuestions[currentQuestion]
  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / shuffledQuestions.length) * 100

  return (
    <div className="space-y-4 p-4 md:p-6 max-w-5xl mx-auto">
      {/* Start Dialog */}
      <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Testni boshlash</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-xl bg-muted/50 space-y-2">
              <h3 className="font-semibold text-lg">{test.name}</h3>
              {test.description && <p className="text-sm text-muted-foreground">{test.description}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 rounded-xl bg-muted">
                <p className="text-2xl font-bold">{shuffledQuestions.length}</p>
                <p className="text-xs text-muted-foreground">Savol</p>
              </div>
              <div className="p-3 rounded-xl bg-muted">
                <p className="text-2xl font-bold">{formatTime(timeLeft)}</p>
                <p className="text-xs text-muted-foreground">Vaqt</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">{CATEGORY_LABELS[test.category]}</Badge>
              <Badge variant="outline" className={DIFFICULTY_LABELS[test.difficulty]?.color}>
                {DIFFICULTY_LABELS[test.difficulty]?.label}
              </Badge>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => router.push('/?view=tests')}>Ortga</Button>
            <Button onClick={handleStart}>Testni boshlash</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Testni yakunlash</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950 border border-green-200">
                <p className="text-2xl font-bold text-green-600">{answeredCount}</p>
                <p className="text-xs text-muted-foreground">Javob berilgan</p>
              </div>
              <div className="p-3 rounded-xl bg-muted">
                <p className="text-2xl font-bold">{shuffledQuestions.length - answeredCount}</p>
                <p className="text-xs text-muted-foreground">Javobsiz</p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>Tekshirish</Button>
            <Button onClick={handleSubmit} className="gap-2"><Send className="h-4 w-4" />Yakunlash</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">{test.name}</h1>
          <p className="text-sm text-muted-foreground">{currentQuestion + 1} / {shuffledQuestions.length}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${timeLeft < 60 ? 'bg-red-50 text-red-600' : 'bg-muted'}`}>
            <Clock className="h-5 w-5" />
            <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
          </div>
          <Button variant="outline" size="icon" onClick={() => setIsPaused(!isPaused)}>
            <Pause className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Jarayon</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Navigation */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {shuffledQuestions.map((q, index) => {
          const status = getQuestionStatus(q, index)
          return (
            <button
              key={q.id}
              onClick={() => setCurrentQuestion(index)}
              className={`h-9 w-9 shrink-0 rounded-lg text-sm font-medium ${
                status === 'current' ? 'bg-primary text-white ring-2 ring-primary ring-offset-2' :
                status === 'flagged' ? 'bg-yellow-500 text-white' :
                status === 'answered' ? 'bg-green-500 text-white' :
                'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {index + 1}
            </button>
          )
        })}
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline">{currentQuestion + 1}-savol</Badge>
            <Button variant="ghost" size="sm" onClick={() => toggleFlag(currentQ.id)} className={flaggedQuestions.has(currentQ.id) ? 'text-yellow-500' : ''}>
              <Flag className={`h-4 w-4 ${flaggedQuestions.has(currentQ.id) ? 'fill-current' : ''}`} />
              {flaggedQuestions.has(currentQ.id) ? 'Belgilangan' : 'Belgilash'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg font-medium leading-relaxed">{currentQ.text}</p>
          <RadioGroup value={answers[currentQ.id]?.toString() || ''} onValueChange={(value) => handleAnswer(currentQ.id, parseInt(value))} className="space-y-3">
            {currentQ.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer ${
                  answers[currentQ.id] === index ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleAnswer(currentQ.id, index)}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  <span className="font-medium text-primary mr-2">{String.fromCharCode(65 + index)})</span>
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button variant="outline" onClick={() => setCurrentQuestion(currentQuestion - 1)} disabled={currentQuestion === 0} className="gap-2">
          <ChevronLeft className="h-4 w-4" /> Oldingi
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/?view=tests')} className="text-red-500">Chiqish</Button>
          <Button onClick={() => setShowSubmitDialog(true)} className="gap-2"><Send className="h-4 w-4" />Yakunlash</Button>
        </div>
        <Button onClick={() => setCurrentQuestion(currentQuestion + 1)} disabled={currentQuestion === shuffledQuestions.length - 1} className="gap-2">
          Keyingi <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
