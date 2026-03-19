import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Question types
export interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  explanation?: string
  points?: number
}

// Test category types
export type TestCategory = 
  | 'matematika'
  | 'fizika'
  | 'kimyo'
  | 'biologiya'
  | 'tarix'
  | 'geografiya'
  | 'ona-tili'
  | 'ingliz-tili'
  | 'rus-tili'
  | 'informatika'
  | 'boshqa'

// Difficulty levels
export type DifficultyLevel = 'oson' | 'orta' | 'qiyin' | 'juda-qiyin'

// Test interface
export interface Test {
  id: string
  name: string
  description: string
  questions: Question[]
  status: 'draft' | 'active' | 'archived'
  createdAt: string
  updatedAt: string
  attempts: number
  timeLimit?: number // daqiqada
  category: TestCategory
  difficulty: DifficultyLevel
  shuffleQuestions: boolean
  showExplanations: boolean
  passingScore: number
  tags: string[]
  creator: string
  isPublic: boolean
}

// Test attempt interface
export interface TestAttempt {
  id: string
  testId: string
  testName: string
  answers: { questionId: string; answer: number; isCorrect: boolean }[]
  score: number
  correctCount: number
  totalQuestions: number
  timeSpent: number // soniyada
  completedAt: string
  category: TestCategory
  difficulty: DifficultyLevel
}

// Category labels
export const CATEGORY_LABELS: Record<TestCategory, string> = {
  'matematika': 'Matematika',
  'fizika': 'Fizika',
  'kimyo': 'Kimyo',
  'biologiya': 'Biologiya',
  'tarix': 'Tarix',
  'geografiya': 'Geografiya',
  'ona-tili': 'Ona tili',
  'ingliz-tili': 'Ingliz tili',
  'rus-tili': 'Rus tili',
  'informatika': 'Informatika',
  'boshqa': 'Boshqa',
}

// Difficulty labels
export const DIFFICULTY_LABELS: Record<DifficultyLevel, { label: string; color: string; points: number }> = {
  'oson': { label: 'Oson', color: 'text-green-500', points: 1 },
  'orta': { label: "O'rta", color: 'text-yellow-500', points: 2 },
  'qiyin': { label: 'Qiyin', color: 'text-orange-500', points: 3 },
  'juda-qiyin': { label: 'Juda qiyin', color: 'text-red-500', points: 5 },
}

// Leaderboard entry
export interface LeaderboardEntry {
  userId: string
  userName: string
  totalScore: number
  totalTests: number
  avgScore: number
  rank: number
}

interface TestStore {
  tests: Test[]
  attempts: TestAttempt[]
  
  // Test CRUD
  addTest: (test: Omit<Test, 'id' | 'createdAt' | 'updatedAt' | 'attempts'>) => string
  updateTest: (id: string, data: Partial<Test>) => void
  deleteTest: (id: string) => void
  duplicateTest: (id: string) => string | null
  publishTest: (id: string) => void
  unpublishTest: (id: string) => void
  archiveTest: (id: string) => void
  
  // Test Attempt
  addAttempt: (attempt: Omit<TestAttempt, 'id' | 'completedAt'>) => void
  getTestAttempts: (testId: string) => TestAttempt[]
  
  // Getters
  getTest: (id: string) => Test | undefined
  getActiveTests: () => Test[]
  getDraftTests: () => Test[]
  getTestsByCategory: (category: TestCategory) => Test[]
  getRecentAttempts: (limit?: number) => TestAttempt[]
  getLeaderboard: () => LeaderboardEntry[]
  getStatistics: () => TestStatistics
  getCategoryStats: () => Record<TestCategory, { count: number; avgScore: number }>
}

// Statistics interface
interface TestStatistics {
  totalTests: number
  totalAttempts: number
  avgScore: number
  totalTimeSpent: number
  bestScore: number
  worstScore: number
  passRate: number
  streakDays: number
  lastActivity: string | null
}

const generateId = () => Math.random().toString(36).substr(2, 9)

