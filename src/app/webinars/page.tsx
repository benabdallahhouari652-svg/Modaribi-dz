import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Video, Calendar, Clock, Eye, Users, Play, Plus, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/dal'

export default async function WebinarsPage() {
  const [webinars, currentUser] = await Promise.all([
    prisma.webinar.findMany({
      where: { isPublished: true },
      orderBy: [{ isLive: 'desc' }, { date: 'desc' }],
      take: 50,
    }),
    getCurrentUser(),
  ])

  const isAdmin = currentUser?.role === 'SUPER_ADMIN'
  const liveWebinars = webinars.filter(w => w.isLive)
  const upcoming = webinars.filter(w => !w.isLive && new Date(w.date) > new Date())
  const past = webinars.filter(w => !w.isLive && new Date(w.date) <= new Date())

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <Monitor className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold sm:text-4xl">الندوات والدروس</h1>
            <p className="mt-3 text-lg text-blue-100">
              ندوات مباشرة ودروس مسجلة مع نخبة من المختصين والخبراء الرياضيين
            </p>
          </div>
        </div>
      </section>

      {/* Admin Button */}
      {isAdmin && (
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <Link href="/admin/webinars">
              <Button size="sm" variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                إدارة الندوات
              </Button>
            </Link>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">

        {/* Live Now */}
        {liveWebinars.length > 0 && (
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-3 w-3 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-xl font-bold text-gray-900">مباشر الآن</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {liveWebinars.map((w) => (
                <WebinarCard key={w.id} webinar={w} isLive />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div>
            <h2 className="mb-6 text-xl font-bold text-gray-900">الندوات القادمة</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((w) => (
                <WebinarCard key={w.id} webinar={w} />
              ))}
            </div>
          </div>
        )}

        {/* Past Recordings */}
        {past.length > 0 && (
          <div>
            <h2 className="mb-6 text-xl font-bold text-gray-900">الندوات المسجلة</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((w) => (
                <WebinarCard key={w.id} webinar={w} isPast />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {webinars.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
              <Video className="h-12 w-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">قريباً</h2>
            <p className="mx-auto mt-3 max-w-md text-gray-600">
              سيتم قريباً إطلاق قسم الندوات والدروس مع نخبة من المختصين والخبراء الرياضيين.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

function WebinarCard({ webinar, isLive, isPast }: { webinar: any; isLive?: boolean; isPast?: boolean }) {
  const date = new Date(webinar.date)
  const title = webinar.titleArabic || webinar.title
  const link = isPast && webinar.videoUrl ? webinar.videoUrl : `/webinars/${webinar.id}`

  return (
    <div className={`group rounded-xl border bg-white transition-all hover:shadow-md overflow-hidden ${
      isLive ? 'border-red-300 ring-1 ring-red-200' : 'border-gray-200'
    }`}>
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center overflow-hidden">
        {webinar.thumbnail ? (
          <img src={webinar.thumbnail} alt={title} className="h-full w-full object-cover" />
        ) : (
          <Video className="h-12 w-12 text-blue-300" />
        )}
        {isLive && (
          <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            مباشر
          </span>
        )}
        {isPast && webinar.videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-blue-600">
              <Play className="h-6 w-6 fill-current" />
            </div>
          </div>
        )}
        <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
          {webinar.duration ? `${webinar.duration} د` : 'مسجل'}
        </span>
      </div>

      <div className="p-5">
        <Link href={link} target={isPast && webinar.videoUrl ? '_blank' : undefined}>
          <h3 className={`font-semibold line-clamp-2 transition-colors group-hover:text-blue-700 ${
            isLive ? 'text-red-700' : 'text-gray-900'
          }`}>
            {title}
          </h3>
        </Link>

        {webinar.category && (
          <span className="mt-2 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
            {webinar.category}
          </span>
        )}

        <p className="mt-2 line-clamp-2 text-sm text-gray-600">{webinar.description}</p>

        <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Intl.DateTimeFormat('ar', { year: 'numeric', month: 'short', day: 'numeric' }).format(date)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {webinar.views}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-xs font-medium text-gray-700">{webinar.presenter}</span>
          {isPast && webinar.videoUrl ? (
            <a href={webinar.videoUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="gap-1 text-xs h-8">
                <Play className="h-3 w-3" />
                مشاهدة
              </Button>
            </a>
          ) : webinar.zoomLink ? (
            <a href={webinar.zoomLink} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="gap-1 text-xs h-8">
                <Users className="h-3 w-3" />
                حضور
              </Button>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}
