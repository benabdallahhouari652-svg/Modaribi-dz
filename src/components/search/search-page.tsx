'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search as SearchIcon, MapPin, Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type Category = {
  id: string
  name: string
  nameArabic: string
  slug: string
  icon: string | null
}

type SearchProps = {
  categories: Category[]
  wilayas: string[]
}

export function Search({ categories, wilayas }: SearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [selectedWilaya, setSelectedWilaya] = useState(searchParams.get('wilaya') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (selectedWilaya) params.set('wilaya', selectedWilaya)
    if (selectedCategory) params.set('category', selectedCategory)
    router.push(`/search/results?${params.toString()}`)
  }, [query, selectedWilaya, selectedCategory, router])

  const clearFilters = () => {
    setQuery('')
    setSelectedWilaya('')
    setSelectedCategory('')
  }

  const hasFilters = query || selectedWilaya || selectedCategory

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <SearchIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن مدرب، مختص، نادي..."
            className="pr-11 h-12 text-base"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} size="lg" className="gap-2">
          <SearchIcon className="h-5 w-5" />
          بحث
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-5 w-5" />
          تصفية
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Wilaya Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                <MapPin className="inline h-4 w-4 ml-1" />
                الولاية
              </label>
              <select
                value={selectedWilaya}
                onChange={(e) => setSelectedWilaya(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">كل الولايات</option>
                {wilayas.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                التصنيف
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">كل التصنيفات</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.nameArabic || c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">نتائج البحث عن:</span>
          {query && (
            <Badge variant="secondary" className="gap-1">
              {query}
              <button onClick={() => setQuery('')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedWilaya && (
            <Badge variant="secondary" className="gap-1">
              {selectedWilaya}
              <button onClick={() => setSelectedWilaya('')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedCategory && (
            <Badge variant="secondary" className="gap-1">
              {categories.find(c => c.slug === selectedCategory)?.nameArabic}
              <button onClick={() => setSelectedCategory('')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <button onClick={clearFilters} className="text-xs text-red-600 hover:text-red-700">
            مسح الكل
          </button>
        </div>
      )}

      {/* Quick Categories */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-gray-700">تصفح سريع حسب التصنيف</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.slug)
                setShowFilters(true)
              }}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              {cat.icon && <span className="ml-1">{cat.icon}</span>}
              {cat.nameArabic || cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
