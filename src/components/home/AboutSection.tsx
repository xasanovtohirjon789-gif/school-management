'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const benefits = [
  'Bepul ro\'yxatdan o\'ting',
  'Cheksiz test yarating',
  'AI yordamida savollar',
  'Batafsil tahlil',
  'Mobil qurilmalarda ishlaydi',
  '24/7 qo\'llab-quvvatlash',
]

export function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ta\'limning kelajagi bugun boshlanadi
            </h2>
            <p className="text-lg text-muted-foreground">
              TestAI - bu zamonaviy ta\'lim texnologiyalari asosida yaratilgan platforma. 
              Biz ta'lim sifatini oshirish va o'qituvchilarga yordam berish uchun sun'iy intellekt 
              imkoniyatlaridan foydalanamiz.
            </p>
            <p className="text-muted-foreground">
              Platformamiz orqali siz har qanday fan bo'yicha testlarni tez va oson yarata olasiz. 
              AI yordamida avtomatik savol generatsiyasi, natijalarni tahlil qilish va boshqa ko'p 
              imkoniyatlar sizni kutmoqda.
            </p>

            {/* Benefits List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary shrink-0" />
                  <span className="text-sm text-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            <Button size="lg" asChild className="gap-2 px-8 h-12 text-base rounded-xl mt-4">
              <Link href="/?auth=register">
                Hoziroq boshlang
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
            <Card className="relative bg-card border-border shadow-xl">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Mock Dashboard Preview */}
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl">📊</span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Boshqaruv</div>
                      <div className="text-sm text-muted-foreground">Boshqaruv paneli</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted rounded-xl p-4">
                      <div className="text-2xl font-bold text-foreground">127</div>
                      <div className="text-xs text-muted-foreground">Testlar</div>
                    </div>
                    <div className="bg-muted rounded-xl p-4">
                      <div className="text-2xl font-bold text-foreground">89%</div>
                      <div className="text-xs text-muted-foreground">O'rtacha ball</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-secondary rounded-full" />
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-3/5 bg-primary rounded-full" />
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-accent rounded-full" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
