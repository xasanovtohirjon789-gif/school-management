import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'admin' | 'director' | 'teacher'

export interface User {
  id: string
  login: string
  name: string
  role: UserRole
}

export interface DirectorInfo {
  schoolId: string
  schoolName: string
}

export interface TeacherInfo {
  subject: string
  classes: { id: string; name: string }[]
}

interface AuthState {
  user: User | null
  directorInfo: DirectorInfo | null
  teacherInfo: TeacherInfo | null
  isAuthenticated: boolean
  
  login: (user: User, directorInfo?: DirectorInfo, teacherInfo?: TeacherInfo) => void
  logout: () => void
  updateTeacherInfo: (info: TeacherInfo) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      directorInfo: null,
      teacherInfo: null,
      isAuthenticated: false,
      
      login: (user, directorInfo, teacherInfo) => set({
        user,
        directorInfo: directorInfo || null,
        teacherInfo: teacherInfo || null,
        isAuthenticated: true,
      }),
      
      logout: () => set({
        user: null,
        directorInfo: null,
        teacherInfo: null,
        isAuthenticated: false,
      }),
      
      updateTeacherInfo: (info) => set({
        teacherInfo: info,
      }),
    }),
    {
      name: 'school-auth-storage',
    }
  )
)
