'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const ContactSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  subject: z.string().min(3, 'الموضوع يجب أن يكون على الأقل 3 أحرف'),
  message: z.string().min(10, 'الرسالة يجب أن تكون على الأقل 10 أحرف'),
})

export type ContactFormState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
} | undefined

export async function submitContact(prevState: ContactFormState, formData: FormData) {
  const validated = ContactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  })

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'يرجى تصحيح الأخطاء',
      success: false,
    }
  }

  try {
    await prisma.contactMessage.create({
      data: validated.data,
    })
    return { success: true, message: '✅ تم إرسال رسالتك بنجاح! سنقوم بالرد عليك قريباً.' }
  } catch (error) {
    console.error('Contact error:', error)
    return { message: '❌ حدث خطأ أثناء الإرسال. حاول مرة أخرى.', success: false }
  }
}
