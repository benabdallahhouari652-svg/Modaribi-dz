import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/dal'
import { ComposeForm } from '@/components/messages/compose-form'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type SearchParams = Promise<{ to?: string }>

export default async function ComposePage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams
  const preselectedId = searchParams.to
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect('/auth/login')

  const specialists = await prisma.user.findMany({
    where: { id: { not: currentUser.id }, isActive: true, role: { in: ['SPECIALIST', 'ADMIN', 'SUPER_ADMIN'] } },
    select: { id: true, name: true, nameArabic: true, title: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">رسالة جديدة</h1>
          <p className="mt-1 text-sm text-gray-600">أرسل رسالة إلى مختص</p>
        </div>
        <Link href="/messages">
          <Button variant="outline" className="gap-2">
            <ArrowRight className="h-4 w-4" />
            العودة
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-8">
        <ComposeForm specialists={specialists} preselectedId={preselectedId} />
      </div>
    </div>
  )
}
