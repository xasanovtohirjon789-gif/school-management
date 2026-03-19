'use client'

import { Suspense, useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Navbar, Footer, Sidebar } from '@/components/layout'
import { HeroSection, FeaturesSection, StatsSection, AboutSection } from '@/components/home'
import { AuthModal } from '@/components/auth'
import { DashboardContent, TestsList, ProfileContent, SettingsContent } from '@/components/dashboard'
import { TestCreateForm, TestResults, TestSolve } from '@/components/test'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu, Loader2 } from 'lucide-react'

function PageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const view = searchParams.get('view')
  const auth = searchParams.get('auth')
  
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Check if we're in app view (dashboard, tests, etc.)
  const isAppView = ['dashboard', 'create', 'tests', 'profile', 'settings', 'results', 'solve'].includes(view || '')
  
  // Derive auth state from URL params
  const showAuth = useMemo(() => auth === 'login' || auth === 'register', [auth])
  const authView = useMemo(() => (auth === 'register' ? 'register' : 'login') as 'login' | 'register', [auth])

  // Close auth modal by navigating without auth param
  const closeAuthModal = () => {
    const currentView = searchParams.get('view')
    if (currentView) {
      router.push(`/?view=${currentView}`)
    } else {
      router.push('/')
    }
  }

  // App View (with sidebar)
  if (isAppView) {
    return (
      <div className="min-h-screen bg-background flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background sticky top-0 z-40">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <span className="font-bold text-lg">TestAI</span>
            <div className="w-10" />
          </div>

          {/* Content */}
          <main className="flex-1 overflow-auto">
            {view === 'dashboard' && <DashboardContent />}
            {view === 'create' && <TestCreateForm />}
            {view === 'tests' && <TestsList />}
            {view === 'profile' && <ProfileContent />}
            {view === 'settings' && <SettingsContent />}
            {view === 'results' && <TestResults />}
            {view === 'solve' && <TestSolve />}
          </main>
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuth}
          onClose={closeAuthModal}
          defaultView={authView}
        />
      </div>
    )
  }

  // Landing Page
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <AboutSection />
      </main>

      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuth}
        onClose={closeAuthModal}
        defaultView={authView}
      />
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Yuklanmoqda...</p>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PageContent />
    </Suspense>
  )
}
