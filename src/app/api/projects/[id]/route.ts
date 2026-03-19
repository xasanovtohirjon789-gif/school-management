import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const project = await db.project.findUnique({
      where: { id }
    })
    
    if (!project) {
      return NextResponse.json(
        { error: 'Proekt topilmadi' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      ...project,
      technologies: project.technologies.split(',').map(t => t.trim())
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Proektni olishda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}

// PUT update project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const project = await db.project.update({
      where: { id },
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
        featured: body.featured
      }
    })
    
    return NextResponse.json({
      ...project,
      technologies: project.technologies.split(',').map(t => t.trim())
    })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Proektni yangilashda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}

// DELETE project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.project.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Proektni o\'chirishda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}
