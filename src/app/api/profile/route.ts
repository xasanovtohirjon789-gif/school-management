import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET profile
export async function GET() {
  try {
    const profiles = await db.profile.findMany()
    
    if (profiles.length === 0) {
      // Return default profile if none exists
      return NextResponse.json({
        id: '',
        name: 'Ismingiz',
        title: 'Kasbingiz',
        bio: 'O\'zingiz haqingizda qisqacha ma\'lumot',
        avatar: null,
        email: null,
        phone: null,
        location: null,
        website: null,
        github: null,
        linkedin: null,
        twitter: null,
        telegram: null,
        resumeUrl: null
      })
    }
    
    return NextResponse.json(profiles[0])
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Profilni olishda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}

// POST create or update profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Check if profile exists
    const existingProfiles = await db.profile.findMany()
    
    let profile
    if (existingProfiles.length > 0) {
      // Update existing profile
      profile = await db.profile.update({
        where: { id: existingProfiles[0].id },
        data: {
          name: body.name,
          title: body.title,
          bio: body.bio,
          avatar: body.avatar || null,
          email: body.email || null,
          phone: body.phone || null,
          location: body.location || null,
          website: body.website || null,
          github: body.github || null,
          linkedin: body.linkedin || null,
          twitter: body.twitter || null,
          telegram: body.telegram || null,
          resumeUrl: body.resumeUrl || null
        }
      })
    } else {
      // Create new profile
      profile = await db.profile.create({
        data: {
          name: body.name,
          title: body.title,
          bio: body.bio,
          avatar: body.avatar || null,
          email: body.email || null,
          phone: body.phone || null,
          location: body.location || null,
          website: body.website || null,
          github: body.github || null,
          linkedin: body.linkedin || null,
          twitter: body.twitter || null,
          telegram: body.telegram || null,
          resumeUrl: body.resumeUrl || null
        }
      })
    }
    
    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error saving profile:', error)
    return NextResponse.json(
      { error: 'Profilni saqlashda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}
