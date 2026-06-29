import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/dal'
import { prisma } from '@/lib/prisma'
import { User, Mail, MapPin, Phone, Award, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect('/auth/login')

  const fullProfile = await prisma.user.findUnique({
    where: { id: currentUser.id },
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
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {fullProfile.nameArabic || `${fullProfile.surname ? fullProfile.surname + ' ' : ''}${fullProfile.name}`}
              <Link href="/profile/edit" className="inline-flex items-center gap-1 rounded-lg p-1.5 text-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all" title="تعديل الاسم">
                <Pencil className="h-3.5 w-3.5" />
              </Link>
            </h1>
            {fullProfile.title && (
              <p className="mt-1 text-gray-600 flex items-center gap-2">
                {fullProfile.title}
                <Link href="/profile/edit" className="inline-flex items-center gap-1 rounded-lg p-1 text-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all opacity-0 hover:opacity-100" title="تعديل المسمى">
                  <Pencil className="h-3 w-3" />
                </Link>
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
              <Link href="/profile/edit" className="flex items-center gap-1 group rounded-lg px-2 py-1 -mx-2 hover:bg-emerald-50 transition-colors" title="تعديل البريد الإلكتروني">
                <Mail className="h-4 w-4" />
                <span>{fullProfile.email}</span>
                <Pencil className="h-3 w-3 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              {fullProfile.wilaya && (
                <Link href="/profile/edit" className="flex items-center gap-1 group rounded-lg px-2 py-1 -mx-2 hover:bg-emerald-50 transition-colors" title="تعديل الولاية">
                  <MapPin className="h-4 w-4" />
                  <span>{fullProfile.wilaya}</span>
                  <Pencil className="h-3 w-3 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              )}
              {fullProfile.phone && (
                <Link href="/profile/edit" className="flex items-center gap-1 group rounded-lg px-2 py-1 -mx-2 hover:bg-emerald-50 transition-colors" title="تعديل رقم الهاتف">
                  <Phone className="h-4 w-4" />
                  <span>{fullProfile.phone}</span>
                  <Pencil className="h-3 w-3 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
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
