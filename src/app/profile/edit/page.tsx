import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/dal'
import { ProfileEditForm } from '@/components/profile/edit-form'
import { CertificationsManager } from '@/components/profile/certifications-manager'
import { CompetenciesManager } from '@/components/profile/competencies-manager'

export const dynamic = 'force-dynamic'

export default async function ProfileEditPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect('/auth/login')

  const [user, certifications, competencies, specialties] = await Promise.all([
    prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true, name: true, surname: true, nameArabic: true,
        email: true, role: true, avatar: true, bio: true, cv: true,
        phone: true, whatsapp: true, wilaya: true, municipality: true,
        maritalStatus: true, gender: true, title: true, experienceYears: true,
        languages: true, ageGroupTarget: true, trainingType: true,
        isContracted: true, acceptsRemoteWork: true, acceptsTravel: true, acceptsWorkOutside: true,
        website: true, facebook: true, instagram: true, youtube: true, linkedin: true,
        createdAt: true, updatedAt: true, isActive: true,
        ratingAvg: true, ratingCount: true, availability: true,
        passwordHash: true,
      },
    }),
    prisma.certification.findMany({
      where: { userId: currentUser.id },
      orderBy: { year: 'desc' },
    }),
    prisma.competency.findMany({
      where: { userId: currentUser.id },
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

  if (!user) redirect('/auth/login')

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">تعديل الملف الشخصي</h1>
        <p className="mt-1 text-gray-600">قم بتحديث معلوماتك المهنية والشخصية</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-8 space-y-8">
        <ProfileEditForm user={user} />

        <hr className="border-gray-200" />

        <CompetenciesManager competencies={competencies} specialties={specialties} />

        <hr className="border-gray-200" />

        <CertificationsManager certifications={certifications} />
      </div>
    </div>
  )
}
