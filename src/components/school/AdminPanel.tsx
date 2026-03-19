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
  ChevronDown,
  ChevronRight
} from 'lucide-react'

interface Director {
  id: string
  userId: string
  schoolId: string
  user: {
    id: string
    login: string
    name: string
  }
  school: {
    id: string
    name: string
  }
  _count?: {
    teachers: number
  }
}

interface SchoolData {
  id: string
  name: string
  address?: string | null
  _count?: {
    classes: number
    directors: number
  }
}

export function AdminPanel() {
  const { user, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'directors' | 'schools' | 'classes'>('directors')
  const [directors, setDirectors] = useState<Director[]>([])
  const [schools, setSchools] = useState<SchoolData[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Form states
  const [newSchoolName, setNewSchoolName] = useState('')
  const [newSchoolAddress, setNewSchoolAddress] = useState('')
  const [selectedSchoolId, setSelectedSchoolId] = useState('')
  const [newDirectorLogin, setNewDirectorLogin] = useState('')
  const [newDirectorPassword, setNewDirectorPassword] = useState('')
  const [newDirectorName, setNewDirectorName] = useState('')
  
  // Expanded schools for classes view
  const [expandedSchools, setExpandedSchools] = useState<string[]>([])

  const fetchDirectors = async () => {
    try {
      const response = await fetch('/api/directors')
      const data = await response.json()
      setDirectors(data)
    } catch (err) {
      console.error('Fetch directors error:', err)
    }
  }

  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/schools')
      const data = await response.json()
      setSchools(data)
      if (data.length > 0 && !selectedSchoolId) {
        setSelectedSchoolId(data[0].id)
      }
    } catch (err) {
      console.error('Fetch schools error:', err)
    }
  }

  const fetchAllClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      const data = await response.json()
      setClasses(data)
    } catch (err) {
      console.error('Fetch classes error:', err)
    }
  }

  // Fetch data on mount
  useEffect(() => {
    fetchDirectors()
    fetchSchools()
    fetchAllClasses()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCreateSchool = async () => {
    if (!newSchoolName.trim()) {
      setError('Maktab nomini kiriting')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSchoolName,
          address: newSchoolAddress || undefined,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Xatolik yuz berdi')
        setIsLoading(false)
        return
      }
      
      setSuccess('Maktab muvaffaqiyatli yaratildi')
      setNewSchoolName('')
      setNewSchoolAddress('')
      fetchSchools()
    } catch (err) {
      setError('Server xatosi')
    }
    setIsLoading(false)
  }

  const handleCreateDirector = async () => {
    if (!newDirectorLogin.trim() || !newDirectorPassword.trim() || !newDirectorName.trim() || !selectedSchoolId) {
      setError('Barcha maydonlarni to\'ldiring')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/directors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: newDirectorLogin,
          password: newDirectorPassword,
          name: newDirectorName,
          schoolId: selectedSchoolId,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Xatolik yuz berdi')
        setIsLoading(false)
        return
      }
      
      setSuccess('Direktor muvaffaqiyatli yaratildi')
      setNewDirectorLogin('')
      setNewDirectorPassword('')
      setNewDirectorName('')
      fetchDirectors()
      fetchSchools()
    } catch (err) {
      setError('Server xatosi')
    }
    setIsLoading(false)
  }

  const toggleSchoolExpand = (schoolId: string) => {
    setExpandedSchools(prev => 
      prev.includes(schoolId) 
        ? prev.filter(id => id !== schoolId)
        : [...prev, schoolId]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <UserCog className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Bosh Admin Paneli</h1>
              <p className="text-sm text-gray-400">Xush kelibsiz, {user?.name}</p>
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
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'directors' ? 'default' : 'outline'}
            onClick={() => setActiveTab('directors')}
            className={activeTab === 'directors' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-white/20 text-white'}
          >
            <Users className="w-4 h-4 mr-2" />
            Direktorlar
          </Button>
          <Button
            variant={activeTab === 'schools' ? 'default' : 'outline'}
            onClick={() => setActiveTab('schools')}
            className={activeTab === 'schools' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-white/20 text-white'}
          >
            <School className="w-4 h-4 mr-2" />
            Maktablar
          </Button>
          <Button
            variant={activeTab === 'classes' ? 'default' : 'outline'}
            onClick={() => setActiveTab('classes')}
            className={activeTab === 'classes' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-white/20 text-white'}
          >
            <School className="w-4 h-4 mr-2" />
            Sinflar
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

        {/* Directors Tab */}
        {activeTab === 'directors' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Add Director Form */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Yangi Direktor Qo'shish
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Maktabni tanlang</label>
                  <select
                    value={selectedSchoolId}
                    onChange={(e) => setSelectedSchoolId(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white"
                  >
                    <option value="">Maktab tanlang</option>
                    {schools.map(school => (
                      <option key={school.id} value={school.id} className="bg-slate-800">
                        {school.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  placeholder="Direktor ismi"
                  value={newDirectorName}
                  onChange={(e) => setNewDirectorName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Input
                  placeholder="Login"
                  value={newDirectorLogin}
                  onChange={(e) => setNewDirectorLogin(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Input
                  placeholder="Parol"
                  value={newDirectorPassword}
                  onChange={(e) => setNewDirectorPassword(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Button
                  onClick={handleCreateDirector}
                  disabled={isLoading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                >
                  {isLoading ? 'Yaratilmoqda...' : 'Direktor Qo\'shish'}
                </Button>
              </CardContent>
            </Card>

            {/* Directors List */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Direktorlar Ro'yxati</CardTitle>
                <CardDescription className="text-gray-400">
                  Jami: {directors.length} ta direktor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {directors.map(director => (
                    <div
                      key={director.id}
                      className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-white">{director.user.name}</p>
                        <p className="text-sm text-gray-400">Login: {director.user.login}</p>
                        <p className="text-sm text-emerald-400">{director.school.name}</p>
                      </div>
                      <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300">
                        {director._count?.teachers || 0} o'qituvchi
                      </Badge>
                    </div>
                  ))}
                  {directors.length === 0 && (
                    <p className="text-center text-gray-400 py-4">Direktorlar yo'q</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Schools Tab */}
        {activeTab === 'schools' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Add School Form */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Yangi Maktab Qo'shish
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Maktab nomi"
                  value={newSchoolName}
                  onChange={(e) => setNewSchoolName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Input
                  placeholder="Manzil (ixtiyoriy)"
                  value={newSchoolAddress}
                  onChange={(e) => setNewSchoolAddress(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Button
                  onClick={handleCreateSchool}
                  disabled={isLoading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                >
                  {isLoading ? 'Yaratilmoqda...' : 'Maktab Qo\'shish'}
                </Button>
              </CardContent>
            </Card>

            {/* Schools List */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Maktablar Ro'yxati</CardTitle>
                <CardDescription className="text-gray-400">
                  Jami: {schools.length} ta maktab
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {schools.map(school => (
                    <div
                      key={school.id}
                      className="p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-white">{school.name}</p>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                            {school._count?.classes || 0} sinf
                          </Badge>
                          <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300">
                            {school._count?.directors || 0} direktor
                          </Badge>
                        </div>
                      </div>
                      {school.address && (
                        <p className="text-sm text-gray-400 mt-1">{school.address}</p>
                      )}
                    </div>
                  ))}
                  {schools.length === 0 && (
                    <p className="text-center text-gray-400 py-4">Maktablar yo'q</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Classes Tab */}
        {activeTab === 'classes' && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Barcha Sinflar</CardTitle>
              <CardDescription className="text-gray-400">
                Jami: {classes.length} ta sinf
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {schools.map(school => {
                  const schoolClasses = classes.filter(c => c.schoolId === school.id)
                  const isExpanded = expandedSchools.includes(school.id)
                  
                  return (
                    <div key={school.id} className="border border-white/10 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSchoolExpand(school.id)}
                        className="w-full p-3 bg-white/5 flex items-center justify-between text-left hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="font-medium text-white">{school.name}</span>
                        </div>
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                          {schoolClasses.length} sinf
                        </Badge>
                      </button>
                      
                      {isExpanded && schoolClasses.length > 0 && (
                        <div className="p-3 pt-0 space-y-2">
                          {schoolClasses.map(cls => (
                            <div
                              key={cls.id}
                              className="p-2 bg-white/5 rounded flex items-center justify-between"
                            >
                              <span className="text-white">{cls.name}</span>
                              <div className="flex gap-2">
                                <Badge variant="secondary" className="bg-amber-500/20 text-amber-300">
                                  {cls._count?.students || 0} o'quvchi
                                </Badge>
                                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                                  {cls.classTeachers?.length || 0} o'qituvchi
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
