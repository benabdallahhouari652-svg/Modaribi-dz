import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { SpecialistCard } from '@/components/specialist-card'
import { Users, Search, MapPin, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WILAYAS } from '@/lib/constants'

type SearchParams = Promise<{ wilaya?: string; category?: string; q?: string }>

export default async function SpecialistsPage(props: { searchParams: SearchParams }) {
  const params = await props.searchParams
  const wilaya = params.wilaya || ''
  const category = params.category || ''
  const query = params.q || ''

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

  const [specialists, categories, total] = await Promise.all([
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
      orderBy: { ratingAvg: 'desc' },
      take: 50,
    }),
    prisma.category.findMany({
      where: { parentId: null },
      orderBy: { order: 'asc' },
    }),
    prisma.user.count({ where }),
  ])

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-emerald-200" />
            <h1 className="text-3xl font-bold">المختصون الرياضيون</h1>
          </div>
          <p className="mt-2 text-lg text-emerald-100">
            {total} مختص رياضي في مختلف المجالات والتخصصات
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-gray-200 bg-white sticky top-16 z-40">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <form method="GET" action="/specialists" className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="ابحث عن مختص..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-10 pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Wilaya Filter */}
            <div className="relative min-w-[150px]">
              <MapPin className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                name="wilaya"
                defaultValue={wilaya}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pr-10 pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">كل الولايات</option>
                {WILAYAS.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="relative min-w-[150px]">
              <Filter className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                name="category"
                defaultValue={category}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pr-10 pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">كل التصنيفات</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.nameArabic || c.name}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="whitespace-nowrap rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
            >
              بحث
            </button>

            {(query || wilaya || category) && (
              <Link
                href="/specialists"
                className="whitespace-nowrap rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 hover:bg-red-100 transition-colors"
              >
                مسح الفلترة
              </Link>
            )}
          </form>
        </div>
      </section>

      {/* Specialists Grid */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {specialists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Users className="h-16 w-16 text-gray-300" />
            <h2 className="mt-4 text-xl font-bold text-gray-900">لا يوجد مختصين</h2>
            <p className="mt-2 text-gray-600">
              {query || wilaya || category
                ? 'لا توجد نتائج تطابق معايير البحث'
                : 'سيتم إضافة المختصين قريباً'}
            </p>
            <Link href="/auth/signup">
              <Button className="mt-6 gap-2">
                <Users className="h-4 w-4" />
                سجل كمختص الآن
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-500">
              عرض {specialists.length} من {total} مختص
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {specialists.map((specialist) => (
                <SpecialistCard key={specialist.id} {...specialist} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
