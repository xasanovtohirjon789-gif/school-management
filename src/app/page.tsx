'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { LoginForm } from '@/components/school/LoginForm'
import { AdminPanel } from '@/components/school/AdminPanel'
import { DirectorPanel } from '@/components/school/DirectorPanel'
import { TeacherPanel } from '@/components/school/TeacherPanel'

export default function SchoolManagementPage() {
  const [hydrated, setHydrated] = useState(false)
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    setHydrated(true)
  }, [])

  // Show loading until hydrated to prevent hydration mismatch
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
  if (!isAuthenticated) {
    return <LoginForm />
  }

  // Show appropriate panel based on role
  switch (user?.role) {
    case 'admin':
      return <AdminPanel />
    case 'director':
      return <DirectorPanel />
    case 'teacher':
      return <TeacherPanel />
    default:
      return <LoginForm />
  }
}
