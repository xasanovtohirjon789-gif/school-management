import { create } from 'zustand'

export interface Project {
  id: string
  title: string
  description: string
  image: string | null
  category: string
  technologies: string[]
  liveUrl: string | null
  githubUrl: string | null
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface Skill {
  id: string
  name: string
  level: number
  category: string
  icon: string | null
  order: number
}

export interface Profile {
  id: string
  name: string
  title: string
  bio: string
  avatar: string | null
  email: string | null
  phone: string | null
  location: string | null
  website: string | null
  github: string | null
  linkedin: string | null
  twitter: string | null
  telegram: string | null
  resumeUrl: string | null
}

type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc'

interface PortfolioState {
  // Projects
  projects: Project[]
  filteredProjects: Project[]
  selectedCategory: string
  sortOption: SortOption
  searchQuery: string
  
  // Skills
  skills: Skill[]
  
  // Profile
  profile: Profile | null
  
  // UI State
  isLoading: boolean
  isAdmin: boolean
  activeSection: string
  
  // Actions
  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  updateProject: (id: string, project: Partial<Project>) => void
  deleteProject: (id: string) => void
  
  setSkills: (skills: Skill[]) => void
  addSkill: (skill: Skill) => void
  updateSkill: (id: string, skill: Partial<Skill>) => void
  deleteSkill: (id: string) => void
  
  setProfile: (profile: Profile | null) => void
  
  setCategory: (category: string) => void
  setSortOption: (option: SortOption) => void
  setSearchQuery: (query: string) => void
  filterAndSortProjects: () => void
  
  setIsAdmin: (isAdmin: boolean) => void
  setActiveSection: (section: string) => void
  setIsLoading: (isLoading: boolean) => void
}

// Demo data
const demoProfile: Profile = {
  id: '1',
  name: 'Tohirjon Xasanov',
  title: 'Full Stack Developer',
  bio: 'Zamonaviy veb ilovalar yaratishga qiziqaman. React, Next.js, Node.js va boshqa texnologiyalarda tajribam bor. O\'zbekistonda yashayman va doim yangi narsalarni o\'rganishga harakat qilaman.',
  avatar: null,
  email: 'example@email.com',
  phone: '+998 90 123 45 67',
  location: 'Toshkent, O\'zbekiston',
  website: null,
  github: 'https://github.com/xasanovtohirjon789-gif',
  linkedin: null,
  twitter: null,
  telegram: '@username',
  resumeUrl: null,
}

const demoProjects: Project[] = [
  {
    id: '1',
    title: 'TestAI Platform',
    description: 'AI yordamida test savollari yaratuvchi zamonaviy ta\'lim platformasi. Sun\'iy intellekt yordamida har qanday mavzu bo\'yicha test savollari yaratish imkoniyati.',
    image: null,
    category: 'Web App',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Zustand', 'AI API'],
    liveUrl: 'https://testai-platform.netlify.app',
    githubUrl: 'https://github.com/xasanovtohirjon789-gif/testai-platform',
    featured: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'E-Commerce Dashboard',
    description: 'Online do\'konlar uchun boshqaruv paneli. Mahsulotlar, buyurtmalar va mijozlarni boshqarish imkoniyati.',
    image: null,
    category: 'Dashboard',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Chart.js'],
    liveUrl: null,
    githubUrl: 'https://github.com/xasanovtohirjon789-gif/ecommerce-dashboard',
    featured: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
  {
    id: '3',
    title: 'Task Manager App',
    description: 'Kundalik vazifalarni boshqarish ilovasi. Vazifalarni qo\'shish, tahrirlash va kategoriyalarga ajratish.',
    image: null,
    category: 'Mobile App',
    technologies: ['React Native', 'Firebase', 'TypeScript'],
    liveUrl: null,
    githubUrl: 'https://github.com/xasanovtohirjon789-gif/task-manager',
    featured: false,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05',
  },
  {
    id: '4',
    title: 'Weather Application',
    description: 'Ob-havo ma\'lumotlarini ko\'rsatuvchi veb ilova. Joylashuv bo\'yicha ob-havo ma\'lumotlarini olish.',
    image: null,
    category: 'Web App',
    technologies: ['Vue.js', 'OpenWeather API', 'Tailwind CSS'],
    liveUrl: null,
    githubUrl: 'https://github.com/xasanovtohirjon789-gif/weather-app',
    featured: false,
    createdAt: '2023-12-20',
    updatedAt: '2023-12-20',
  },
  {
    id: '5',
    title: 'Blog Platform',
    description: 'Foydalanuvchilar o\'z maqolalarini yozib, boshqalar bilan ulashishi mumkin bo\'lgan blog platformasi.',
    image: null,
    category: 'Web App',
    technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'MDX'],
    liveUrl: null,
    githubUrl: 'https://github.com/xasanovtohirjon789-gif/blog-platform',
    featured: false,
    createdAt: '2023-12-15',
    updatedAt: '2023-12-15',
  },
  {
    id: '6',
    title: 'Chat Application',
    description: 'Real-time chat ilovasi. WebSocket yordamida xabar almashinuvchi veb ilova.',
    image: null,
    category: 'Web App',
    technologies: ['React', 'Socket.io', 'Node.js', 'MongoDB'],
    liveUrl: null,
    githubUrl: 'https://github.com/xasanovtohirjon789-gif/chat-app',
    featured: false,
    createdAt: '2023-12-10',
    updatedAt: '2023-12-10',
  },
]

const demoSkills: Skill[] = [
  // Frontend
  { id: '1', name: 'React', level: 90, category: 'frontend', icon: null, order: 1 },
  { id: '2', name: 'Next.js', level: 85, category: 'frontend', icon: null, order: 2 },
  { id: '3', name: 'TypeScript', level: 85, category: 'frontend', icon: null, order: 3 },
  { id: '4', name: 'Tailwind CSS', level: 90, category: 'frontend', icon: null, order: 4 },
  { id: '5', name: 'Vue.js', level: 70, category: 'frontend', icon: null, order: 5 },
  
  // Backend
  { id: '6', name: 'Node.js', level: 80, category: 'backend', icon: null, order: 1 },
  { id: '7', name: 'Express', level: 80, category: 'backend', icon: null, order: 2 },
  { id: '8', name: 'Python', level: 60, category: 'backend', icon: null, order: 3 },
  { id: '9', name: 'REST API', level: 85, category: 'backend', icon: null, order: 4 },
  
  // Database
  { id: '10', name: 'PostgreSQL', level: 75, category: 'database', icon: null, order: 1 },
  { id: '11', name: 'MongoDB', level: 70, category: 'database', icon: null, order: 2 },
  { id: '12', name: 'Prisma', level: 80, category: 'database', icon: null, order: 3 },
  
  // Tools
  { id: '13', name: 'Git', level: 85, category: 'tools', icon: null, order: 1 },
  { id: '14', name: 'Docker', level: 60, category: 'tools', icon: null, order: 2 },
  { id: '15', name: 'Figma', level: 65, category: 'tools', icon: null, order: 3 },
  { id: '16', name: 'Linux', level: 70, category: 'tools', icon: null, order: 4 },
]

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  // Initial state with demo data
  projects: demoProjects,
  filteredProjects: demoProjects,
  selectedCategory: 'all',
  sortOption: 'newest',
  searchQuery: '',
  skills: demoSkills,
  profile: demoProfile,
  isLoading: false,
  isAdmin: false,
  activeSection: 'home',
  
