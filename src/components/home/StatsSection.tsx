'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, Award, BookOpen, Target } from 'lucide-react'

const stats = [
  {
    icon: TrendingUp,
    value: '98%',
    label: 'O\'rtacha natija',
    description: 'Foydalanuvchilarning o\'rtacha test natijasi',
  },
  {
    icon: Award,
    value: '15K+',
    label: 'Mukofotlar',
    description: 'Top foydalanuvchilarga berilgan mukofotlar',
  },
  {
    icon: BookOpen,
    value: '100+',
    label: 'Fanlar',
    description: 'Turli fanlar bo\'yicha testlar',
  },
  {
    icon: Target,
    value: '1M+',
    label: 'Savollar',
    description: 'Tizimda mavjud savollar soni',
  },
]

export function StatsSection() {
  return (
    <section id="stats" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Natijalar biz bilan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Minglab foydalanuvchilar allaqachon TestAI dan foydalanmoqda
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="bg-gradient-to-br from-card to-muted/30 border-border hover:border-primary/50 transition-all duration-300"
            >
              <CardContent className="p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto mb-4">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
