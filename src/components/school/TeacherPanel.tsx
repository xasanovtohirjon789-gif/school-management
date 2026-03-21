'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  LogOut, 
  Plus, 
  Minus,
  BookOpen,
  AlertCircle,
  CheckCircle,
  GraduationCap,
  Coins,
  History
} from 'lucide-react'

interface TeacherPanelProps {
  user: { id: string; login: string; name: string; role: string }
  teacherInfo: { subject: string; teacherId: string; classes: { id: string; name: string }[] } | null
  onLogout: () => void
}

export function TeacherPanel({ user, teacherInfo, onLogout }: TeacherPanelProps) {
  const [classes, setClasses] = useState<any[]>([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [students, setStudents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacherInfo])

  const loadData = async () => {
    if (!teacherInfo?.teacherId) return
    
    try {
      // Get teacher with classes
      const res = await fetch(`/api/teachers?directorId=_all`)
      const allTeachers = await res.json()
      const teacher = allTeachers.find((t: any) => t.id === teacherInfo.teacherId)
      
      if (teacher && teacher.classTeacher) {
        const classesData = teacher.classTeacher.map((ct: any) => ({
          id: ct.class.id,
          name: ct.class.name
        }))
        setClasses(classesData)
        
        if (classesData.length > 0) {
          setSelectedClassId(classesData[0].id)
        }
      }
    } catch (e) {
      console.error('Load error:', e)
    }
  }

  useEffect(() => {
    loadStudents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassId])

  const loadStudents = async () => {
    if (!selectedClassId) return
    try {
      const res = await fetch(`/api/students?classId=${selectedClassId}`)
      const data = await res.json()
      setStudents(data)
    } catch (e) {
      console.error('Load students error:', e)
    }
  }

  const handleCoinChange = async (studentId: string, amount: number) => {
    setIsLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/coins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          teacherId: teacherInfo?.teacherId,
          amount,
          reason: amount > 0 ? 'Mukofot' : 'Jazo'
        })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'Xatolik yuz berdi')
      } else {
        // Update local state
        setStudents(prev => prev.map(s => 
          s.id === studentId ? { ...s, coins: s.coins + amount } : s
        ))
        setSuccess(`${amount > 0 ? '+' : ''}${amount} coin muvaffaqiyatli qo'shildi`)
      }
    } catch (e) {
      setError('Server bilan bog\'lanishda xatolik')
    }
    setIsLoading(false)
  }

  const loadTransactions = async () => {
    if (!teacherInfo?.teacherId) return
    try {
      const res = await fetch(`/api/coins?teacherId=${teacherInfo.teacherId}`)
      const data = await res.json()
      setTransactions(data)
    } catch (e) {
      console.error('Load transactions error:', e)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">O&apos;qituvchi Paneli</h1>
              <p className="text-sm text-gray-400">
                {teacherInfo?.subject} | {user?.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowHistory(!showHistory)
                if (!showHistory) loadTransactions()
              }}
              className="border-amber-500/50 text-amber-400 hover:bg-amber-500/20"
            >
              <History className="w-4 h-4 mr-2" />
              Tarix
            </Button>
            <Button
              variant="outline"
              onClick={onLogout}
              className="border-red-500/50 text-red-400 hover:bg-red-500/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Chiqish
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 mb-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
            <button onClick={() => setError('')} className="ml-auto">✕</button>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-200 mb-4">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            {success}
            <button onClick={() => setSuccess('')} className="ml-auto">✕</button>
          </div>
        )}

        {showHistory && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <History className="w-5 h-5" />
                Coin Tarixi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {transactions.map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                    <div>
                      <span className="text-white">
                        {t.student?.lastName} {t.student?.firstName}
                      </span>
                      <span className="text-gray-400 text-sm ml-2">
                        {new Date(t.createdAt).toLocaleDateString('uz-UZ')}
                      </span>
                    </div>
                    <span className={t.amount > 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {t.amount > 0 ? '+' : ''}{t.amount}
                    </span>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <p className="text-center text-gray-400 py-4">Tarix yo&apos;q</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {classes.length > 0 && (
          <div className="mb-6">
            <label className="text-sm text-gray-300 mb-2 block">Sinfni tanlang</label>
            <div className="flex flex-wrap gap-2">
              {classes.map(cls => (
                <Button
                  key={cls.id}
                  variant={selectedClassId === cls.id ? 'default' : 'outline'}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={selectedClassId === cls.id ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-white/20 text-white'}
                >
                  {cls.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {classes.length === 0 && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="py-12 text-center">
              <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Sinf biriktirilmagan</h3>
              <p className="text-gray-400">
                Sizga hali hech qanday sinf biriktirilmagan. 
                Direktoringiz bilan bog&apos;laning.
              </p>
            </CardContent>
          </Card>
        )}

        {selectedClassId && students.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                {classes.find(c => c.id === selectedClassId)?.name} - O&apos;quvchilar
              </CardTitle>
              <CardDescription className="text-gray-400">
                Jami: {students.length} ta o&apos;quvchi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">№</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">F.I.O.</th>
                      <th className="text-center py-3 px-4 text-gray-300 font-medium">
                        <div className="flex items-center justify-center gap-1">
                          <Coins className="w-4 h-4 text-amber-400" />
                          Coin
                        </div>
                      </th>
                      <th className="text-center py-3 px-4 text-gray-300 font-medium">Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-3 px-4 text-gray-400">{index + 1}</td>
                        <td className="py-3 px-4 text-white font-medium">
                          {student.lastName} {student.firstName} {student.middleName || ''}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                            <Coins className="w-4 h-4" />
                            {student.coins || 0}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCoinChange(student.id, 1)}
                              disabled={isLoading}
                              className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20 w-10 h-10 p-0"
                            >
                              <Plus className="w-5 h-5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCoinChange(student.id, -1)}
                              disabled={isLoading}
                              className="border-red-500/50 text-red-400 hover:bg-red-500/20 w-10 h-10 p-0"
                            >
                              <Minus className="w-5 h-5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedClassId && students.length === 0 && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="py-12 text-center">
              <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">O&apos;quvchilar yo&apos;q</h3>
              <p className="text-gray-400">
                Bu sinfda hali o&apos;quvchilar qo&apos;shilmagan.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
