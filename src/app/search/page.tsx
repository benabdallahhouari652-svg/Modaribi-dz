import Link from 'next/link'
import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { WILAYAS } from '@/lib/constants'
import { Search } from '@/components/search/search-page'

async function getCategories() {
  return await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { order: 'asc' },
  })
}

export default async function SearchPage() {
  const categories = await getCategories()
  const wilayas = WILAYAS

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">البحث عن مختصين</h1>
        <p className="mt-1 text-gray-600">
          ابحث عن الكفاءات الرياضية حسب الاختصاص، الولاية، أو الاسم
        </p>
      </div>

      <Suspense fallback={<div className="animate-pulse h-20 bg-gray-100 rounded-xl" />}>
        <Search categories={categories} wilayas={wilayas} />
      </Suspense>
    </div>
  )
}
