import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Barcha o'qituvchilarni olish
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const directorId = searchParams.get('directorId')
    
    const where = directorId ? { directorId } : {}
    
    const teachers = await db.teacher.findMany({
      where,
      include: {
        user: true,
        director: {
          include: { school: true },
        },
        classTeacher: {
          include: { class: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json(teachers)
  } catch (error) {
    console.error('Get teachers error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// Yangi o'qituvchi qo'shish
export async function POST(request: NextRequest) {
  try {
    const { login, password, name, subject, directorId } = await request.json()
    
    if (!login || !password || !name || !subject || !directorId) {
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
    
    // Direktor mavjudligini tekshirish
    const director = await db.director.findUnique({
      where: { id: directorId },
    })
    
    if (!director) {
      return NextResponse.json(
        { error: 'Direktor topilmadi' },
        { status: 404 }
      )
    }
    
    // Foydalanuvchi yaratish
    const user = await db.user.create({
      data: {
        login,
        password,
        name,
        role: 'teacher',
        teacher: {
          create: {
            subject,
            directorId,
          },
        },
      },
      include: {
        teacher: {
          include: { director: true },
        },
      },
    })
    
    return NextResponse.json(user)
  } catch (error) {
    console.error('Create teacher error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// O'qituvchini o'chirish
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    
    // Avval o'qituvchini topish
    const teacher = await db.teacher.findUnique({
      where: { id },
    })
    
    if (!teacher) {
      return NextResponse.json(
        { error: 'O\'qituvchi topilmadi' },
        { status: 404 }
      )
    }
    
    // O'qituvchini va uning foydalanuvchisini o'chirish
    await db.teacher.delete({ where: { id } })
    await db.user.delete({ where: { id: teacher.userId } })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete teacher error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
