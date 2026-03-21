import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all schools
export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      include: {
        _count: {
          select: { classes: true, directors: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(schools)
  } catch (error) {
    console.error('Get schools error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// POST create school
export async function POST(request: NextRequest) {
  try {
    const { name, address } = await request.json()
    
    if (!name) {
      return NextResponse.json({ error: 'Maktab nomi kiritilishi shart' }, { status: 400 })
    }
    
    const school = await prisma.school.create({
      data: { name, address: address || null }
    })
    
    return NextResponse.json(school)
  } catch (error) {
    console.error('Create school error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
