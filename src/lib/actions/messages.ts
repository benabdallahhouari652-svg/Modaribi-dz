'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifySession } from '@/lib/dal'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const MessageSchema = z.object({
  receiverId: z.string().min(1, 'المستلم مطلوب'),
  content: z.string().min(1, 'الرسالة لا يمكن أن تكون فارغة').max(5000, 'الرسالة طويلة جداً'),
})

export type MessageFormState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
} | undefined

export async function sendMessage(prevState: MessageFormState, formData: FormData) {
  const session = await verifySession()
  if (!session?.userId) {
    return { message: 'يجب تسجيل الدخول أولاً', success: false }
  }

  const validated = MessageSchema.safeParse({
    receiverId: formData.get('receiverId'),
    content: formData.get('content'),
  })

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'يرجى تصحيح الأخطاء',
      success: false,
    }
  }

  try {
    await prisma.message.create({
      data: {
        senderId: session.userId,
        receiverId: validated.data.receiverId,
        content: validated.data.content,
      },
    })
    revalidatePath('/messages')
    revalidatePath('/messages/sent')
    return { success: true, message: '✅ تم إرسال الرسالة بنجاح' }
  } catch (error) {
    console.error('Send message error:', error)
    return { message: '❌ حدث خطأ أثناء الإرسال', success: false }
  }
}

export async function markAsRead(messageId: string) {
  const session = await verifySession()
  if (!session?.userId) return

  try {
    await prisma.message.update({
      where: { id: messageId, receiverId: session.userId },
      data: { isRead: true },
    })
    revalidatePath('/messages')
  } catch (error) {
    console.error('Mark as read error:', error)
  }
}

export async function getUnreadCount() {
  const session = await verifySession()
  if (!session?.userId) return 0

  try {
    return await prisma.message.count({
      where: { receiverId: session.userId, isRead: false },
    })
  } catch {
    return 0
  }
}
