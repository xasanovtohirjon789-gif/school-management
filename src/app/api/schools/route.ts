import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Barcha maktablarni olish
export async function GET() {
  try {
    const schools = await db.school.findMany({
      include: {
        _count: {
          select: {
            classes: true,
            directors: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json(schools)
  } catch (error) {
    console.error('Get schools error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// Yangi maktab qo'shish
export async function POST(request: NextRequest) {
  try {
    const { name, address } = await request.json()
    
    if (!name) {
      return NextResponse.json(
        { error: 'Maktab nomi kiritilishi shart' },
        { status: 400 }
      )
    }
    
    const school = await db.school.create({
      data: {
        name,
        address: address || null,
      },
    })
    
    return NextResponse.json(school)
  } catch (error) {
    console.error('Create school error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
