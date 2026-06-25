import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/dal'
import { WebinarForm } from '@/components/webinars/webinar-form'
import { deleteWebinarAction } from '@/lib/actions/webinars'
import { Calendar, Eye, Trash2, ArrowLeft, Video, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AdminWebinarsPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
    redirect('/auth/login')
  }

  const webinars = await prisma.webinar.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الندوات</h1>
          <p className="mt-1 text-sm text-gray-600">إضافة وحذف الندوات والدروس</p>
        </div>
        <Link href="/webinars">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            عرض الندوات
          </Button>
        </Link>
      </div>

      {/* Add Form */}
      <div className="mb-8">
        <WebinarForm />
      </div>

      {/* Webinars List */}
      <div className="space-y-3">
        {webinars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Monitor className="h-12 w-12 text-gray-300" />
            <h2 className="mt-4 text-lg font-medium text-gray-900">لا توجد ندوات</h2>
            <p className="mt-2 text-sm text-gray-600">أضف أول ندوة الآن</p>
          </div>
        ) : (
          webinars.map((w) => (
            <div key={w.id} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Video className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">{w.titleArabic || w.title}</p>
                  {w.isLive && (
                    <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                      مباشر
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                  <span>🎤 {w.presenter}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(w.date).toLocaleDateString('ar')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {w.views}
                  </span>
                </div>
              </div>
              <form action={deleteWebinarAction}>
                <input type="hidden" name="id" value={w.id} />
                <Button type="submit" variant="outline" size="sm" className="gap-1 text-red-500 border-red-200 hover:bg-red-50"
                  onClick={(e: any) => { if (!confirm('حذف هذه الندوة؟')) e.preventDefault() }}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
