import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/dal'
import { prisma } from '@/lib/prisma'
import { User, Mail, MapPin, Phone, Award, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function ProfilePage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect('/auth/login')

  const fullProfile = await prisma.user.findUnique({
    where: { id: currentUser.id },
    include: {
      competencies: {
        include: {
          category: true,
          specialty: true,
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

  if (!fullProfile) redirect('/auth/login')

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-gray-200 bg-white p-8">
        <div className="flex items-start gap-6">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700 border-2 border-emerald-200">
            {fullProfile.avatar ? (
              <img src={fullProfile.avatar} alt={fullProfile.name} className="h-full w-full object-cover" />
            ) : (
              fullProfile.nameArabic?.charAt(0) || fullProfile.name.charAt(0)
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {fullProfile.nameArabic || `${fullProfile.surname ? fullProfile.surname + ' ' : ''}${fullProfile.name}`}
            </h1>
            {fullProfile.title && <p className="mt-1 text-gray-600">{fullProfile.title}</p>}
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {fullProfile.email}
              </span>
              {fullProfile.wilaya && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {fullProfile.wilaya}
                </span>
              )}
              {fullProfile.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {fullProfile.phone}
                </span>
              )}
            </div>
          </div>
          <Link href="/profile/edit" className="group relative shrink-0">
            <Button variant="outline" size="sm" className="gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 font-bold">
              <Pencil className="h-4 w-4" />
              ✏️ تعديل الملف
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-4 gap-4 rounded-lg bg-gray-50 p-4">
          {[
            { label: 'التقييمات', value: fullProfile._count.reviewsReceived },
            { label: 'الاختصاصات', value: fullProfile.competencies.length },
            { label: 'الموارد', value: fullProfile._count.libraryResources },
            { label: 'الابتكارات', value: fullProfile._count.innovations },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl font-bold text-emerald-700">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Edit Profile Link */}
        <div className="mt-6 text-center">
          <Link href="/profile/edit">
            <Button variant="outline" size="sm" className="gap-2 border-emerald-300 text-emerald-700 font-bold">
              <Pencil className="h-4 w-4" />
              ✏️ تعديل الملف الشخصي
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
