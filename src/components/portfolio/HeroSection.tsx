'use client'

import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Twitter, Mail, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { usePortfolioStore } from '@/store/portfolioStore'

export function HeroSection() {
  const { profile } = usePortfolioStore()
  
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }
  
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      {/* Animated circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <Avatar className="w-32 h-32 mx-auto border-4 border-primary/20 shadow-2xl">
              <AvatarImage src={profile?.avatar || ''} alt={profile?.name || 'Avatar'} />
              <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                {profile?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              {profile?.name || 'Ismingiz'}
            </span>
          </motion.h1>

          {/* Title */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-4"
          >
            {profile?.title || 'Kasbingiz'}
          </motion.p>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground max-w-2xl mx-auto mb-8 text-lg"
          >
            {profile?.bio || 'O\'zingiz haqingizda qisqacha ma\'lumot'}
          </motion.p>

          {/* Location & Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-8 text-sm text-muted-foreground"
          >
            {profile?.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile?.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>{profile.email}</span>
              </div>
            )}
            {profile?.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>{profile.phone}</span>
              </div>
            )}
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            {profile?.github && (
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                asChild
              >
                <a href={profile.github} target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5" />
                </a>
              </Button>
            )}
            {profile?.linkedin && (
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                asChild
              >
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-5 h-5" />
                </a>
              </Button>
            )}
            {profile?.twitter && (
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                asChild
              >
                <a href={profile.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-5 h-5" />
                </a>
              </Button>
            )}
            {profile?.telegram && (
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                asChild
              >
                <a href={`https://t.me/${profile.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
              </Button>
            )}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Button size="lg" onClick={scrollToProjects}>
              Proektlarni ko'rish
            </Button>
            <Button size="lg" variant="outline" onClick={scrollToContact}>
              Bog'lanish
            </Button>
            {profile?.resumeUrl && (
              <Button size="lg" variant="secondary" asChild>
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  Resume yuklab olish
                </a>
              </Button>
            )}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="cursor-pointer"
            onClick={scrollToProjects}
          >
            <ArrowDown className="w-6 h-6 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
