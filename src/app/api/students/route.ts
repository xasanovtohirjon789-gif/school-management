import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Barcha o'quvchilarni olish
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')
    
    const where = classId ? { classId } : {}
    
    const students = await db.student.findMany({
      where,
      include: {
        class: true,
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    })
    
    return NextResponse.json(students)
  } catch (error) {
    console.error('Get students error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// Yangi o'quvchi qo'shish
export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, middleName, classId } = await request.json()
    
    if (!firstName || !lastName || !classId) {
      return NextResponse.json(
        { error: 'Ism, familiya va sinf kiritilishi shart' },
        { status: 400 }
      )
    }
    
    // Sinf mavjudligini tekshirish
    const classExists = await db.class.findUnique({
      where: { id: classId },
    })
    
    if (!classExists) {
      return NextResponse.json(
        { error: 'Sinf topilmadi' },
        { status: 404 }
      )
    }
    
    const student = await db.student.create({
      data: {
        firstName,
        lastName,
        middleName: middleName || null,
        classId,
      },
      include: { class: true },
    })
    
    return NextResponse.json(student)
  } catch (error) {
    console.error('Create student error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// O'quvchini o'chirish
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    
    await db.student.delete({ where: { id } })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete student error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