export const useTestStore = create<TestStore>()(
  persist(
    (set, get) => ({
      tests: [],
      attempts: [],
      
      addTest: (testData) => {
        const id = generateId()
        const now = new Date().toISOString()
        const newTest: Test = {
          ...testData,
          id,
          createdAt: now,
          updatedAt: now,
          attempts: 0,
          category: testData.category || 'boshqa',
          difficulty: testData.difficulty || 'orta',
          shuffleQuestions: testData.shuffleQuestions ?? true,
          showExplanations: testData.showExplanations ?? true,
          passingScore: testData.passingScore || 60,
          tags: testData.tags || [],
          creator: testData.creator || 'TestAI Foydalanuvchi',
          isPublic: testData.isPublic ?? true,
        }
        set((state) => ({ tests: [...state.tests, newTest] }))
        return id
      },
      
      updateTest: (id, data) => {
        set((state) => ({
          tests: state.tests.map((test) =>
            test.id === id
              ? { ...test, ...data, updatedAt: new Date().toISOString() }
              : test
          ),
        }))
      },
      
      deleteTest: (id) => {
        set((state) => ({
          tests: state.tests.filter((test) => test.id !== id),
          attempts: state.attempts.filter((attempt) => attempt.testId !== id),
        }))
      },
      
      duplicateTest: (id) => {
        const test = get().getTest(id)
        if (!test) return null
        
        const newId = generateId()
        const now = new Date().toISOString()
        const duplicatedTest: Test = {
          ...test,
          id: newId,
          name: `${test.name} (nusxa)`,
          createdAt: now,
          updatedAt: now,
          attempts: 0,
          status: 'draft',
          questions: test.questions.map(q => ({ ...q, id: generateId() })),
        }
        
        set((state) => ({ tests: [...state.tests, duplicatedTest] }))
        return newId
      },
      
      publishTest: (id) => {
        get().updateTest(id, { status: 'active' })
      },
      
      unpublishTest: (id) => {
        get().updateTest(id, { status: 'draft' })
      },
      
      archiveTest: (id) => {
        get().updateTest(id, { status: 'archived' })
      },
      
      addAttempt: (attemptData) => {
        const test = get().getTest(attemptData.testId)
        const attempt: TestAttempt = {
          ...attemptData,
          id: generateId(),
          completedAt: new Date().toISOString(),
          category: test?.category || 'boshqa',
          difficulty: test?.difficulty || 'orta',
        }
        
        set((state) => ({
          attempts: [...state.attempts, attempt],
          tests: state.tests.map((test) =>
            test.id === attemptData.testId
              ? { ...test, attempts: test.attempts + 1 }
              : test
          ),
        }))
      },
      
      getTestAttempts: (testId) => {
        return get().attempts.filter((attempt) => attempt.testId === testId)
      },
      
      getTest: (id) => get().tests.find((test) => test.id === id),
      getActiveTests: () => get().tests.filter((test) => test.status === 'active'),
      getDraftTests: () => get().tests.filter((test) => test.status === 'draft'),
      
      getTestsByCategory: (category) => {
        return get().tests.filter((test) => test.category === category)
      },
      
      getRecentAttempts: (limit = 10) => {
        return [...get().attempts]
          .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
          .slice(0, limit)
      },
      
      getLeaderboard: () => {
        const attempts = get().attempts
        const userStats = new Map<string, { totalScore: number; totalTests: number; scores: number[] }>()
        
        attempts.forEach(attempt => {
          const existing = userStats.get(attempt.testId) || { totalScore: 0, totalTests: 0, scores: [] }
          existing.totalScore += attempt.score
          existing.totalTests += 1
          existing.scores.push(attempt.score)
          userStats.set(attempt.testId, existing)
        })
        
        const leaderboard: LeaderboardEntry[] = Array.from(userStats.entries())
          .map(([userId, stats]) => ({
            userId,
            userName: 'Foydalanuvchi',
            totalScore: stats.totalScore,
            totalTests: stats.totalTests,
            avgScore: Math.round(stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length),
            rank: 0,
          }))
          .sort((a, b) => b.totalScore - a.totalScore)
          .map((entry, index) => ({ ...entry, rank: index + 1 }))
        
        return leaderboard.slice(0, 10)
      },
      
      getStatistics: () => {
        const tests = get().tests
        const attempts = get().attempts
        
        if (attempts.length === 0) {
          return {
            totalTests: tests.length,
            totalAttempts: 0,
            avgScore: 0,
            totalTimeSpent: 0,
            bestScore: 0,
            worstScore: 0,
            passRate: 0,
            streakDays: 0,
            lastActivity: null,
          }
        }
        
        const scores = attempts.map(a => a.score)
        const totalTime = attempts.reduce((sum, a) => sum + a.timeSpent, 0)
        const bestScore = Math.max(...scores)
        const worstScore = Math.min(...scores)
        const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        const passRate = Math.round((scores.filter(s => s >= 60).length / scores.length) * 100)
        
        // Calculate streak
        const dates = [...new Set(attempts.map(a => 
          new Date(a.completedAt).toDateString()
        ))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
        
        let streak = 0
        const today = new Date()
        for (let i = 0; i < dates.length; i++) {
          const checkDate = new Date(today)
          checkDate.setDate(today.getDate() - i)
          if (dates.includes(checkDate.toDateString())) {
            streak++
          } else {
            break
          }
        }
        
        const lastActivity = attempts.length > 0 
          ? attempts.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0].completedAt
          : null
        
        return {
          totalTests: tests.length,
          totalAttempts: attempts.length,
          avgScore,
          totalTimeSpent: totalTime,
          bestScore,
          worstScore,
          passRate,
          streakDays: streak,
          lastActivity,
        }
      },
      
      getCategoryStats: () => {
        const attempts = get().attempts
        const categories = new Map<TestCategory, { scores: number[]; count: number }>()
        
        attempts.forEach(attempt => {
          const existing = categories.get(attempt.category) || { scores: [], count: 0 }
          existing.scores.push(attempt.score)
          existing.count++
          categories.set(attempt.category, existing)
        })
        
        const result: Record<TestCategory, { count: number; avgScore: number }> = {} as any
        Object.keys(CATEGORY_LABELS).forEach(cat => {
          const stats = categories.get(cat as TestCategory)
          result[cat as TestCategory] = {
            count: stats?.count || 0,
            avgScore: stats?.scores?.length 
              ? Math.round(stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length)
              : 0,
          }
        })
        
        return result
      },
    }),
    {
      name: 'testai-storage',
    }
  )
)
