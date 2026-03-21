'use client'

import { motion } from 'framer-motion'
import { Heart, ArrowUp, Github, Linkedin, Twitter, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePortfolioStore } from '@/store/portfolioStore'

export function PortfolioFooter() {
  const { profile } = usePortfolioStore()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const socialLinks = [
    { icon: Github, href: profile?.github, label: 'GitHub' },
    { icon: Linkedin, href: profile?.linkedin, label: 'LinkedIn' },
    { icon: Twitter, href: profile?.twitter, label: 'Twitter' },
    { icon: MessageCircle, href: profile?.telegram ? `https://t.me/${profile.telegram.replace('@', '')}` : undefined, label: 'Telegram' },
  ].filter(link => link.href)

  return (
    <footer className="relative border-t bg-card/50 backdrop-blur-sm">
      {/* Scroll to top button */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="absolute -top-6 left-1/2 -translate-x-1/2"
      >
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-lg bg-background"
          onClick={scrollToTop}
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
      </motion.div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <p className="text-lg font-semibold mb-1">
              {profile?.name || 'Portfolio'}
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Barcha huquqlar himoyalangan
            </p>
          </motion.div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2"
            >
              {socialLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="ghost"
                  size="icon"
                  asChild
                >
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                  >
                    <link.icon className="w-5 h-5" />
                  </a>
                </Button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Made with love */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 pt-8 border-t"
        >
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            sevgi bilan yaratildi
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
