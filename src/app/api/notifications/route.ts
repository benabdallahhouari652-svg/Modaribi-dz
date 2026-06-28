import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return NextResponse.json({ unreadCount: 0, messages: [] })
    }

    const [unreadCount, messages] = await Promise.all([
      prisma.message.count({
        where: { receiverId: session.userId, isRead: false },
      }),
      prisma.message.findMany({
        where: { receiverId: session.userId },
        select: {
          id: true,
          content: true,
          createdAt: true,
          isRead: true,
          sender: {
            select: {
              id: true,
              name: true,
              nameArabic: true,
              avatar: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ])

    return NextResponse.json({ unreadCount, messages })
  } catch (error) {
    console.error('Notifications error:', error)
    return NextResponse.json({ unreadCount: 0, messages: [] })
  }
}
