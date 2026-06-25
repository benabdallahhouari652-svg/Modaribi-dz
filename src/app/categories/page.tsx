import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import {
  Trophy, Users, Heart, Trees, Building2, Search,
  Camera, Newspaper, Lightbulb, BookOpen
} from 'lucide-react'

const sectionIcons: Record<string, any> = {
  'الرياضات الجماعية': Trophy,
  'الرياضات الفردية': Users,
  'الكفاءات الرياضية': Users,
  'القسم الصحي': Heart,
  'التنشيط والتأطير': Trees,
  'القسم الإداري': Building2,
  'الاستكشاف': Search,
  'القسم الإعلامي': Camera,
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: { select: { competencies: true } },
    },
  })
  return categories
}

async function getSpecialties() {
  return await prisma.specialty.findMany({
    include: {
      _count: { select: { competencies: true } },
      category: true,
    },
    orderBy: { name: 'asc' },
  })
}

export default async function CategoriesPage() {
  const [categories, specialties] = await Promise.all([
    getCategories(),
    getSpecialties(),
  ])

  const groupedCategories = categories.filter(c => !c.parentId)
  const subCategories = categories.filter(c => c.parentId)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">التصنيفات الرياضية</h1>
        <p className="mt-1 text-gray-600">
          استعرض جميع التصنيفات والاختصاصات الرياضية المتاحة على المنصة
        </p>
      </div>

      {/* Main Categories */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        {groupedCategories.map((cat) => {
          const Icon = sectionIcons[cat.name] || BookOpen
          const subCats = subCategories.filter(c => c.parentId === cat.id)
          const count = specialties.filter(s => s.categoryId === cat.id).length
          return (
            <Link
              key={cat.id}
              href={`/search?category=${cat.slug}`}
              className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-emerald-200 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900 group-hover:text-emerald-700">
                {cat.nameArabic || cat.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {count || subCats.length || cat._count.competencies} اختصاص
              </p>
              {subCats.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {subCats.slice(0, 3).map((sub) => (
                    <span key={sub.id} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      {sub.nameArabic || sub.name}
                    </span>
                  ))}
                  {subCats.length > 3 && (
                    <span className="text-xs text-gray-400">+{subCats.length - 3}</span>
                  )}
                </div>
              )}
            </Link>
          )
        })}
      </div>

      {/* All Specialties */}
      <div>
        <h2 className="mb-6 text-xl font-bold text-gray-900">جميع الاختصاصات</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {specialties.map((spec) => (
            <Link
              key={spec.id}
              href={`/search/results?specialty=${spec.slug}`}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-200 hover:bg-emerald-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                {spec.icon || '⭐'}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-gray-900">{spec.nameArabic || spec.name}</h4>
                {spec.category && (
                  <p className="text-xs text-gray-500">{spec.category.nameArabic || spec.category.name}</p>
                )}
              </div>
              <span className="text-xs text-gray-400">{spec._count.competencies}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
