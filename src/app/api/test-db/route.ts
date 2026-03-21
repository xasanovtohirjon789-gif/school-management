import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count()
    const schoolCount = await prisma.school.count()
    const directorCount = await prisma.director.count()
    const teacherCount = await prisma.teacher.count()
    
    // Get a test user
    const testUser = await prisma.user.findUnique({
      where: { login: 'director39' }
    })
    
    return NextResponse.json({
      status: 'connected',
      counts: {
        users: userCount,
        schools: schoolCount,
        directors: directorCount,
        teachers: teacherCount,
      },
      testUser: testUser ? {
        id: testUser.id,
        login: testUser.login,
        role: testUser.role,
        name: testUser.name,
      } : null,
    })
  } catch (error) {
    console.error('DB test error:', error)
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
