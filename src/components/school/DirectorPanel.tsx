'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  LogOut, 
  Plus, 
  Trash2, 
  Users, 
  School, 
  UserCog,
  AlertCircle,
  CheckCircle,
  BookOpen,
  GraduationCap
} from 'lucide-react'

interface Teacher {
  id: string
  userId: string
  subject: string
  user: {
    id: string
    login: string
    name: string
  }
  classTeacher: { id: string; class: { id: string; name: string } }[]
}

interface ClassData {
  id: string
  name: string
  schoolId: string
  _count?: { students: number }
  classTeachers?: { teacherId: string; teacher: { user: { name: string }; subject: string } }[]
}

interface Student {
  id: string
  firstName: string
  lastName: string
  middleName?: string | null
  coins: number
  classId: string
}

export function DirectorPanel() {
  const { user, directorInfo, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'teachers' | 'classes' | 'students'>('teachers')
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [classes, setClasses] = useState<ClassData[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Form states
  const [newTeacherLogin, setNewTeacherLogin] = useState('')
  const [newTeacherPassword, setNewTeacherPassword] = useState('')
  const [newTeacherName, setNewTeacherName] = useState('')
  const [newTeacherSubject, setNewTeacherSubject] = useState('')
  const [newClassName, setNewClassName] = useState('')
  const [newStudentFirstName, setNewStudentFirstName] = useState('')
  const [newStudentLastName, setNewStudentLastName] = useState('')
  const [newStudentMiddleName, setNewStudentMiddleName] = useState('')
  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedStudentClassId, setSelectedStudentClassId] = useState('')
  
  // View states
  const [selectedClassForView, setSelectedClassForView] = useState<ClassData | null>(null)

  const fetchTeachers = async () => {
    try {
      // Get director info first
      const currentUser = useAuthStore.getState().user
      if (!currentUser) return
      
      const directorsRes = await fetch('/api/directors')
      const directors = await directorsRes.json()
      const director = directors.find((d: any) => d.userId === currentUser.id)
      
      if (!director) return
      
      const response = await fetch(`/api/teachers?directorId=${director.id}`)
      const data = await response.json()
      setTeachers(data)
    } catch (err) {
      console.error('Fetch teachers error:', err)
    }
  }

  const fetchClasses = async () => {
    try {
      const response = await fetch(`/api/classes?schoolId=${directorInfo?.schoolId}`)
      const data = await response.json()
      setClasses(data)
      if (data.length > 0 && !selectedClassId) {
        setSelectedClassId(data[0].id)
        setSelectedStudentClassId(data[0].id)
      }
    } catch (err) {
      console.error('Fetch classes error:', err)
    }
  }

  const fetchStudents = async (classId: string) => {
    try {
      const response = await fetch(`/api/students?classId=${classId}`)
      const data = await response.json()
      setStudents(data)
    } catch (err) {
      console.error('Fetch students error:', err)
    }
  }

  // Fetch data on mount
  useEffect(() => {
    if (directorInfo?.schoolId) {
      fetchTeachers()
      fetchClasses()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [directorInfo])

  const handleCreateTeacher = async () => {
    if (!newTeacherLogin.trim() || !newTeacherPassword.trim() || !newTeacherName.trim() || !newTeacherSubject.trim()) {
      setError('Barcha maydonlarni to\'ldiring')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      // Get director ID
      const user = useAuthStore.getState().user
      const directorsRes = await fetch('/api/directors')
      const directors = await directorsRes.json()
      const director = directors.find((d: any) => d.userId === user?.id)
      
      if (!director) {
        setError('Direktor topilmadi')
        setIsLoading(false)
        return
      }
      
      const response = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: newTeacherLogin,
          password: newTeacherPassword,
          name: newTeacherName,
          subject: newTeacherSubject,
          directorId: director.id,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Xatolik yuz berdi')
        setIsLoading(false)
        return
      }
      
      setSuccess('O\'qituvchi muvaffaqiyatli qo\'shildi')
      setNewTeacherLogin('')
      setNewTeacherPassword('')
      setNewTeacherName('')
      setNewTeacherSubject('')
      fetchTeachers()
    } catch (err) {
      setError('Server xatosi')
    }
    setIsLoading(false)
  }

  const handleDeleteTeacher = async (teacherId: string) => {
    if (!confirm('O\'qituvchini o\'chirishga ishonchingiz komilmi?')) return
    
    try {
      await fetch('/api/teachers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: teacherId }),
      })
      setSuccess('O\'qituvchi o\'chirildi')
      fetchTeachers()
    } catch (err) {
      setError('O\'chirishda xatolik')
    }
  }

  const handleCreateClass = async () => {
    if (!newClassName.trim()) {
      setError('Sinf nomini kiriting')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newClassName,
          schoolId: directorInfo?.schoolId,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Xatolik yuz berdi')
        setIsLoading(false)
        return
      }
      
      setSuccess('Sinf muvaffaqiyatli qo\'shildi')
      setNewClassName('')
      fetchClasses()
    } catch (err) {
      setError('Server xatosi')
    }
    setIsLoading(false)
  }

  const handleDeleteClass = async (classId: string) => {
    if (!confirm('Sinfni o\'chirishga ishonchingiz komilmi?')) return
    
    try {
      await fetch('/api/classes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: classId }),
      })
      setSuccess('Sinf o\'chirildi')
      fetchClasses()
    } catch (err) {
      setError('O\'chirishda xatolik')
    }
  }

  const handleCreateStudent = async () => {
    if (!newStudentFirstName.trim() || !newStudentLastName.trim() || !selectedStudentClassId) {
      setError('Ism, familiya va sinfni kiriting')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: newStudentFirstName,
          lastName: newStudentLastName,
          middleName: newStudentMiddleName || undefined,
          classId: selectedStudentClassId,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Xatolik yuz berdi')
        setIsLoading(false)
        return
      }
      
      setSuccess('O\'quvchi muvaffaqiyatli qo\'shildi')
      setNewStudentFirstName('')
      setNewStudentLastName('')
      setNewStudentMiddleName('')
      fetchStudents(selectedStudentClassId)
    } catch (err) {
      setError('Server xatosi')
    }
    setIsLoading(false)
  }

  const handleDeleteStudent = async (studentId: string, classId: string) => {
    if (!confirm('O\'quvchini o\'chirishga ishonchingiz komilmi?')) return
    
    try {
      await fetch('/api/students', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: studentId }),
      })
      setSuccess('O\'quvchi o\'chirildi')
      fetchStudents(classId)
    } catch (err) {
      setError('O\'chirishda xatolik')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
              <School className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Direktor Paneli</h1>
              <p className="text-sm text-gray-400">{directorInfo?.schoolName} | {user?.name}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={logout}
            className="border-red-500/50 text-red-400 hover:bg-red-500/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Chiqish
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={activeTab === 'teachers' ? 'default' : 'outline'}
            onClick={() => setActiveTab('teachers')}
            className={activeTab === 'teachers' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-white/20 text-white'}
          >
            <Users className="w-4 h-4 mr-2" />
            O'qituvchilar
          </Button>
          <Button
            variant={activeTab === 'classes' ? 'default' : 'outline'}
            onClick={() => setActiveTab('classes')}
            className={activeTab === 'classes' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-white/20 text-white'}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Sinflar
          </Button>
          <Button
            variant={activeTab === 'students' ? 'default' : 'outline'}
            onClick={() => setActiveTab('students')}
            className={activeTab === 'students' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-white/20 text-white'}
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            O'quvchilar
          </Button>
        </div>

        {/* Alerts */}
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

        {/* Teachers Tab */}
        {activeTab === 'teachers' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Add Teacher Form */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Yangi O'qituvchi Qo'shish
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="O'qituvchi ismi"
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Input
                  placeholder="Fan (masalan: Matematika)"
                  value={newTeacherSubject}
                  onChange={(e) => setNewTeacherSubject(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Input
                  placeholder="Login"
                  value={newTeacherLogin}
                  onChange={(e) => setNewTeacherLogin(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Input
                  placeholder="Parol"
                  value={newTeacherPassword}
                  onChange={(e) => setNewTeacherPassword(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Button
                  onClick={handleCreateTeacher}
                  disabled={isLoading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                >
                  {isLoading ? 'Qo\'shilmoqda...' : 'O\'qituvchi Qo\'shish'}
                </Button>
              </CardContent>
            </Card>

            {/* Teachers List */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">O'qituvchilar Ro'yxati</CardTitle>
                <CardDescription className="text-gray-400">
                  Jami: {teachers.length} ta o'qituvchi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {teachers.map(teacher => (
                    <div
                      key={teacher.id}
                      className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-white">{teacher.user.name}</p>
                        <p className="text-sm text-emerald-400">{teacher.subject}</p>
                        <p className="text-sm text-gray-400">Login: {teacher.user.login}</p>
                        <p className="text-xs text-gray-500">
                          {teacher.classTeacher.length} ta sinf
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteTeacher(teacher.id)}
                        className="text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {teachers.length === 0 && (
                    <p className="text-center text-gray-400 py-4">O'qituvchilar yo'q</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Classes Tab */}
        {activeTab === 'classes' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Add Class Form */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Yangi Sinf Qo'shish
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Sinf nomi (masalan: 9-A)"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Button
                  onClick={handleCreateClass}
                  disabled={isLoading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                >
                  {isLoading ? 'Qo\'shilmoqda...' : 'Sinf Qo\'shish'}
                </Button>
              </CardContent>
            </Card>

            {/* Classes List */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Sinflar Ro'yxati</CardTitle>
                <CardDescription className="text-gray-400">
                  Jami: {classes.length} ta sinf
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {classes.map(cls => (
                    <div
                      key={cls.id}
                      className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">{cls.name}</p>
                          <Badge variant="secondary" className="bg-amber-500/20 text-amber-300">
                            {cls._count?.students || 0} o'quvchi
                          </Badge>
                        </div>
                        {cls.classTeachers && cls.classTeachers.length > 0 && (
                          <p className="text-xs text-gray-400 mt-1">
                            {cls.classTeachers.map(ct => ct.teacher.user.name).join(', ')}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClass(cls.id)}
                        className="text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {classes.length === 0 && (
                    <p className="text-center text-gray-400 py-4">Sinflar yo'q</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Add Student Form */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Yangi O'quvchi Qo'shish
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <select
                  value={selectedStudentClassId}
                  onChange={(e) => {
                    setSelectedStudentClassId(e.target.value)
                    fetchStudents(e.target.value)
                  }}
                  className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white"
                >
                  <option value="" className="bg-slate-800">Sinf tanlang</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id} className="bg-slate-800">
                      {cls.name}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="Ismi"
                  value={newStudentFirstName}
                  onChange={(e) => setNewStudentFirstName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Input
                  placeholder="Familiyasi"
                  value={newStudentLastName}
                  onChange={(e) => setNewStudentLastName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Input
                  placeholder="Otasining ismi (ixtiyoriy)"
                  value={newStudentMiddleName}
                  onChange={(e) => setNewStudentMiddleName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Button
                  onClick={handleCreateStudent}
                  disabled={isLoading || !selectedStudentClassId}
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                >
                  {isLoading ? 'Qo\'shilmoqda...' : 'O\'quvchi Qo\'shish'}
                </Button>
              </CardContent>
            </Card>

            {/* Students List */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">O'quvchilar Ro'yxati</CardTitle>
                <CardDescription className="text-gray-400">
                  {selectedStudentClassId ? (
                    <span>
                      {classes.find(c => c.id === selectedStudentClassId)?.name} sinfi | 
                      Jami: {students.length} ta o'quvchi
                    </span>
                  ) : 'Sinf tanlang'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {students.map((student, index) => (
                    <div
                      key={student.id}
                      className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 w-6">{index + 1}.</span>
                        <div>
                          <p className="font-medium text-white">
                            {student.lastName} {student.firstName} {student.middleName || ''}
                          </p>
                          <p className="text-sm text-amber-400">🪙 {student.coins} coin</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteStudent(student.id, selectedStudentClassId)}
                        className="text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {students.length === 0 && selectedStudentClassId && (
                    <p className="text-center text-gray-400 py-4">O'quvchilar yo'q</p>
                  )}
                  {!selectedStudentClassId && (
                    <p className="text-center text-gray-400 py-4">Sinf tanlang</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
