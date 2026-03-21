'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { useUserStore } from '@/store/userStore'
import { 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Save,
  Loader2
} from 'lucide-react'

export function SettingsContent() {
  const { toast } = useToast()
  const { settings, updateSettings, toggleSetting } = useUserStore()
  
  // Local state for settings
  const [localSettings, setLocalSettings] = useState(settings)
  const [isSaving, setIsSaving] = useState(false)
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
  })
  
  // Sync local state with store on mount
  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update store
      updateSettings(localSettings)
      
      toast({
        title: 'Saqlandi! ✅',
        description: 'Sozlamalar muvaffaqiyatli saqlandi',
      })
    } catch (error) {
      toast({
        title: 'Xatolik',
        description: 'Sozlamalarni saqlashda xatolik yuz berdi',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordUpdate = async () => {
    if (!passwords.current || !passwords.new) {
      toast({
        title: 'Maydonlar to\'liq emas',
        description: 'Iltimos, barcha maydonlarni to\'ldiring',
        variant: 'destructive',
      })
      return
    }
    
    if (passwords.new.length < 8) {
      toast({
        title: 'Parol juda qisqa',
        description: 'Yangi parol kamida 8 ta belgidan iborat bo\'lishi kerak',
        variant: 'destructive',
      })
      return
    }
    
    setIsSaving(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Clear password fields
      setPasswords({ current: '', new: '' })
      
      toast({
        title: 'Parol yangilandi! ✅',
        description: 'Parolingiz muvaffaqiyatli o\'zgartirildi',
      })
    } catch (error) {
      toast({
        title: 'Xatolik',
        description: 'Parolni yangilashda xatolik yuz berdi',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggle = (key: keyof typeof localSettings) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Sozlamalar
        </h1>
        <p className="text-muted-foreground mt-1">
          Ilova sozlamalarini boshqaring
        </p>
      </div>

      {/* Notifications */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">Bildirishnomalar</CardTitle>
          </div>
          <CardDescription>Bildirishnomalarni boshqaring</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Email bildirishnomalari</p>
              <p className="text-sm text-muted-foreground">Muhim yangiliklarni emailingizga oling</p>
            </div>
            <Switch 
              checked={localSettings.emailNotifications}
              onCheckedChange={() => handleToggle('emailNotifications')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Test natijalari</p>
              <p className="text-sm text-muted-foreground">Test tugagach natijalarni yuboring</p>
            </div>
            <Switch 
              checked={localSettings.testResults}
              onCheckedChange={() => handleToggle('testResults')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Marketing xabarlari</p>
              <p className="text-sm text-muted-foreground">Aksiyalar va yangiliklar haqida</p>
            </div>
            <Switch 
              checked={localSettings.marketingEmails}
              onCheckedChange={() => handleToggle('marketingEmails')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">Xavfsizlik</CardTitle>
          </div>
          <CardDescription>Hisob xavfsizligi sozlamalari</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Hozirgi parol</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                value={passwords.current}
                onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Yangi parol</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                value={passwords.new}
                onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                className="h-11 rounded-xl"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={handlePasswordUpdate}
              disabled={isSaving || !passwords.current || !passwords.new}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Yangilanmoqda...
                </>
              ) : (
                'Parolni yangilash'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">Ko'rinish</CardTitle>
          </div>
          <CardDescription>Ilova ko'rinishi sozlamalari</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Qorong'i rejim</p>
              <p className="text-sm text-muted-foreground">Ko'zlarni charchatmaydigan rejim</p>
            </div>
            <Switch 
              checked={localSettings.darkMode}
              onCheckedChange={() => handleToggle('darkMode')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Kompakt ko'rinish</p>
              <p className="text-sm text-muted-foreground">Ko'proq ma'lumot ko'rsatish</p>
            </div>
            <Switch 
              checked={localSettings.compactView}
              onCheckedChange={() => handleToggle('compactView')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">Til</CardTitle>
          </div>
          <CardDescription>Ilova tili sozlamalari</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Interfeys tili</p>
              <p className="text-sm text-muted-foreground">Ilova interfeysi tili</p>
            </div>
            <select 
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
              value={localSettings.language}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, language: e.target.value as 'uz' | 'ru' | 'en' }))}
            >
              <option value="uz">O'zbek</option>
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
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
    </div>
  )
}
