import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Coin tarixini olish
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    
    const where = studentId ? { studentId } : {}
    
    const transactions = await db.coinTransaction.findMany({
      where,
      include: {
        student: true,
        teacher: {
          include: { user: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Get coin transactions error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// Coin qo'shish/ayirish
export async function POST(request: NextRequest) {
  try {
    const { studentId, teacherId, amount, reason } = await request.json()
    
    if (!studentId || !teacherId || !amount) {
      return NextResponse.json(
        { error: 'O\'quvchi, o\'qituvchi va miqdor kiritilishi shart' },
        { status: 400 }
      )
    }
    
    // Transaction yaratish
    const transaction = await db.coinTransaction.create({
      data: {
        studentId,
        teacherId,
        amount: parseInt(amount),
        reason: reason || null,
      },
    })
    
    // O'quvchi coinini yangilash
    const student = await db.student.findUnique({
      where: { id: studentId },
    })
    
    if (student) {
      await db.student.update({
        where: { id: studentId },
        data: {
          coins: student.coins + parseInt(amount),
        },
      })
    }
    
    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Create coin transaction error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
