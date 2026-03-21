import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET classes (filter by schoolId if provided)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    
    const where: any = {}
    if (schoolId) {
      where.schoolId = schoolId
    }
    
    const classes = await prisma.class.findMany({
      where,
      include: {
        school: true,
        _count: {
          select: { students: true, classTeachers: true }
        }
      },
      orderBy: { name: 'asc' }
    })
    
    return NextResponse.json(classes)
  } catch (error) {
    console.error('Get classes error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// POST create class
export async function POST(request: NextRequest) {
  try {
    const { name, schoolId } = await request.json()
    
    if (!name || !schoolId) {
      return NextResponse.json({ error: 'Sinf nomi va maktab kiritilishi shart' }, { status: 400 })
    }
    
    const classItem = await prisma.class.create({
      data: { name, schoolId },
      include: { school: true }
    })
    
    return NextResponse.json(classItem)
  } catch (error) {
    console.error('Create class error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
