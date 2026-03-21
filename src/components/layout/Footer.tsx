'use client'

import Link from 'next/link'
import { GraduationCap, Github, Twitter, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                T
              </div>
              <span className="text-xl font-bold text-foreground">TestAI</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              AI orqali testlar platformasi. Testlarni tez va oson yarating, boshqaring va tahlil qiling.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Tezkor havolalar</h3>
            <nav className="flex flex-col gap-2">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Xususiyatlar
              </Link>
              <Link href="#stats" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Statistika
              </Link>
              <Link href="#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Biz haqimizda
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Qo'llab-quvvatlash</h3>
            <nav className="flex flex-col gap-2">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Yordam markazi
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Ko'p so'raladigan savollar
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Aloqa
              </Link>
            </nav>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Ijtimoiy tarmoqlar</h3>
            <div className="flex gap-3">
              <Link 
                href="#" 
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <Github className="h-5 w-5 text-muted-foreground" />
              </Link>
              <Link 
                href="#" 
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <Twitter className="h-5 w-5 text-muted-foreground" />
              </Link>
              <Link 
                href="#" 
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <Linkedin className="h-5 w-5 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} TestAI. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </footer>
  )
}
