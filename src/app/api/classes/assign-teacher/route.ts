import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST assign teacher to class
export async function POST(request: NextRequest) {
  try {
    const { teacherId, classId } = await request.json()
    
    if (!teacherId || !classId) {
      return NextResponse.json({ error: 'O\'qituvchi va sinf kiritilishi shart' }, { status: 400 })
    }
    
    // Check if already assigned
    const existing = await prisma.classTeacher.findUnique({
      where: {
        classId_teacherId: { classId, teacherId }
      }
    })
    
    if (existing) {
      return NextResponse.json({ error: 'Bu o\'qituvchi allaqachon biriktirilgan' }, { status: 400 })
    }
    
    const classTeacher = await prisma.classTeacher.create({
      data: { classId, teacherId },
      include: {
        class: true,
        teacher: { include: { user: true } }
      }
    })
    
    return NextResponse.json(classTeacher)
  } catch (error) {
    console.error('Assign teacher error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
