'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Sparkles, 
  Zap, 
  BarChart3, 
  Shield, 
  Clock, 
  Users,
  FileText,
  Brain
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI Test Yaratish',
    description: 'Sun\'iy intellekt yordamida avtomatik test savollari yarating. Faqat mavzuni kiriting, qolganini AI bajaradi.',
  },
  {
    icon: Zap,
    title: 'Tezkor Jarayon',
    description: 'Bir necha daqiqada to\'liq test yarating. Oddiy va tushunarli interfeys orqali tez ishlang.',
  },
  {
    icon: BarChart3,
    title: 'Batafsil Tahlil',
    description: 'Natijalarni chuqur tahlil qiling. Grafiklar va statistikalar orqali o\'z ustingizda ishlang.',
  },
  {
    icon: Shield,
    title: 'Xavfsiz Tizim',
    description: 'Ma\'lumotlaringiz xavfsiz saqlanadi. Zamonaviy xavfsizlik standartlariga mos.',
  },
  {
    icon: Clock,
    title: 'Vaqt Tejash',
    description: 'Avtomatik baholash tizimi vaqt va kuchingizni tejaydi. Natijalar bir zumda.',
  },
  {
    icon: Users,
    title: 'Jamoa Ishi',
    description: 'Testlarni jamoa bilan baham ko\'ring. Hamkorlik qiling va birga rivojlaning.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-sm font-medium text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Xususiyatlar</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nima uchun TestAI?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Zamonaviy ta\'lim texnologiyalari bilan testlarni boshqarish oson va qiziqarli
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group bg-card border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
