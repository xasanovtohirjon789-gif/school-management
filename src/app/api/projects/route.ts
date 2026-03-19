import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all projects
export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(projects.map(p => ({
      ...p,
      technologies: p.technologies.split(',').map(t => t.trim())
    })))
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Proektlarni olishda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const project = await db.project.create({
      data: {
        title: body.title,
        description: body.description,
        image: body.image || null,
        category: body.category,
        technologies: Array.isArray(body.technologies) 
          ? body.technologies.join(',') 
          : body.technologies,
        liveUrl: body.liveUrl || null,
        githubUrl: body.githubUrl || null,
        featured: body.featured || false
      }
    })
    
    return NextResponse.json({
      ...project,
      technologies: project.technologies.split(',').map(t => t.trim())
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Proekt yaratishda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}
