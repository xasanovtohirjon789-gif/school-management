import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { login, password } = await request.json()
    
    if (!login || !password) {
      return NextResponse.json(
        { error: 'Login va parol kiritilishi shart' },
        { status: 400 }
      )
    }
    
    // Admin tekshirish
    if (login === 'ToHa_012' && password === 'tox1c___') {
      return NextResponse.json({
        user: {
          id: 'admin',
          login: 'ToHa_012',
          name: 'Bosh Admin',
          role: 'admin',
        },
      })
    }
    
    // Foydalanuvchini bazadan qidirish
    const user = await db.user.findUnique({
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
    
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Login yoki parol noto\'g\'ri' },
        { status: 401 }
      )
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
      { error: 'Server xatosi' },
      { status: 500 }
    )
  }
}
