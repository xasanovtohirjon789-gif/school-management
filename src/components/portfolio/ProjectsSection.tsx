'use client'

import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, Grid3X3, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProjectCard } from './ProjectCard'
import { usePortfolioStore } from '@/store/portfolioStore'
import { useState } from 'react'

export function ProjectsSection() {
  const {
    projects,
    filteredProjects,
    selectedCategory,
    sortOption,
    searchQuery,
    setCategory,
    setSortOption,
    setSearchQuery
  } = usePortfolioStore()
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Get unique categories
  const categories = ['all', ...new Set(projects.map(p => p.category))]

  const sortOptions = [
    { value: 'newest', label: 'Eng yangi' },
    { value: 'oldest', label: 'Eng eski' },
    { value: 'name-asc', label: 'A-Z' },
    { value: 'name-desc', label: 'Z-A' },
  ]

  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Proektlarim
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Men yaratgan loyihalar va ishlar ro'yxati. Har bir proekt haqida batafsil ma'lumot olish uchun ustiga bosing.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Proektlarni qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className="cursor-pointer capitalize"
                onClick={() => setCategory(category)}
              >
                {category === 'all' ? 'Barchasi' : category}
              </Badge>
            ))}
          </div>

          {/* Sort */}
          <Select value={sortOption} onValueChange={(value: any) => setSortOption(value)}>
            <SelectTrigger className="w-[160px]">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View mode */}
          <div className="flex gap-1 border rounded-lg p-1">
            <Button
              size="icon"
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Projects grid */}
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">
              Proektlar topilmadi. Boshqa filtr parametrlarini sinab ko'ring.
            </p>
          </motion.div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'flex flex-col gap-4'
          }>
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center text-muted-foreground"
        >
          Jami {projects.length} ta proekt
          {selectedCategory !== 'all' && ` • ${selectedCategory} kategoriyasida`}
          {searchQuery && ` • "${searchQuery}" bo'yicha qidiruv`}
        </motion.div>
      </div>
    </section>
  )
}
