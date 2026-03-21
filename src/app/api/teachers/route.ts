import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET teachers (filter by directorId if provided)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const directorId = searchParams.get('directorId')
    
    const where: any = {}
    if (directorId) {
      where.directorId = directorId
    }
    
    const teachers = await prisma.teacher.findMany({
      where,
      include: {
        user: true,
        director: {
          include: { school: true }
        },
        classTeacher: {
          include: { class: true }
        },
        _count: {
          select: { coinHistory: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    })
    
    return NextResponse.json(teachers)
  } catch (error) {
    console.error('Get teachers error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// POST create teacher
export async function POST(request: NextRequest) {
  try {
    const { name, login, password, directorId, subject } = await request.json()
    
    if (!name || !login || !password || !directorId) {
      return NextResponse.json({ error: 'Barcha maydonlar kiritilishi shart' }, { status: 400 })
    }
    
    // Check if login exists
    const existingUser = await prisma.user.findUnique({
      where: { login }
    })
    
    if (existingUser) {
      return NextResponse.json({ error: 'Bunday login allaqachon mavjud' }, { status: 400 })
    }
    
    // Create user and teacher in transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          login,
          password,
          name,
          role: 'teacher'
        }
      })
      
      const teacher = await tx.teacher.create({
        data: {
          userId: user.id,
          directorId,
          subject: subject || 'Umumiy'
        },
        include: {
          user: true,
          director: {
            include: { school: true }
          }
        }
      })
      
      return teacher
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Create teacher error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
