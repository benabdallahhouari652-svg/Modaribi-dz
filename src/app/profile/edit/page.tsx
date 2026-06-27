import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/dal'
import { ProfileEditForm } from '@/components/profile/edit-form'
import { CertificationsManager } from '@/components/profile/certifications-manager'
import { CompetenciesManager } from '@/components/profile/competencies-manager'
import { AlertCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ProfileEditPage() {
  // ✅ Auth check
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect('/auth/login')

  try {
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
  } catch (error) {
    // Re-throw Next.js redirect/navigation errors so they work properly
    if (error instanceof Error && (
      error.message?.includes('NEXT_REDIRECT') ||
      error.message?.includes('redirect') ||
      error.digest?.startsWith('NEXT_REDIRECT')
    )) {
      throw error
    }

    console.error('Profile edit page error:', error)
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h2 className="mt-4 text-xl font-bold text-red-700">حدث خطأ</h2>
          <p className="mt-2 text-red-600">
            عذراً، حدث خطأ أثناء تحميل صفحة التعديل. يرجى المحاولة مرة أخرى.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/profile/edit"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              <RefreshCw className="h-4 w-4" />
              إعادة المحاولة
            </Link>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              الرجوع للبروفيل
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
