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

  const user = await prisma.user.findUnique({ where: { id: currentUser.id } })
  if (!user) redirect('/auth/login')

  const [certifications, competencies, specialties] = await Promise.all([
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
