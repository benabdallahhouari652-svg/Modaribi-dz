import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifySession } from '@/lib/dal'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await verifySession()
    if (!session?.userId) {
      return NextResponse.json({ success: false, user: null }, { status: 401 })
    }

    const [user, certifications, competencies, specialties] = await Promise.all([
      prisma.user.findUnique({ where: { id: session.userId } }),
      prisma.certification.findMany({
        where: { userId: session.userId },
        orderBy: { year: 'desc' },
      }),
      prisma.competency.findMany({
        where: { userId: session.userId },
        include: {
          specialty: { select: { name: true, nameArabic: true } },
          category: { select: { name: true, nameArabic: true } },
        },
      }),
      prisma.specialty.findMany({
        include: { category: { select: { nameArabic: true, name: true } } },
        orderBy: { name: 'asc' },
      }),
    ])

    if (!user) {
      return NextResponse.json({ success: false }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user,
      certifications,
      competencies,
      specialties,
    })
  } catch (error) {
    console.error('Edit data API error:', error)
    return NextResponse.json({ success: false, error: 'حدث خطأ في تحميل البيانات' }, { status: 500 })
  }
}
