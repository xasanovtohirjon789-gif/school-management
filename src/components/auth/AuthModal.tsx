'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultView?: 'login' | 'register'
}

export function AuthModal({ isOpen, onClose, defaultView = 'login' }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'register'>(defaultView)

  useEffect(() => {
    setView(defaultView)
  }, [defaultView])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-0 bg-transparent border-0 shadow-none">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute -top-2 -right-2 z-10 h-8 w-8 rounded-full bg-muted hover:bg-muted/80"
          >
            <X className="h-4 w-4" />
          </Button>
          {view === 'login' ? (
            <LoginForm onSwitchToRegister={() => setView('register')} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setView('login')} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
