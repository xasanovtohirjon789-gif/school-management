import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Barcha direktorlarni olish
export async function GET() {
  try {
    const directors = await db.director.findMany({
      include: {
        user: true,
        school: true,
        _count: {
          select: { teachers: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json(directors)
  } catch (error) {
    console.error('Get directors error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// Yangi direktor qo'shish
export async function POST(request: NextRequest) {
  try {
    const { login, password, name, schoolId } = await request.json()
    
    if (!login || !password || !name || !schoolId) {
      return NextResponse.json(
        { error: 'Barcha maydonlar to\'ldirilishi shart' },
        { status: 400 }
      )
    }
    
    // Login takrorlanmasligini tekshirish
    const existingUser = await db.user.findUnique({
      where: { login },
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bunday login allaqachon mavjud' },
        { status: 400 }
      )
    }
    
    // Maktab mavjudligini tekshirish
    const school = await db.school.findUnique({
      where: { id: schoolId },
    })
    
    if (!school) {
      return NextResponse.json(
        { error: 'Maktab topilmadi' },
        { status: 404 }
      )
    }
    
    // Foydalanuvchi yaratish
    const user = await db.user.create({
      data: {
        login,
        password,
        name,
        role: 'director',
        director: {
          create: {
            schoolId,
          },
        },
      },
      include: {
        director: {
          include: { school: true },
        },
      },
    })
    
    return NextResponse.json(user)
  } catch (error) {
    console.error('Create director error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
