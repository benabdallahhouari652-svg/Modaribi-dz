import Link from 'next/link'
import { MapPin, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type SpecialistCardProps = {
  id: string
  name: string
  surname?: string | null
  nameArabic?: string | null
  avatar?: string | null
  title?: string | null
  wilaya?: string | null
  ratingAvg: number
  ratingCount: number
  bio?: string | null
  competencies?: Array<{
    specialty?: { name: string; nameArabic: string } | null
    category?: { name: string; nameArabic: string } | null
  }>
}

export function SpecialistCard({
  id,
  name,
  surname,
  nameArabic,
  avatar,
  title,
  wilaya,
  ratingAvg,
  ratingCount,
  bio,
  competencies,
}: SpecialistCardProps) {
  const displayName = nameArabic || `${surname ? surname + ' ' : ''}${name}`

  return (
    <Link
      href={`/specialist/${id}`}
      className="group block rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-emerald-200 hover:shadow-md dark:border-gray-600 dark:bg-slate-800"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
          {avatar ? (
            <img src={avatar} alt={displayName} className="h-full w-full rounded-full object-cover" />
          ) : (
            displayName.charAt(0)
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-700 transition-colors">
            {displayName}
          </h3>
          {title && (
            <p className="mt-0.5 text-sm text-gray-600">{title}</p>
          )}
          {wilaya && (
            <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3 w-3" />
              {wilaya}
            </p>
          )}
        </div>

        {/* Rating */}
        {ratingCount > 0 && (
          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-amber-700">{ratingAvg.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Bio */}
      {bio && (
        <p className="mt-3 line-clamp-2 text-sm text-gray-600">{bio}</p>
      )}

      {/* Competencies */}
      {competencies && competencies.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {competencies.slice(0, 3).map((comp, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {comp.specialty?.nameArabic || comp.category?.nameArabic || comp.specialty?.name || comp.category?.name}
            </Badge>
          ))}
          {competencies.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{competencies.length - 3}
            </Badge>
          )}
        </div>
      )}
    </Link>
  )
}
