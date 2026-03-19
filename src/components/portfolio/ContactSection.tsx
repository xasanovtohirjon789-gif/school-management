'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { usePortfolioStore } from '@/store/portfolioStore'
import { useState } from 'react'

export function ContactSection() {
  const { profile } = usePortfolioStore()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: '', email: '', message: '' })
    
    // Reset success message after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  const contactInfo = [
    { icon: Mail, label: 'Email', value: profile?.email, href: `mailto:${profile?.email}` },
    { icon: Phone, label: 'Telefon', value: profile?.phone, href: `tel:${profile?.phone}` },
    { icon: MapPin, label: 'Manzil', value: profile?.location },
  ]

  const socialLinks = [
    { icon: Github, href: profile?.github, label: 'GitHub' },
    { icon: Linkedin, href: profile?.linkedin, label: 'LinkedIn' },
    { icon: Twitter, href: profile?.twitter, label: 'Twitter' },
    { icon: MessageCircle, href: profile?.telegram ? `https://t.me/${profile.telegram.replace('@', '')}` : undefined, label: 'Telegram' },
  ]

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bog'lanish
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Loyihangiz bo'yicha savollar yoki takliflar bo'lsa, bemalol bog'laning
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 space-y-6">
                {contactInfo.filter(info => info.value).map((info, index) => (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{info.label}</p>
                      {info.href ? (
                        <a 
                          href={info.href} 
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="font-medium">{info.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Social Links */}
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-4">Ijtimoiy tarmoqlar:</p>
                  <div className="flex gap-2">
                    {socialLinks.filter(link => link.href).map((link, index) => (
                      <Button
                        key={link.label}
                        variant="outline"
                        size="icon"
                        asChild
                      >
                        <a 
                          href={link.href} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label={link.label}
                        >
                          <link.icon className="w-4 h-4" />
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Xabar yuborildi!</h3>
                    <p className="text-muted-foreground">
                      Tez orada siz bilan bog'lanamiz
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Ism</label>
                      <Input
                        placeholder="Ismingiz"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Xabar</label>
                      <textarea
                        placeholder="Xabaringiz..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={4}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full gap-2" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1 }}
                          >
                            <Send className="w-4 h-4" />
                          </motion.div>
                          Yuborilmoqda...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Yuborish
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
