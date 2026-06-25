'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifySession } from '@/lib/dal'
import { revalidatePath } from 'next/cache'

const WebinarSchema = z.object({
  title: z.string().min(3, 'العنوان يجب أن يكون 3 أحرف على الأقل'),
  titleArabic: z.string().optional(),
  description: z.string().min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل'),
  presenter: z.string().min(3, 'اسم المقدم مطلوب'),
  presenterBio: z.string().optional(),
  date: z.string().min(1, 'التاريخ مطلوب'),
  duration: z.coerce.number().optional(),
  zoomLink: z.string().optional(),
  videoUrl: z.string().optional(),
  thumbnail: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  isLive: z.boolean().optional(),
  maxAttendees: z.coerce.number().optional(),
})

export type WebinarFormState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
} | undefined

export async function createWebinar(prevState: WebinarFormState, formData: FormData) {
  const session = await verifySession()
  if (!session?.userId || session.role !== 'SUPER_ADMIN') {
    return { message: '❌ غير مصرح لك بهذا الإجراء', success: false }
  }

  const validated = WebinarSchema.safeParse({
    title: formData.get('title'),
    titleArabic: formData.get('titleArabic') || undefined,
    description: formData.get('description'),
    presenter: formData.get('presenter'),
    presenterBio: formData.get('presenterBio') || undefined,
    date: formData.get('date'),
    duration: formData.get('duration') || undefined,
    zoomLink: formData.get('zoomLink') || undefined,
    videoUrl: formData.get('videoUrl') || undefined,
    thumbnail: formData.get('thumbnail') || undefined,
    category: formData.get('category') || undefined,
    tags: formData.get('tags') || undefined,
    isLive: formData.get('isLive') === 'true',
    maxAttendees: formData.get('maxAttendees') || undefined,
  })

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'يرجى تصحيح الأخطاء',
      success: false,
    }
  }

  try {
    await prisma.webinar.create({
      data: {
        ...validated.data,
        date: new Date(validated.data.date),
        createdById: session.userId,
      },
    })
    revalidatePath('/webinars')
    revalidatePath('/admin/webinars')
    return { success: true, message: '✅ تم إنشاء الندوة بنجاح' }
  } catch (error) {
    console.error('Create webinar error:', error)
    return { message: '❌ حدث خطأ أثناء الإنشاء', success: false }
  }
}

export async function deleteWebinar(id: string) {
  const session = await verifySession()
  if (!session?.userId || session.role !== 'SUPER_ADMIN') {
    return { success: false }
  }

  try {
    await prisma.webinar.delete({ where: { id } })
    revalidatePath('/webinars')
    revalidatePath('/admin/webinars')
    return { success: true }
  } catch {
    return { success: false }
  }
}

export async function deleteWebinarAction(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return
  await deleteWebinar(id)
}

export async function incrementViews(id: string) {
  try {
    await prisma.webinar.update({
      where: { id },
      data: { views: { increment: 1 } },
    })
  } catch {
    // silent
  }
}
