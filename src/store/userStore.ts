import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserSettings {
  emailNotifications: boolean
  testResults: boolean
  marketingEmails: boolean
  darkMode: boolean
  compactView: boolean
  language: 'uz' | 'ru' | 'en'
}

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  avatar: string | null
}

interface UserStore {
  profile: UserProfile
  settings: UserSettings
  
  // Profile actions
  updateProfile: (profile: Partial<UserProfile>) => void
  
  // Settings actions
  updateSettings: (settings: Partial<UserSettings>) => void
  toggleSetting: (key: keyof UserSettings) => void
}

const defaultProfile: UserProfile = {
  firstName: 'TestAI',
  lastName: 'Foydalanuvchi',
  email: 'test@example.com',
  avatar: null,
}

const defaultSettings: UserSettings = {
  emailNotifications: true,
  testResults: true,
  marketingEmails: false,
  darkMode: false,
  compactView: false,
  language: 'uz',
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      settings: defaultSettings,
      
      updateProfile: (profileData) => {
        set((state) => ({
          profile: { ...state.profile, ...profileData }
        }))
      },
      
      updateSettings: (settingsData) => {
        set((state) => ({
          settings: { ...state.settings, ...settingsData }
        }))
      },
      
      toggleSetting: (key) => {
        set((state) => ({
          settings: { ...state.settings, [key]: !state.settings[key] }
        }))
      },
    }),
    {
      name: 'testai-user-storage',
    }
  )
)
