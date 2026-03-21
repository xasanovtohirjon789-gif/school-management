'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useTestStore } from '@/store/testStore'
import { useUserStore } from '@/store/userStore'
import { 
  User, 
  Mail, 
  Camera,
  Save,
  Award,
  FileText,
  TrendingUp,
  Target,
  Clock,
  Loader2
} from 'lucide-react'

export function ProfileContent() {
  const { toast } = useToast()
  const { tests, attempts } = useTestStore()
  const { profile, updateProfile } = useUserStore()
  
  // Local state for form
  const [firstName, setFirstName] = useState(profile.firstName)
  const [lastName, setLastName] = useState(profile.lastName)
  const [email, setEmail] = useState(profile.email)
  const [isSaving, setIsSaving] = useState(false)
  
  // Calculate stats from store
  const totalTests = tests.length
  const activeTests = tests.filter(t => t.status === 'active').length
  const totalAttempts = attempts.length
  const avgScore = attempts.length > 0 
    ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
    : 0
  const totalTimeSpent = attempts.reduce((sum, a) => sum + Math.ceil(a.timeSpent / 60), 0)

  // Calculate level based on tests created and attempts
  const getLevel = () => {
    const points = totalTests * 10 + totalAttempts * 5 + Math.floor(totalTimeSpent / 30)
    if (points >= 500) return { level: 'Ekspert', color: 'text-secondary', bg: 'bg-secondary/10' }
    if (points >= 200) return { level: 'Pro', color: 'text-primary', bg: 'bg-primary/10' }
    if (points >= 50) return { level: 'O\'rtacha', color: 'text-yellow-500', bg: 'bg-yellow-500/10' }
    return { level: 'Boshlang\'ich', color: 'text-muted-foreground', bg: 'bg-muted' }
  }
  const levelInfo = getLevel()

  // Get achievements
  const getAchievements = () => {
    const achievements = []
    if (totalTests >= 1) achievements.push({ emoji: '🏆', text: 'Birinchi test', unlocked: true })
    if (totalTests >= 10) achievements.push({ emoji: '⭐', text: '10 ta test', unlocked: true })
    if (totalTests >= 50) achievements.push({ emoji: '🏅', text: '50 ta test', unlocked: true })
    if (avgScore >= 90) achievements.push({ emoji: '🎯', text: '90% o\'rtacha', unlocked: true })
    if (totalAttempts >= 7) achievements.push({ emoji: '🔥', text: '7 kun ketma-ket', unlocked: true })
    if (totalTimeSpent >= 60) achievements.push({ emoji: '⏰', text: '1 soat vaqt', unlocked: true })
    
    // Locked achievements
    if (totalTests < 100) achievements.push({ emoji: '💎', text: '100 ta test', unlocked: false })
    if (avgScore < 95) achievements.push({ emoji: '👑', text: '95% o\'rtacha', unlocked: false })
    
    return achievements
  }

  const achievements = getAchievements()

  // Sync local state with store on mount
  useEffect(() => {
    setFirstName(profile.firstName)
    setLastName(profile.lastName)
    setEmail(profile.email)
  }, [profile])

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update store
      updateProfile({
        firstName,
        lastName,
        email,
      })
      
      toast({
        title: 'Saqlandi! ✅',
        description: 'Ma\'lumotlaringiz muvaffaqiyatli saqlandi',
      })
    } catch (error) {
      toast({
        title: 'Xatolik',
        description: 'Ma\'lumotlarni saqlashda xatolik yuz berdi',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Profil
        </h1>
        <p className="text-muted-foreground mt-1">
          Hisob ma'lumotlaringizni boshqaring
        </p>
      </div>

      {/* Profile Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Profil ma'lumotlari</CardTitle>
          <CardDescription>O'z ma'lumotlaringizni yangilang</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar || undefined} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {firstName?.[0]?.toUpperCase() || 'T'}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="icon" 
                variant="secondary" 
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                onClick={() => {
                  toast({
                    title: 'Tez orada',
                    description: 'Avatar o\'zgartirish funksiyasi tez orada qo\'shiladi',
                  })
                }}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{firstName} {lastName}</h3>
              <p className="text-sm text-muted-foreground">{email}</p>
              <Badge className={`mt-2 ${levelInfo.bg} ${levelInfo.color} border-0`}>
                {levelInfo.level}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">Ism</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="firstName"
                  placeholder="Ismingiz"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="pl-10 h-11 rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Familiya</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="lastName"
                  placeholder="Familiyangiz"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="pl-10 h-11 rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="gap-2" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saqlanmoqda...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Saqlash
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Statistika</CardTitle>
          <CardDescription>Faoliyat natijalari</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <FileText className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{totalTests}</p>
              <p className="text-xs text-muted-foreground">Testlar</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <TrendingUp className="h-6 w-6 text-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{avgScore}%</p>
              <p className="text-xs text-muted-foreground">O'rtacha ball</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <Target className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{totalAttempts}</p>
              <p className="text-xs text-muted-foreground">Urinishlar</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <Clock className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{totalTimeSpent}</p>
              <p className="text-xs text-muted-foreground">Daqiqa</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Yutuqlar</CardTitle>
          <CardDescription>Qo'lga kiritilgan mukofotlar</CardDescription>
        </CardHeader>
        <CardContent>
          {achievements.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {achievements.map((achievement, index) => (
                <Badge
                  key={index}
                  variant={achievement.unlocked ? 'secondary' : 'outline'}
                  className={`px-4 py-2 text-sm gap-2 ${!achievement.unlocked && 'text-muted-foreground'}`}
                >
                  {achievement.emoji} {achievement.text}
                  {!achievement.unlocked && ' (yo\'q)'}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Hali yutuqlar yo'q</p>
              <Button className="mt-4" asChild>
                <a href="/?view=create">Test yaratish</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Chart Placeholder */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Faoliyat</CardTitle>
          <CardDescription>So'nggi 7 kun</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2 h-32">
            {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary/40"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-muted-foreground">
                  {['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'][i]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
