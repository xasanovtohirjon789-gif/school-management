'use client'

import { useState, useEffect } from 'react'
import { LoginForm } from '@/components/school/LoginForm'
import { AdminPanel } from '@/components/school/AdminPanel'
import { DirectorPanel } from '@/components/school/DirectorPanel'
import { TeacherPanel } from '@/components/school/TeacherPanel'

export default function SchoolManagementPage() {
  const [hydrated, setHydrated] = useState(false)
  const [user, setUser] = useState<{id: string; login: string; name: string; role: 'admin' | 'director' | 'teacher'} | null>(null)
  const [directorInfo, setDirectorInfo] = useState<{schoolId: string; schoolName: string} | null>(null)
  const [teacherInfo, setTeacherInfo] = useState<{subject: string; classes: {id: string; name: string}[]} | null>(null)

  useEffect(() => {
    setHydrated(true)
    try {
      const stored = localStorage.getItem('school-auth')
      if (stored) {
        const data = JSON.parse(stored)
        setUser(data.user)
        setDirectorInfo(data.directorInfo)
        setTeacherInfo(data.teacherInfo)
      }
    } catch (e) {
      console.error('Load error:', e)
    }
  }, [])

  const handleLogin = (userData: any, dirInfo?: any, teachInfo?: any) => {
    setUser(userData)
    setDirectorInfo(dirInfo || null)
    setTeacherInfo(teachInfo || null)
    localStorage.setItem('school-auth', JSON.stringify({
      user: userData,
      directorInfo: dirInfo || null,
      teacherInfo: teachInfo || null
    }))
  }

  const handleLogout = () => {
    setUser(null)
    setDirectorInfo(null)
    setTeacherInfo(null)
    localStorage.removeItem('school-auth')
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          <p className="text-white/60 text-sm">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />
  }

  switch (user.role) {
    case 'admin':
      return <AdminPanel user={user} onLogout={handleLogout} />
    case 'director':
      return <DirectorPanel user={user} directorInfo={directorInfo} onLogout={handleLogout} />
    case 'teacher':
      return <TeacherPanel user={user} teacherInfo={teacherInfo} onLogout={handleLogout} />
    default:
      return <LoginForm onLogin={handleLogin} />
  }
}
