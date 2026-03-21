import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all directors
export async function GET() {
  try {
    const directors = await prisma.director.findMany({
      include: {
        user: true,
        school: true,
        _count: {
          select: { teachers: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(directors)
  } catch (error) {
    console.error('Get directors error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// POST create director
export async function POST(request: NextRequest) {
  try {
    const { name, login, password, schoolId } = await request.json()
    
    if (!name || !login || !password || !schoolId) {
      return NextResponse.json({ error: 'Barcha maydonlar kiritilishi shart' }, { status: 400 })
    }
    
    // Check if login exists
    const existingUser = await prisma.user.findUnique({
      where: { login }
    })
    
    if (existingUser) {
      return NextResponse.json({ error: 'Bunday login allaqachon mavjud' }, { status: 400 })
    }
    
    // Create user and director in transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          login,
          password,
          name,
          role: 'director'
        }
      })
      
      const director = await tx.director.create({
        data: {
          userId: user.id,
          schoolId
        },
        include: {
          user: true,
          school: true
        }
      })
      
      return director
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Create director error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
