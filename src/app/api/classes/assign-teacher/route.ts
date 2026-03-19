import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// O'qituvchini sinfga biriktirish
export async function POST(request: NextRequest) {
  try {
    const { classId, teacherId } = await request.json()
    
    if (!classId || !teacherId) {
      return NextResponse.json(
        { error: 'Sinf va o\'qituvchi tanlanishi shart' },
        { status: 400 }
      )
    }
    
    // Allaqachon biriktirilganligini tekshirish
    const existing = await db.classTeacher.findUnique({
      where: {
        classId_teacherId: { classId, teacherId },
      },
    })
    
    if (existing) {
      return NextResponse.json(
        { error: 'Bu o\'qituvchi allaqachon bu sinfga biriktirilgan' },
        { status: 400 }
      )
    }
    
    const classTeacher = await db.classTeacher.create({
      data: { classId, teacherId },
      include: {
        class: true,
        teacher: {
          include: { user: true },
        },
      },
    })
    
    return NextResponse.json(classTeacher)
  } catch (error) {
    console.error('Assign teacher error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// O'qituvchini sinfdan olib tashlash
export async function DELETE(request: NextRequest) {
  try {
    const { classId, teacherId } = await request.json()
    
    await db.classTeacher.delete({
      where: {
        classId_teacherId: { classId, teacherId },
      },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Remove teacher from class error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
