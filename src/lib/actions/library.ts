'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifySession } from '@/lib/dal'
import { revalidatePath } from 'next/cache'

export async function addBook(formData: FormData) {
  const session = await verifySession()
  if (!session?.userId) {
    return { success: false, message: '❌ يجب تسجيل الدخول أولاً' }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const fileUrl = formData.get('fileUrl') as string

  if (!title?.trim()) {
    return { success: false, message: '❌ عنوان الكتاب مطلوب' }
  }

  if (!fileUrl) {
    return { success: false, message: '❌ يجب رفع ملف PDF' }
  }

  try {
    await prisma.libraryResource.create({
      data: {
        title: title.trim(),
        titleArabic: formData.get('titleArabic') as string || null,
        description: description || null,
        type: 'BOOK',
        fileUrl,
        author: formData.get('author') as string || null,
        authorId: session.userId,
        isPublished: true,
      },
    })
    revalidatePath('/library')
    return { success: true, message: '✅ تم إضافة الكتاب بنجاح' }
  } catch (error) {
    console.error('Add book error:', error)
    return { success: false, message: '❌ حدث خطأ أثناء الإضافة' }
  }
}

export async function deleteBook(id: string) {
  const session = await verifySession()
  if (!session?.userId) return { success: false }

  try {
    const book = await prisma.libraryResource.findUnique({ where: { id } })
    if (!book || (book.authorId !== session.userId && session.role !== 'SUPER_ADMIN')) {
      return { success: false, message: '❌ لا يمكنك حذف هذا الكتاب' }
    }
    await prisma.libraryResource.delete({ where: { id } })
    revalidatePath('/library')
    return { success: true, message: '✅ تم حذف الكتاب' }
  } catch (error) {
    return { success: false, message: '❌ حدث خطأ' }
  }
}
