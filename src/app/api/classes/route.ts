import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Barcha sinflarni olish
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const teacherId = searchParams.get('teacherId')
    
    let where = {}
    
    if (schoolId) {
      where = { schoolId }
    }
    
    if (teacherId) {
      where = {
        classTeachers: {
          some: { teacherId },
        },
      }
    }
    
    const classes = await db.class.findMany({
      where,
      include: {
        school: true,
        _count: {
          select: { students: true },
        },
        classTeachers: {
          include: {
            teacher: {
              include: { user: true },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    })
    
    return NextResponse.json(classes)
  } catch (error) {
    console.error('Get classes error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// Yangi sinf qo'shish
export async function POST(request: NextRequest) {
  try {
    const { name, schoolId } = await request.json()
    
    if (!name || !schoolId) {
      return NextResponse.json(
        { error: 'Sinf nomi va maktab kiritilishi shart' },
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
    
    const newClass = await db.class.create({
      data: {
        name,
        schoolId,
      },
      include: { school: true },
    })
    
    return NextResponse.json(newClass)
  } catch (error) {
    console.error('Create class error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// Sinfni o'chirish
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    
    await db.class.delete({ where: { id } })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete class error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
