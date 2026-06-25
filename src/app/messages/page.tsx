import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/dal'
import { markAsRead } from '@/lib/actions/messages'
import { MessageSquare, Reply, Trash2, Mail, MailOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function InboxPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect('/auth/login')

  const messages = await prisma.message.findMany({
    where: { receiverId: currentUser.id },
    include: {
      sender: { select: { id: true, name: true, nameArabic: true, avatar: true, title: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const unreadCount = messages.filter(m => !m.isRead).length

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">صندوق الوارد</h1>
          <p className="mt-1 text-sm text-gray-600">
            {unreadCount > 0 ? `📬 ${unreadCount} رسالة غير مقروءة` : '📭 لا توجد رسائل جديدة'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/messages/compose">
            <Button className="gap-2">
              <MessageSquare className="h-4 w-4" />
              رسالة جديدة
            </Button>
          </Link>
          <Link href="/messages/sent">
            <Button variant="outline" className="gap-2">
              <Mail className="h-4 w-4" />
              المرسلة
            </Button>
          </Link>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <MailOpen className="h-12 w-12 text-gray-300" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">صندوق الوارد فارغ</h2>
          <p className="mt-2 text-sm text-gray-600">لم تستلم أي رسائل بعد</p>
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
            <form key={msg.id} action={markAsRead.bind(null, msg.id)}>
              <button type="submit" className="w-full text-right">
                <div
                  className={`rounded-xl border p-4 transition-all hover:shadow-md ${
                    !msg.isRead
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        !msg.isRead ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {(msg.sender.nameArabic || msg.sender.name).charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`${!msg.isRead ? 'font-bold' : 'font-medium'} text-gray-900`}>
                          {msg.sender.nameArabic || msg.sender.name}
                        </p>
                        <span className="shrink-0 text-xs text-gray-500">
                          {new Intl.DateTimeFormat('ar', {
                            year: 'numeric', month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          }).format(new Date(msg.createdAt))}
                        </span>
                      </div>
                      {msg.sender.title && (
                        <p className="text-xs text-gray-500 mt-0.5">{msg.sender.title}</p>
                      )}
                      <p className={`mt-1 line-clamp-2 text-sm ${!msg.isRead ? 'text-gray-800' : 'text-gray-600'}`}>
                        {msg.content}
                      </p>
                    </div>
                    {!msg.isRead && (
                      <div className="flex h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
                    )}
                  </div>
                </div>
              </button>
            </form>
          ))}
        </div>
      )}
    </div>
  )
}
