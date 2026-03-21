import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { login, password } = await request.json()
    
    console.log('Login attempt:', login)
    
    if (!login || !password) {
      return NextResponse.json(
        { error: 'Login va parol kiritilishi shart' },
        { status: 400 }
      )
    }
    
    // Foydalanuvchini bazadan qidirish
    const user = await prisma.user.findUnique({
      where: { login },
      include: {
        director: {
          include: {
            school: true,
          },
        },
        teacher: {
          include: {
            director: {
              include: {
                school: true,
              },
            },
            classTeacher: {
              include: {
                class: true,
              },
            },
          },
        },
      },
    })
    
    console.log('User found:', user ? user.login : 'not found')
    
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Login yoki parol noto\'g\'ri' },
        { status: 401 }
      )
    }
    
    // Admin ma'lumotlari
    if (user.role === 'admin') {
      return NextResponse.json({
        user: {
          id: user.id,
          login: user.login,
          name: user.name,
          role: 'admin',
        },
      })
    }
    
    // Direktor ma'lumotlari
    if (user.role === 'director' && user.director) {
      return NextResponse.json({
        user: {
          id: user.id,
          login: user.login,
          name: user.name,
          role: 'director',
        },
        directorInfo: {
          schoolId: user.director.schoolId,
          schoolName: user.director.school.name,
          directorId: user.director.id,
        },
      })
    }
    
    // O'qituvchi ma'lumotlari
    if (user.role === 'teacher' && user.teacher) {
      return NextResponse.json({
        user: {
          id: user.id,
          login: user.login,
          name: user.name,
          role: 'teacher',
        },
        teacherInfo: {
          subject: user.teacher.subject,
          teacherId: user.teacher.id,
          directorId: user.teacher.directorId,
          classes: user.teacher.classTeacher.map(ct => ({
            id: ct.class.id,
            name: ct.class.name,
          })),
        },
      })
    }
    
    return NextResponse.json({ error: 'Noma\'lum rol' }, { status: 400 })
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Server xatosi', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
