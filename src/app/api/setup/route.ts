import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const hash = await bcrypt.hash('123456', 10)

    // Check if admin already exists
    const existing = await prisma.user.findUnique({ where: { email: 'admin@modaribi.dz' } })
    if (existing) {
      // Force reset password hash
      await prisma.user.update({
        where: { email: 'admin@modaribi.dz' },
        data: { passwordHash: hash, isActive: true },
      })
      return NextResponse.json({ message: '✅ تم إعادة تعيين كلمة السر: admin@modaribi.dz / 123456' })
    }

    // Create admin
    await prisma.user.create({
      data: {
        name: 'Houari Benabdallah',
        surname: 'بن عبد الله',
        nameArabic: 'بن عبد الله الهواري',
        email: 'admin@modaribi.dz',
        passwordHash: hash,
        role: 'SUPER_ADMIN',
        isActive: true,
        title: 'مربي رياضي • محلل أداء • مدرب حراس مرمى',
        bio: 'مربي رياضي، محلل أداء، مدرب حراس مرمى. صاحب فكرة ومؤسس مشروع مدربي DZ.',
        phone: '+213-XXX-XXX-XXX',
        wilaya: 'الجزائر',
        maritalStatus: 'MARRIED',
        gender: 'MALE',
        experienceYears: 10,
        languages: JSON.stringify(['العربية', 'الإنجليزية', 'الفرنسية']),
        ratingAvg: 4.8,
        ratingCount: 15,
      },
    })

    // Create categories
    await Promise.all([
      prisma.category.create({ data: { name: 'Team Sports', nameArabic: 'الرياضات الجماعية', slug: 'team-sports', icon: '🏆', order: 1 } }),
      prisma.category.create({ data: { name: 'Individual Sports', nameArabic: 'الرياضات الفردية', slug: 'individual-sports', icon: '🏊', order: 2 } }),
      prisma.category.create({ data: { name: 'Sports Competencies', nameArabic: 'الكفاءات الرياضية', slug: 'sports-competencies', icon: '👨‍🏫', order: 3 } }),
      prisma.category.create({ data: { name: 'Educational', nameArabic: 'التربية والتعليم', slug: 'educational', icon: '📚', order: 4 } }),
      prisma.category.create({ data: { name: 'Health & Sciences', nameArabic: 'الصحة والعلوم', slug: 'health-sciences', icon: '🔬', order: 5 } }),
      prisma.category.create({ data: { name: 'Media & Communication', nameArabic: 'الإعلام والاتصال', slug: 'media-communication', icon: '📡', order: 6 } }),
      prisma.category.create({ data: { name: 'Management & Leadership', nameArabic: 'الإدارة والقيادة', slug: 'management-leadership', icon: '📊', order: 7 } }),
      prisma.category.create({ data: { name: 'Summer Camps', nameArabic: 'المخيمات الصيفية', slug: 'summer-camps', icon: '🏕️', order: 8 } }),
    ])

    return NextResponse.json({ message: '✅ تم تجهيز النظام: Admin + 8 تصنيفات رياضية' })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ error: '❌ فشل تجهيز البيانات' }, { status: 500 })
  }
}
