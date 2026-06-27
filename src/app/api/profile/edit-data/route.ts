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

    // جلب كل البيانات بشكل متسلسل (Sequential) بدل متوازي — أسرع للتشخيص
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, surname: true, nameArabic: true,
        email: true, role: true, avatar: true, bio: true, cv: true,
        phone: true, whatsapp: true, wilaya: true, municipality: true,
        maritalStatus: true, gender: true, title: true, experienceYears: true,
        languages: true, ageGroupTarget: true, trainingType: true,
        isContracted: true, acceptsRemoteWork: true, acceptsTravel: true, acceptsWorkOutside: true,
        website: true, facebook: true, instagram: true, youtube: true, linkedin: true,
      },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'المستخدم غير موجود' }, { status: 404 })
    }

    const certifications = await prisma.certification.findMany({
      where: { userId },
      orderBy: { year: 'desc' },
    })

    const competencies = await prisma.competency.findMany({
      where: { userId },
      include: {
        specialty: { select: { name: true, nameArabic: true } },
        category: { select: { name: true, nameArabic: true } },
      },
    })

    const specialties = await prisma.specialty.findMany({
      include: { category: { select: { nameArabic: true, name: true } } },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({
      success: true,
      user,
      certifications,
      competencies,
      specialties,
    })
  } catch (error) {
    console.error('Edit data API error:', error)
    const message = error instanceof Error ? error.message : 'حدث خطأ في تحميل البيانات'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
