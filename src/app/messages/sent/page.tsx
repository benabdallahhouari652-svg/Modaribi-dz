import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/dal'
import { MessageSquare, Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function SentPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect('/auth/login')

  const messages = await prisma.message.findMany({
    where: { senderId: currentUser.id },
    include: {
      receiver: { select: { id: true, name: true, nameArabic: true, title: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الرسائل المرسلة</h1>
          <p className="mt-1 text-sm text-gray-600">{messages.length} رسالة</p>
        </div>
        <div className="flex gap-2">
          <Link href="/messages">
            <Button variant="outline" className="gap-2">
              <ArrowRight className="h-4 w-4" />
              صندوق الوارد
            </Button>
          </Link>
          <Link href="/messages/compose">
            <Button className="gap-2">
              <MessageSquare className="h-4 w-4" />
              رسالة جديدة
            </Button>
          </Link>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Mail className="h-12 w-12 text-gray-300" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">لم ترسل أي رسائل بعد</h2>
          <p className="mt-2 text-sm text-gray-600">جميع الرسائل التي ترسلها ستظهر هنا</p>
          <Link href="/messages/compose">
            <Button className="mt-4 gap-2">
              <MessageSquare className="h-4 w-4" />
              أرسل رسالة
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg) => (
            <div key={msg.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                  {(msg.receiver.nameArabic || msg.receiver.name).charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-gray-900">
                      إلى: {msg.receiver.nameArabic || msg.receiver.name}
                    </p>
                    <span className="shrink-0 text-xs text-gray-500">
                      {new Intl.DateTimeFormat('ar', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      }).format(new Date(msg.createdAt))}
                    </span>
                  </div>
                  {msg.receiver.title && (
                    <p className="text-xs text-gray-500 mt-0.5">{msg.receiver.title}</p>
                  )}
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">{msg.content}</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                      msg.isRead ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {msg.isRead ? '✅ تمت القراءة' : '⏳ لم تقرأ بعد'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
