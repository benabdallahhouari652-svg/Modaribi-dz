import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return NextResponse.json({ success: false }, { status: 401 })
    }

    const userId = session.userId

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, surname: true, nameArabic: true,
        email: true, role: true, avatar: true, bio: true,
        phone: true, whatsapp: true, wilaya: true, municipality: true,
        title: true, experienceYears: true,
        ratingAvg: true, ratingCount: true,
        competencies: {
          select: {
            id: true, isMain: true, isVerified: true,
            specialty: { select: { name: true, nameArabic: true } },
            category: { select: { name: true, nameArabic: true } },
          },
        },
        _count: {
          select: {
            reviewsReceived: true,
            libraryResources: true,
            innovations: true,
            articles: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ success: false }, { status: 404 })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'خطأ في تحميل البروفيل',
    }, { status: 500 })
  }
}
