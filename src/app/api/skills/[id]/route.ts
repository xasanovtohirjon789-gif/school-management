import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// DELETE skill
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.skill.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting skill:', error)
    return NextResponse.json(
      { error: 'Ko\'nikmani o\'chirishda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}

// PUT update skill
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const skill = await db.skill.update({
      where: { id },
      data: {
        name: body.name,
        level: body.level,
        category: body.category,
        icon: body.icon || null,
        order: body.order
      }
    })
    
    return NextResponse.json(skill)
  } catch (error) {
    console.error('Error updating skill:', error)
    return NextResponse.json(
      { error: 'Ko\'nikmani yangilashda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}
