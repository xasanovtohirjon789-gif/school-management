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
    // Load user from localStorage
    try {
      const stored = localStorage.getItem('school-auth-storage')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.state?.isAuthenticated && parsed.state?.user) {
          setUser(parsed.state.user)
          setDirectorInfo(parsed.state.directorInfo)
          setTeacherInfo(parsed.state.teacherInfo)
        }
      }
    } catch (e) {
      console.error('Failed to load auth state:', e)
    }
  }, [])

  const handleLogin = (userData: any, dirInfo?: any, teachInfo?: any) => {
    setUser(userData)
    setDirectorInfo(dirInfo || null)
    setTeacherInfo(teachInfo || null)
    
    // Save to localStorage
    try {
      localStorage.setItem('school-auth-storage', JSON.stringify({
        state: {
          user: userData,
          directorInfo: dirInfo || null,
          teacherInfo: teachInfo || null,
          isAuthenticated: true
        }
      }))
    } catch (e) {
      console.error('Failed to save auth state:', e)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setDirectorInfo(null)
    setTeacherInfo(null)
    try {
      localStorage.removeItem('school-auth-storage')
    } catch (e) {
      console.error('Failed to clear auth state:', e)
    }
  }

  // Show loading until hydrated
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

  // Not authenticated - show login
  if (!user) {
    return <LoginForm onLogin={handleLogin} />
  }

  // Show appropriate panel based on role
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
