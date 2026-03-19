import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all skills
export async function GET() {
  try {
    const skills = await db.skill.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }]
    })
    
    return NextResponse.json(skills)
  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json(
      { error: 'Ko\'nikmalarni olishda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}

// POST create new skill
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const skill = await db.skill.create({
      data: {
        name: body.name,
        level: body.level || 80,
        category: body.category,
        icon: body.icon || null,
        order: body.order || 0
      }
    })
    
    return NextResponse.json(skill)
  } catch (error) {
    console.error('Error creating skill:', error)
    return NextResponse.json(
      { error: 'Ko\'nikma yaratishda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}
