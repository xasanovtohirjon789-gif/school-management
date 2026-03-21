'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  LogOut, 
  Plus, 
  Users, 
  School, 
  UserCog,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface AdminPanelProps {
  user: { id: string; login: string; name: string; role: string }
  onLogout: () => void
}

export function AdminPanel({ user, onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'directors' | 'schools'>('schools')
  const [schools, setSchools] = useState<any[]>([])
  const [directors, setDirectors] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [newSchoolName, setNewSchoolName] = useState('')
  const [newSchoolAddress, setNewSchoolAddress] = useState('')
  const [selectedSchoolId, setSelectedSchoolId] = useState('')
  const [newDirectorLogin, setNewDirectorLogin] = useState('')
  const [newDirectorPassword, setNewDirectorPassword] = useState('')
  const [newDirectorName, setNewDirectorName] = useState('')

  const loadData = async () => {
    try {
      const [schoolsRes, directorsRes] = await Promise.all([
        fetch('/api/schools'),
        fetch('/api/directors')
      ])
      
      const schoolsData = await schoolsRes.json()
      const directorsData = await directorsRes.json()
      
      setSchools(schoolsData)
      setDirectors(directorsData)
      
      if (schoolsData.length > 0 && !selectedSchoolId) {
        setSelectedSchoolId(schoolsData[0].id)
      }
    } catch (e) {
      console.error('Load error:', e)
      setError('Ma\'lumotlarni yuklashda xatolik')
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCreateSchool = async () => {
    if (!newSchoolName.trim()) {
      setError('Maktab nomini kiriting')
      return
    }
    
    setIsLoading(true)
    try {
      const res = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSchoolName, address: newSchoolAddress })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'Xatolik yuz berdi')
      } else {
        setSuccess('Maktab muvaffaqiyatli yaratildi')
        setNewSchoolName('')
        setNewSchoolAddress('')
        loadData()
      }
    } catch (e) {
      setError('Server bilan bog\'lanishda xatolik')
    }
    setIsLoading(false)
  }

  const handleCreateDirector = async () => {
    if (!newDirectorLogin.trim() || !newDirectorPassword.trim() || !newDirectorName.trim() || !selectedSchoolId) {
      setError('Barcha maydonlarni to\'ldiring')
      return
    }
    
    setIsLoading(true)
    try {
      const res = await fetch('/api/directors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newDirectorName,
          login: newDirectorLogin,
          password: newDirectorPassword,
          schoolId: selectedSchoolId
        })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'Xatolik yuz berdi')
      } else {
        setSuccess('Direktor muvaffaqiyatli yaratildi')
        setNewDirectorLogin('')
        setNewDirectorPassword('')
        setNewDirectorName('')
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
            onClick={onLogout}
            className="border-red-500/50 text-red-400 hover:bg-red-500/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Chiqish
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'schools' ? 'default' : 'outline'}
            onClick={() => setActiveTab('schools')}
            className={activeTab === 'schools' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-white/20 text-white'}
          >
            <School className="w-4 h-4 mr-2" />
            Maktablar
          </Button>
          <Button
            variant={activeTab === 'directors' ? 'default' : 'outline'}
            onClick={() => setActiveTab('directors')}
            className={activeTab === 'directors' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-white/20 text-white'}
          >
            <Users className="w-4 h-4 mr-2" />
            Direktorlar
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

        {activeTab === 'schools' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Yangi Maktab Qo&apos;shish
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
                  Maktab Qo&apos;shish
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Maktablar Ro&apos;yxati</CardTitle>
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
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                          {school._count?.classes || 0} sinf
                        </Badge>
                      </div>
                      {school.address && (
                        <p className="text-sm text-gray-400 mt-1">{school.address}</p>
                      )}
                    </div>
                  ))}
                  {schools.length === 0 && (
                    <p className="text-center text-gray-400 py-4">Maktablar yo&apos;q</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'directors' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Yangi Direktor Qo&apos;shish
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  Direktor Qo&apos;shish
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Direktorlar Ro&apos;yxati</CardTitle>
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
                        <p className="font-medium text-white">{director.user?.name}</p>
                        <p className="text-sm text-gray-400">Login: {director.user?.login}</p>
                        <p className="text-sm text-emerald-400">{director.school?.name}</p>
                      </div>
                      <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300">
                        {director._count?.teachers || 0} o&apos;qituvchi
                      </Badge>
                    </div>
                  ))}
                  {directors.length === 0 && (
                    <p className="text-center text-gray-400 py-4">Direktorlar yo&apos;q</p>
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