  // Project actions
  setProjects: (projects) => {
    set({ projects })
    get().filterAndSortProjects()
  },
  
  addProject: (project) => {
    set((state) => ({
      projects: [...state.projects, project]
    }))
    get().filterAndSortProjects()
  },
  
  updateProject: (id, updatedProject) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updatedProject } : p
      )
    }))
    get().filterAndSortProjects()
  },
  
  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id)
    }))
    get().filterAndSortProjects()
  },
  
  // Skill actions
  setSkills: (skills) => set({ skills }),
  
  addSkill: (skill) => {
    set((state) => ({
      skills: [...state.skills, skill]
    }))
  },
  
  updateSkill: (id, updatedSkill) => {
    set((state) => ({
      skills: state.skills.map((s) =>
        s.id === id ? { ...s, ...updatedSkill } : s
      )
    }))
  },
  
  deleteSkill: (id) => {
    set((state) => ({
      skills: state.skills.filter((s) => s.id !== id)
    }))
  },
  
  // Profile actions
  setProfile: (profile) => set({ profile }),
  
  // Filter and sort actions
  setCategory: (category) => {
    set({ selectedCategory: category })
    get().filterAndSortProjects()
  },
  
  setSortOption: (option) => {
    set({ sortOption: option })
    get().filterAndSortProjects()
  },
  
  setSearchQuery: (query) => {
    set({ searchQuery: query })
    get().filterAndSortProjects()
  },
  
  filterAndSortProjects: () => {
    const { projects, selectedCategory, sortOption, searchQuery } = get()
    
    let filtered = [...projects]
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.technologies.some((t) => t.toLowerCase().includes(query))
      )
    }
    
    // Sort
    switch (sortOption) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'name-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'name-desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title))
        break
    }
    
    set({ filteredProjects: filtered })
  },
  
  // UI actions
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  setActiveSection: (section) => set({ activeSection: section }),
  setIsLoading: (isLoading) => set({ isLoading }),
}))
