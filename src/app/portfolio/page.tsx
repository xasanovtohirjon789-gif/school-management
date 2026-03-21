'use client'

import { useEffect } from 'react'
import { PortfolioNav, HeroSection, ProjectsSection, SkillsSection, ContactSection, ExperienceSection, PortfolioFooter } from '@/components/portfolio'
import { usePortfolioStore } from '@/store/portfolioStore'

export default function PortfolioPage() {
  const { setIsLoading } = usePortfolioStore()

  useEffect(() => {
    // Simulate loading
    setIsLoading(false)
  }, [setIsLoading])

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <PortfolioNav />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Projects Section */}
        <ProjectsSection />

        {/* Skills Section */}
        <SkillsSection />

        {/* Experience Section */}
        <ExperienceSection />

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <PortfolioFooter />
    </div>
  )
}
