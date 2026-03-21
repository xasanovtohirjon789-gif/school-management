'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useTestStore, type Test } from '@/store/testStore'
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Trophy,
  Home,
  Eye
} from 'lucide-react'

export function TestSolver() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { getTest, addAttempt } = useTestStore()
  
  const testId = searchParams.get('testId')
  const [test, setTest] = useState<Test | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [startTime, setStartTime] = useState(Date.now())
  const [isFinished, setIsFinished] = useState(false)
  
  // Load test
  useEffect(() => {
    if (testId) {
      const testData = getTest(testId)
      if (testData) {
        setTest(testData)
        setTimeLeft((testData.timeLimit || testData.questions.length * 2) * 60)
        setStartTime(Date.now())
      } else {
        toast({
          title: 'Xatolik',
          description: 'Test topilmadi',
          variant: 'destructive'
        })
        router.push('/?view=tests')
      }
    }
  }, [testId])
  
  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !isFinished && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeLeft, isFinished, showResults])
  
  // Handle answer selection
  const handleSelectAnswer = (questionId: string, answerIndex: number) => {
    if (showResults) return
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }
  
  // Navigate questions
  const goToQuestion = (index: number) => {
    if (test && index >= 0 && index < test.questions.length) {
      setCurrentQuestion(index)
    }
  }
  
  // Submit test
  const handleSubmit = useCallback(() => {
    if (!test || isFinished) return
    
    setIsFinished(true)
    setShowResults(true)
    
    // Calculate results
    let correctCount = 0
    const answerDetails: { questionId: string; answer: number; isCorrect: boolean }[] = []
    
    test.questions.forEach(q => {
      const userAnswer = answers[q.id] ?? -1
      const isCorrect = userAnswer === q.correctAnswer
      if (isCorrect) correctCount++
      answerDetails.push({
        questionId: q.id,
        answer: userAnswer,
        isCorrect
      })
    })
    
    const score = Math.round((correctCount / test.questions.length) * 100)
    const timeSpent = Math.round((Date.now() - startTime) / 1000)
    
    // Save attempt
    addAttempt({
      testId: test.id,
      testName: test.name,
      answers: answerDetails,
      score,
      correctCount,
      totalQuestions: test.questions.length,
      timeSpent,
      category: test.category,
      difficulty: test.difficulty,
    })
    
    toast({
      title: 'Test yakunlandi!',
      description: `Siz ${score}% ball oldingiz`,
    })
  }, [test, answers, startTime, addAttempt, toast, isFinished])
  
  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  // Calculate score
  const calculateScore = () => {
    if (!test) return 0
    let correct = 0
    test.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correct++
    })
    return Math.round((correct / test.questions.length) * 100)
  }
  
  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }
  
  const currentQ = test.questions[currentQuestion]
  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / test.questions.length) * 100
  const score = calculateScore()
  const passingScore = test.passingScore || 60
  const isPassed = score >= passingScore
  
  // Results screen
  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-6">
            <CardContent className="p-6 text-center">
              <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${
                isPassed ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                {isPassed ? (
                  <Trophy className="w-12 h-12 text-green-400" />
                ) : (
                  <AlertCircle className="w-12 h-12 text-red-400" />
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-2">
                {isPassed ? 'Tabriklaymiz!' : 'Afsus!'}
              </h1>
              
              <p className="text-gray-300 mb-6">
                {isPassed 
                  ? `Siz testdan muvaffaqiyatli o'tdingiz! O'tish bali: ${passingScore}%`
                  : `Siz testdan o'ta olmadingiz. O'tish bali: ${passingScore}%`
                }
              </p>
              
              {/* Score Circle */}
              <div className="relative w-40 h-40 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke={isPassed ? '#22c55e' : '#ef4444'}
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${score * 4.4} 440`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">{score}%</span>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-2xl font-bold text-green-400">
                    {test.questions.filter(q => answers[q.id] === q.correctAnswer).length}
                  </p>
                  <p className="text-sm text-gray-400">To&apos;g&apos;ri</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-2xl font-bold text-red-400">
                    {test.questions.filter(q => answers[q.id] !== q.correctAnswer && answers[q.id] !== undefined).length}
                  </p>
                  <p className="text-sm text-gray-400">Noto&apos;g&apos;ri</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-2xl font-bold text-blue-400">
                    {formatTime(Math.round((Date.now() - startTime) / 1000))}
                  </p>
                  <p className="text-sm text-gray-400">Vaqt</p>
                </div>
              </div>
              
              {/* Buttons */}
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCorrectAnswers(!showCorrectAnswers)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showCorrectAnswers ? "Javoblarni yashirish" : "Javoblarni ko'rish"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/?view=tests')}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Testlarga qaytish
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Show answers */}
          {showCorrectAnswers && (
            <div className="space-y-4">
              {test.questions.map((q, index) => {
                const userAnswer = answers[q.id]
                const isCorrect = userAnswer === q.correctAnswer
                
                return (
                  <Card key={q.id} className={`bg-white/10 backdrop-blur-lg border-2 ${
                    isCorrect ? 'border-green-500/50' : 'border-red-500/50'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">
                            <span className="text-gray-400">{index + 1}.</span> {q.text}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-11">
                        {q.options.map((opt, i) => {
                          const isCorrectAnswer = i === q.correctAnswer
                          const isUserAnswer = i === userAnswer
                          
                          return (
                            <div
                              key={i}
                              className={`p-3 rounded-lg text-sm ${
                                isCorrectAnswer
                                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                  : isUserAnswer && !isCorrectAnswer
                                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                  : 'bg-white/5 text-gray-300'
                              }`}
                            >
                              <span className="font-medium mr-2">{String.fromCharCode(65 + i)})</span>
                              {opt}
                              {isCorrectAnswer && (
                                <CheckCircle className="w-4 h-4 inline ml-2 text-green-400" />
                              )}
                              {isUserAnswer && !isCorrectAnswer && (
                                <XCircle className="w-4 h-4 inline ml-2 text-red-400" />
                              )}
                            </div>
                          )
                        })}
                      </div>
                      
                      {q.explanation && (
                        <div className="mt-4 ml-11 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                          <p className="text-sm text-blue-300">
                            <strong>Tushuntirish:</strong> {q.explanation}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }
  
  // Test solving screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">{test.name}</h1>
            <p className="text-gray-400">
              {answeredCount} / {test.questions.length} ta savol javoblandi
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              timeLeft < 60 ? 'bg-red-500/20 text-red-300 animate-pulse' : 'bg-white/10 text-white'
            }`}>
              <Clock className="w-5 h-5" />
              <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
        
        {/* Progress */}
        <div className="mb-6">
          <Progress value={progress} className="h-2 bg-white/10" />
        </div>
        
        {/* Question navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {test.questions.map((q, index) => (
            <Button
              key={q.id}
              variant={currentQuestion === index ? 'default' : 'outline'}
              size="sm"
              onClick={() => goToQuestion(index)}
              className={`w-10 h-10 p-0 ${
                currentQuestion === index
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : answers[q.id] !== undefined
                  ? 'bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30'
                  : 'border-white/20 text-white hover:bg-white/10'
              }`}
            >
              {index + 1}
            </Button>
          ))}
        </div>
        
        {/* Current question */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                Savol {currentQuestion + 1} / {test.questions.length}
              </Badge>
              {currentQ.points && (
                <Badge variant="outline" className="border-amber-500/50 text-amber-300">
                  {currentQ.points} ball
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl text-white mt-4">
              {currentQ.text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentQ.options.map((option, index) => {
                const isSelected = answers[currentQ.id] === index
                
                return (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleSelectAnswer(currentQ.id, index)}
                    className={`h-auto py-4 px-4 justify-start text-left transition-all ${
                      isSelected
                        ? 'bg-purple-500/30 border-purple-500 text-white'
                        : 'border-white/20 text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="font-bold mr-3 w-6 h-6 rounded-full border flex items-center justify-center text-sm shrink-0">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
        
        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => goToQuestion(currentQuestion - 1)}
            disabled={currentQuestion === 0}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Oldingi
          </Button>
          
          {currentQuestion === test.questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Yakunlash
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => goToQuestion(currentQuestion + 1)}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              Keyingi
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
