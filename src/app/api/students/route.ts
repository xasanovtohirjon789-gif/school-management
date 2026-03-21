import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET students (filter by classId if provided)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')
    const schoolId = searchParams.get('schoolId')
    
    const where: any = {}
    if (classId) {
      where.classId = classId
    }
    if (schoolId) {
      where.class = { schoolId }
    }
    
    const students = await prisma.student.findMany({
      where,
      include: {
        class: true,
        _count: {
          select: { coinHistory: true }
        }
      },
      orderBy: [
        { class: { name: 'asc' } },
        { lastName: 'asc' },
        { firstName: 'asc' }
      ]
    })
    
    return NextResponse.json(students)
  } catch (error) {
    console.error('Get students error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// POST create student
export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, middleName, classId } = await request.json()
    
    if (!firstName || !lastName || !classId) {
      return NextResponse.json({ error: 'Ism, familiya va sinf kiritilishi shart' }, { status: 400 })
    }
    
    const student = await prisma.student.create({
      data: {
        firstName,
        lastName,
        middleName: middleName || null,
        classId
      },
      include: {
        class: true
      }
    })
    
    return NextResponse.json(student)
  } catch (error) {
    console.error('Create student error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// PUT update student
export async function PUT(request: NextRequest) {
  try {
    const { id, firstName, lastName, middleName, classId } = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: 'ID kiritilishi shart' }, { status: 400 })
    }
    
    const student = await prisma.student.update({
      where: { id },
      data: {
        firstName,
        lastName,
        middleName: middleName || null,
        classId
      },
      include: {
        class: true
      }
    })
    
    return NextResponse.json(student)
  } catch (error) {
    console.error('Update student error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// DELETE student
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID kiritilishi shart' }, { status: 400 })
    }
    
    await prisma.student.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete student error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
