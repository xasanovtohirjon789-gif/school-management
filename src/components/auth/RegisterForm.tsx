'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Eye, EyeOff, Mail, Lock, User, Loader2, CheckCircle } from 'lucide-react'

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const passwordRequirements = [
    { label: 'Kamida 8 ta belgi', met: password.length >= 8 },
    { label: 'Katta harf', met: /[A-Z]/.test(password) },
    { label: 'Kichik harf', met: /[a-z]/.test(password) },
    { label: 'Raqam', met: /[0-9]/.test(password) },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) return
    setIsLoading(true)
    // Simulate registration
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = '/?view=dashboard'
    }, 1500)
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-card border-border shadow-lg shadow-primary/5">
      <CardHeader className="space-y-1 text-center pb-4">
        <CardTitle className="text-2xl font-bold text-foreground">
          Ro'yxatdan o'tish
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Yangi hisob yarating va boshlang
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Ism
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Ismingiz"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 h-12 rounded-xl border-border focus:border-primary focus:ring-primary/20"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 rounded-xl border-border focus:border-primary focus:ring-primary/20"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Parol
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-12 rounded-xl border-border focus:border-primary focus:ring-primary/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {/* Password requirements */}
            {password && (
              <div className="grid grid-cols-2 gap-1 mt-2">
                {passwordRequirements.map((req, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-1 text-xs ${
                      req.met ? 'text-secondary' : 'text-muted-foreground'
                    }`}
                  >
                    <CheckCircle className="h-3 w-3" />
                    {req.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              Parolni tasdiqlash
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 h-12 rounded-xl border-border focus:border-primary focus:ring-primary/20"
                required
              />
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-destructive">Parollar mos kelmaydi</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-12 rounded-xl text-base font-medium"
            disabled={isLoading || password !== confirmPassword}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ro'yxatdan o'tilmoqda...
              </>
            ) : (
              'Ro\'yxatdan o\'tish'
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">yoki</span>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center text-sm text-muted-foreground">
          Allaqachon hisobingiz bormi?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-primary font-medium hover:underline"
          >
            Tizimga kiring
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
