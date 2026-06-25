import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { SpecialistCard } from '@/components/specialist-card'
import { Search } from 'lucide-react'

type SearchParams = Promise<{ q?: string; wilaya?: string; category?: string; specialty?: string; page?: string }>

export default async function SearchResultsPage(props: { searchParams: SearchParams }) {
  const params = await props.searchParams
  const query = params.q || ''
  const wilaya = params.wilaya || ''
  const category = params.category || ''
  const specialty = params.specialty || ''
  const page = parseInt(params.page || '1')
  const limit = 20

  // Build where clause
  const where: any = { isActive: true, role: 'SPECIALIST' }

  if (query) {
    where.OR = [
      { name: { contains: query } },
      { nameArabic: { contains: query } },
      { bio: { contains: query } },
      { title: { contains: query } },
    ]
  }

  if (wilaya) {
    where.wilaya = wilaya
  }

  if (category) {
    where.competencies = {
      some: {
        category: { slug: category },
      },
    }
  }

  if (specialty) {
    where.competencies = {
      some: {
        ...(where.competencies?.some || {}),
        specialty: { slug: specialty },
      },
    }
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        surname: true,
        nameArabic: true,
        avatar: true,
        title: true,
        wilaya: true,
        ratingAvg: true,
        ratingCount: true,
        bio: true,
        competencies: {
          include: {
            specialty: { select: { name: true, nameArabic: true } },
            category: { select: { name: true, nameArabic: true } },
          },
          take: 3,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { ratingAvg: 'desc' },
    }),
    prisma.user.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {query || wilaya || category || specialty ? (
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            نتائج البحث
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {total} مختص موجود
            {query && ` لـ "${query}"`}
            {wilaya && ` في ${wilaya}`}
          </p>
        </div>
      ) : (
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">جميع المختصين</h1>
          <p className="mt-1 text-sm text-gray-600">{total} مختص رياضي</p>
        </div>
      )}

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Search className="h-12 w-12 text-gray-300" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">لا توجد نتائج</h2>
          <p className="mt-2 text-sm text-gray-600">
            حاول تعديل معايير البحث أو تصفح التصنيفات
          </p>
          <Link href="/search" className="mt-4">
            <button className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-700">
              تعديل البحث
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <SpecialistCard key={user.id} {...user} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const params = new URLSearchParams()
            if (query) params.set('q', query)
            if (wilaya) params.set('wilaya', wilaya)
            if (category) params.set('category', category)
            if (specialty) params.set('specialty', specialty)
            params.set('page', p.toString())
            return (
              <Link
                key={p}
                href={`/search/results?${params.toString()}`}
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? 'bg-emerald-600 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {p}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
