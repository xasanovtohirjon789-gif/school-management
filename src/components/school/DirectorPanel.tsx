'use client'

import { useState, useEffect } from 'react'
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
  BookOpen,
  AlertCircle,
  CheckCircle,
  GraduationCap
} from 'lucide-react'

interface DirectorPanelProps {
  user: { id: string; login: string; name: string; role: string }
  directorInfo: { schoolId: string; schoolName: string; directorId?: string } | null
  onLogout: () => void
}

export function DirectorPanel({ user, directorInfo, onLogout }: DirectorPanelProps) {
  const [activeTab, setActiveTab] = useState<'teachers' | 'classes' | 'students'>('teachers')
  const [teachers, setTeachers] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [newClassName, setNewClassName] = useState('')
  const [newStudentFirstName, setNewStudentFirstName] = useState('')
  const [newStudentLastName, setNewStudentLastName] = useState('')
  const [newStudentMiddleName, setNewStudentMiddleName] = useState('')
  const [selectedStudentClassId, setSelectedStudentClassId] = useState('')
  const [selectedClassForTeacher, setSelectedClassForTeacher] = useState('')
  const [selectedTeacherId, setSelectedTeacherId] = useState('')

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [directorInfo])

  const loadData = async () => {
    try {
      // Load classes
      const classesRes = await fetch(`/api/classes?schoolId=${directorInfo?.schoolId}`)
      const classesData = await classesRes.json()
      setClasses(classesData)
      
      if (classesData.length > 0 && !selectedStudentClassId) {
        setSelectedStudentClassId(classesData[0].id)
      }
      
      // Load teachers for this director
      if (directorInfo?.directorId) {
        const teachersRes = await fetch(`/api/teachers?directorId=${directorInfo.directorId}`)
        const teachersData = await teachersRes.json()
        setTeachers(teachersData)
      }
    } catch (e) {
      console.error('Load error:', e)
      setError('Ma\'lumotlarni yuklashda xatolik')
    }
  }

  const loadStudents = async () => {
    if (!selectedStudentClassId) return
    try {
      const res = await fetch(`/api/students?classId=${selectedStudentClassId}`)
      const data = await res.json()
      setStudents(data)
    } catch (e) {
      console.error('Load students error:', e)
    }
  }

  useEffect(() => {
    loadStudents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStudentClassId])

  const handleCreateClass = async () => {
    if (!newClassName.trim()) {
      setError('Sinf nomini kiriting')
      return
    }
    
    setIsLoading(true)
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newClassName, 
          schoolId: directorInfo?.schoolId 
        })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'Xatolik yuz berdi')
      } else {
        setSuccess('Sinf muvaffaqiyatli yaratildi')
        setNewClassName('')
        loadData()
      }
    } catch (e) {
      setError('Server bilan bog\'lanishda xatolik')
    }
    setIsLoading(false)
  }

  const handleCreateStudent = async () => {
    if (!newStudentFirstName.trim() || !newStudentLastName.trim() || !selectedStudentClassId) {
      setError('Ism, familiya va sinfni kiriting')
      return
    }
    
    setIsLoading(true)
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: newStudentFirstName,
          lastName: newStudentLastName,
          middleName: newStudentMiddleName || null,
          classId: selectedStudentClassId
        })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'Xatolik yuz berdi')
      } else {
        setSuccess('O\'quvchi muvaffaqiyatli qo\'shildi')
        setNewStudentFirstName('')
        setNewStudentLastName('')
        setNewStudentMiddleName('')
        loadStudents()
        loadData()
      }
    } catch (e) {
      setError('Server bilan bog\'lanishda xatolik')
    }
    setIsLoading(false)
  }

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('O\'quvchini o\'chirishga ishonchingiz komilmi?')) return
    
    try {
      const res = await fetch(`/api/students?id=${studentId}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        setSuccess('O\'quvchi o\'chirildi')
        loadStudents()
        loadData()
      } else {
        const data = await res.json()
        setError(data.error || 'Xatolik yuz berdi')
      }
    } catch (e) {
      setError('Server bilan bog\'lanishda xatolik')
    }
  }

  const handleAssignTeacherToClass = async () => {
    if (!selectedTeacherId || !selectedClassForTeacher) {
      setError('O\'qituvchi va sinfni tanlang')
      return
    }
    
    setIsLoading(true)
    try {
      const res = await fetch('/api/classes/assign-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: selectedTeacherId,
          classId: selectedClassForTeacher
        })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'Xatolik yuz berdi')
      } else {
        setSuccess('O\'qituvchi sinfga biriktirildi')
        setSelectedTeacherId('')
        setSelectedClassForTeacher('')
        loadData()
      }
    } catch (e) {
      setError('Server bilan bog\'lanishda xatolik')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
            onClick={onLogout}
            className="border-red-500/50 text-red-400 hover:bg-red-500/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Chiqish
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={activeTab === 'teachers' ? 'default' : 'outline'}
            onClick={() => setActiveTab('teachers')}
            className={activeTab === 'teachers' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-white/20 text-white'}
          >
            <Users className="w-4 h-4 mr-2" />
            O&apos;qituvchilar ({teachers.length})
          </Button>
          <Button
            variant={activeTab === 'classes' ? 'default' : 'outline'}
            onClick={() => setActiveTab('classes')}
            className={activeTab === 'classes' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-white/20 text-white'}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Sinflar ({classes.length})
          </Button>
          <Button
            variant={activeTab === 'students' ? 'default' : 'outline'}
            onClick={() => setActiveTab('students')}
            className={activeTab === 'students' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-white/20 text-white'}
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            O&apos;quvchilar
          </Button>
        </div>

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

        {activeTab === 'teachers' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  O&apos;qituvchini Sinfga Biriktirish
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white"
                >
                  <option value="" className="bg-slate-800">O'qituvchi tanlang</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id} className="bg-slate-800">
                      {teacher.user?.name} ({teacher.subject})
                    </option>
                  ))}
                </select>
                <select
                  value={selectedClassForTeacher}
                  onChange={(e) => setSelectedClassForTeacher(e.target.value)}
                  className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white"
                >
                  <option value="" className="bg-slate-800">Sinf tanlang</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id} className="bg-slate-800">
                      {cls.name}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={handleAssignTeacherToClass}
                  disabled={!selectedTeacherId || !selectedClassForTeacher || isLoading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                >
                  Biriktirish
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">O&apos;qituvchilar Ro&apos;yxati</CardTitle>
                <CardDescription className="text-gray-400">
                  {directorInfo?.schoolName} | Jami: {teachers.length} ta o&apos;qituvchi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {teachers.map(teacher => (
                    <div
                      key={teacher.id}
                      className="p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <p className="font-medium text-white">{teacher.user?.name}</p>
                      <p className="text-sm text-emerald-400">Fan: {teacher.subject}</p>
                      <p className="text-sm text-gray-400">Login: {teacher.user?.login}</p>
                      {teacher.classTeacher && teacher.classTeacher.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {teacher.classTeacher.map((ct: any) => (
                            <Badge key={ct.id} variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs">
                              {ct.class?.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {teachers.length === 0 && (
                    <p className="text-center text-gray-400 py-4">O&apos;qituvchilar yo&apos;q</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'classes' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Yangi Sinf Qo&apos;shish
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
                  Sinf Qo&apos;shish
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Sinflar Ro&apos;yxati</CardTitle>
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
                      <div>
                        <p className="font-medium text-white">{cls.name}</p>
                      </div>
                      <Badge variant="secondary" className="bg-amber-500/20 text-amber-300">
                        {cls._count?.students || 0} o&apos;quvchi
                      </Badge>
                    </div>
                  ))}
                  {classes.length === 0 && (
                    <p className="text-center text-gray-400 py-4">Sinflar yo&apos;q</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Yangi O&apos;quvchi Qo&apos;shish
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <select
                  value={selectedStudentClassId}
                  onChange={(e) => setSelectedStudentClassId(e.target.value)}
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
                  disabled={!selectedStudentClassId || isLoading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                >
                  O&apos;quvchi Qo&apos;shish
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">O&apos;quvchilar Ro&apos;yxati</CardTitle>
                <CardDescription className="text-gray-400">
                  {selectedStudentClassId ? (
                    <span>
                      {classes.find(c => c.id === selectedStudentClassId)?.name} sinfi | 
                      Jami: {students.length} ta o&apos;quvchi
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
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {students.length === 0 && selectedStudentClassId && (
                    <p className="text-center text-gray-400 py-4">O&apos;quvchilar yo&apos;q</p>
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
