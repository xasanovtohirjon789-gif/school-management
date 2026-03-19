'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, Eye, EyeOff, AlertCircle } from 'lucide-react'

// Initialize storage with default admin
const initStorage = () => {
  if (typeof window === 'undefined') return
  
  const users = localStorage.getItem('school-users')
  if (!users) {
    localStorage.setItem('school-users', JSON.stringify([
      { id: 'admin', login: 'ToHa_012', password: 'tox1c___', name: 'Bosh Admin', role: 'admin' }
    ]))
  }
  
  if (!localStorage.getItem('school-schools')) {
    localStorage.setItem('school-schools', JSON.stringify([]))
  }
  if (!localStorage.getItem('school-directors')) {
    localStorage.setItem('school-directors', JSON.stringify([]))
  }
  if (!localStorage.getItem('school-teachers')) {
    localStorage.setItem('school-teachers', JSON.stringify([]))
  }
  if (!localStorage.getItem('school-classes')) {
    localStorage.setItem('school-classes', JSON.stringify([]))
  }
  if (!localStorage.getItem('school-students')) {
    localStorage.setItem('school-students', JSON.stringify([]))
  }
  if (!localStorage.getItem('school-coins')) {
    localStorage.setItem('school-coins', JSON.stringify([]))
  }
}

interface LoginFormProps {
  onLogin: (user: any, directorInfo?: any, teacherInfo?: any) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [loginValue, setLoginValue] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      initStorage()
      
      const usersData = localStorage.getItem('school-users')
      const users = usersData ? JSON.parse(usersData) : []
      
      const foundUser = users.find((u: any) => u.login === loginValue && u.password === password)
      
      if (!foundUser) {
        setError('Login yoki parol noto\'g\'ri')
        setIsLoading(false)
        return
      }
      
      let directorInfo = null
      let teacherInfo = null
      
      if (foundUser.role === 'director') {
        const directors = JSON.parse(localStorage.getItem('school-directors') || '[]')
        const schools = JSON.parse(localStorage.getItem('school-schools') || '[]')
        const director = directors.find((d: any) => d.userId === foundUser.id)
        if (director) {
          const school = schools.find((s: any) => s.id === director.schoolId)
          directorInfo = { schoolId: director.schoolId, schoolName: school?.name || '' }
        }
      }
      
      if (foundUser.role === 'teacher') {
        const teachers = JSON.parse(localStorage.getItem('school-teachers') || '[]')
        const classes = JSON.parse(localStorage.getItem('school-classes') || '[]')
        const teacher = teachers.find((t: any) => t.userId === foundUser.id)
        if (teacher) {
          const teacherClasses = classes.filter((c: any) => 
            c.teacherIds && c.teacherIds.includes(teacher.id)
          )
          teacherInfo = {
            subject: teacher.subject,
            classes: teacherClasses.map((c: any) => ({ id: c.id, name: c.name }))
          }
        }
      }
      
      onLogin({
        id: foundUser.id,
        login: foundUser.login,
        name: foundUser.name,
        role: foundUser.role
      }, directorInfo, teacherInfo)
      
    } catch (err) {
      setError('Xatolik yuz berdi')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/10 backdrop-blur-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Maktab Boshqaruvi
          </CardTitle>
          <CardDescription className="text-gray-300">
            Tizimga kirish uchun login va parolni kiriting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Login</label>
              <Input
                type="text"
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
                placeholder="Loginingizni kiriting"
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-emerald-400"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Parol</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parolni kiriting"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-emerald-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-2 rounded-lg shadow-lg transition-all"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Kiritilmoqda...
                </div>
              ) : (
                'Kirish'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
