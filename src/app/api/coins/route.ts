import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET coin transactions (filter by studentId or teacherId)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const teacherId = searchParams.get('teacherId')
    
    const where: any = {}
    if (studentId) {
      where.studentId = studentId
    }
    if (teacherId) {
      where.teacherId = teacherId
    }
    
    const transactions = await prisma.coinTransaction.findMany({
      where,
      include: {
        student: {
          include: { class: true }
        },
        teacher: {
          include: { user: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    })
    
    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Get coins error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// POST create coin transaction
export async function POST(request: NextRequest) {
  try {
    const { studentId, teacherId, amount, reason } = await request.json()
    
    if (!studentId || !teacherId || !amount) {
      return NextResponse.json({ error: 'O\'quvchi, o\'qituvchi va miqdor kiritilishi shart' }, { status: 400 })
    }
    
    // Create transaction and update student coins in one transaction
    const result = await prisma.$transaction(async (tx) => {
      const transaction = await tx.coinTransaction.create({
        data: {
          studentId,
          teacherId,
          amount: parseInt(amount),
          reason: reason || null
        },
        include: {
          student: { include: { class: true } },
          teacher: { include: { user: true } }
        }
      })
      
      // Update student's total coins
      await tx.student.update({
        where: { id: studentId },
        data: {
          coins: {
            increment: parseInt(amount)
          }
        }
      })
      
      return transaction
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Create coin error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
