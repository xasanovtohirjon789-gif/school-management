'use client'

import { motion } from 'framer-motion'
import { Briefcase, Calendar, MapPin, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface Experience {
  id: string
  title: string
  company: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'freelance'
  startDate: string
  endDate: string | null
  description: string
  technologies: string[]
  url?: string
}

interface ExperienceSectionProps {
  experiences?: Experience[]
}

const defaultExperiences: Experience[] = [
  {
    id: '1',
    title: 'Full Stack Developer',
    company: 'Tech Company',
    location: 'Toshkent, O\'zbekiston',
    type: 'full-time',
    startDate: '2023-01',
    endDate: null,
    description: 'Zamonaviy veb ilovalar yaratish, REST API lar ishlab chiqish, va jamoa bilan ishlash.',
    technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker'],
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'Startup',
    location: 'Toshkent, O\'zbekiston',
    type: 'full-time',
    startDate: '2022-01',
    endDate: '2022-12',
    description: 'Mijozlar uchun interaktiv va responsiv veb sahifalar yaratish.',
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    id: '3',
    title: 'Junior Developer',
    company: 'IT Company',
    location: 'Toshkent, O\'zbekiston',
    type: 'full-time',
    startDate: '2021-01',
    endDate: '2021-12',
    description: 'Dasturlash asoslarini o\'rganish va amaliy loyihalarda ishtirok etish.',
    technologies: ['JavaScript', 'HTML', 'CSS', 'Git'],
  },
]

const typeLabels: Record<Experience['type'], string> = {
  'full-time': 'To\'liq stavka',
  'part-time': 'Yarim stavka',
  'contract': 'Shartnoma',
  'freelance': 'Freelance',
}

const typeColors: Record<Experience['type'], string> = {
  'full-time': 'bg-green-500/10 text-green-600 border-green-500/20',
  'part-time': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'contract': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  'freelance': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long' })
}

export function ExperienceSection({ experiences = defaultExperiences }: ExperienceSectionProps) {
  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ish Tajribasi
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional faoliyatim va ish tajribam
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 pb-8 last:pb-0"
            >
              {/* Timeline line */}
              {index !== experiences.length - 1 && (
                <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-border" />
              )}
              
              {/* Timeline dot */}
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                <Briefcase className="w-3 h-3 text-primary" />
              </div>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-xl font-bold">{exp.title}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="font-medium text-foreground">{exp.company}</span>
                        {exp.url && (
                          <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                            <a href={exp.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                    <Badge className={typeColors[exp.type]}>
                      {typeLabels[exp.type]}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Hozirgacha'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">
                    {exp.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
