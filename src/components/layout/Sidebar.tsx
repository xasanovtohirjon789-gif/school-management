'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  LayoutDashboard, 
  FilePlus, 
  Files, 
  User, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'

const sidebarItems = [
  {
    title: 'Boshqaruv paneli',
    view: 'dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Test yaratish',
    view: 'create',
    icon: FilePlus,
  },
  {
    title: 'Testlarim',
    view: 'tests',
    icon: Files,
  },
  {
    title: 'Profil',
    view: 'profile',
    icon: User,
  },
  {
    title: 'Sozlamalar',
    view: 'settings',
    icon: Settings,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const searchParams = useSearchParams()
  const currentView = searchParams.get('view') || 'dashboard'
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={cn(
      'relative flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300',
      collapsed ? 'w-16' : 'w-64',
      className
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              T
            </div>
            <span className="font-bold text-lg">TestAI</span>
          </Link>
        )}
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm mx-auto">
            T
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn('h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent', collapsed && 'absolute -right-3 bg-sidebar border border-sidebar-border rounded-full shadow-lg')}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="flex flex-col gap-1 px-2">
          {sidebarItems.map((item) => {
            const isActive = currentView === item.view
            return (
              <Link
                key={item.view}
                href={`/?view=${item.view}`}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  isActive && 'bg-sidebar-accent text-sidebar-accent-foreground',
                  collapsed && 'justify-center px-2'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            collapsed && 'justify-center px-2'
          )}
          asChild
        >
          <Link href="/">
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Chiqish</span>}
          </Link>
        </Button>
      </div>
    </div>
  )
}
