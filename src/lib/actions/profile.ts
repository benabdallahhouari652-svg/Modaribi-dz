'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifySession } from '@/lib/dal'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const ProfileSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين').trim(),
  surname: z.string().optional().nullable(),
  nameArabic: z.string().optional().nullable(),
  avatar: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  cv: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  wilaya: z.string().optional().nullable(),
  municipality: z.string().optional().nullable(),
  experienceYears: z.coerce.number().optional().nullable(),
  languages: z.string().optional().nullable(),
  ageGroupTarget: z.string().optional().nullable(),
  trainingType: z.enum(['INDIVIDUAL', 'GROUP', 'BOTH']).optional().nullable(),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']).optional().nullable(),
  gender: z.enum(['MALE', 'FEMALE']).optional().nullable(),
  isContracted: z.boolean().optional(),
  acceptsRemoteWork: z.boolean().optional(),
  acceptsTravel: z.boolean().optional(),
  acceptsWorkOutside: z.boolean().optional(),
  website: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  youtube: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
})

export type ProfileFormState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
} | undefined

export async function updateProfile(prevState: ProfileFormState, formData: FormData) {
  const session = await verifySession()
  if (!session?.userId) {
    return { message: 'يجب تسجيل الدخول أولاً', success: false }
  }

  // Helper: empty string → null (clear field), non-empty → value
  const val = (key: string) => {
    const v = formData.get(key)
    if (v === '' || v === null) return null
    return v as string
  }

  const rawData: Record<string, any> = {
    name: formData.get('name'),
    surname: val('surname'),
    nameArabic: val('nameArabic'),
    avatar: val('avatar'),
    title: val('title'),
    bio: val('bio'),
    cv: val('cv'),
    phone: val('phone'),
    whatsapp: val('whatsapp'),
    wilaya: val('wilaya'),
    municipality: val('municipality'),
    experienceYears: val('experienceYears') !== null ? Number(val('experienceYears')) || null : null,
    languages: val('languages'),
    ageGroupTarget: val('ageGroupTarget'),
    trainingType: val('trainingType'),
    maritalStatus: val('maritalStatus'),
    gender: val('gender'),
    isContracted: formData.get('isContracted') === 'true',
    acceptsRemoteWork: formData.get('acceptsRemoteWork') === 'true',
    acceptsTravel: formData.get('acceptsTravel') === 'true',
    acceptsWorkOutside: formData.get('acceptsWorkOutside') === 'true',
    website: val('website'),
    facebook: val('facebook'),
    instagram: val('instagram'),
    youtube: val('youtube'),
    linkedin: val('linkedin'),
  }

  // Keep null values so Prisma sets them to null (clearing the field in DB)
  // Only filter out undefined values (which don't occur in structured form data)
  const cleanData = Object.fromEntries(
    Object.entries(rawData).filter(([_, v]) => v !== undefined)
  )

  const validatedFields = ProfileSchema.safeParse(cleanData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'يرجى تصحيح الأخطاء في الحقول',
      success: false,
    }
  }

  try {
    await prisma.user.update({
      where: { id: session.userId },
      data: validatedFields.data,
    })
    revalidatePath('/profile')
    revalidatePath('/profile/edit')
    return { success: true, message: '✅ تم تحديث الملف الشخصي بنجاح' }
  } catch (error) {
    console.error('Update profile error:', error)
    return { message: '❌ حدث خطأ أثناء تحديث الملف الشخصي', success: false }
  }
}

export async function addCertificationAction(formData: FormData) {
  const session = await verifySession()
  if (!session?.userId) {
    return { success: false, message: 'يجب تسجيل الدخول أولاً' }
  }

  const title = formData.get('title') as string
  const type = formData.get('type') as string
  const issuer = formData.get('issuer') as string
  const year = formData.get('year') as string
  const description = formData.get('description') as string

  if (!title?.trim()) {
    return { success: false, message: 'اسم الشهادة مطلوب' }
  }

  try {
    await prisma.certification.create({
      data: {
        title: title.trim(),
        type: type as any,
        issuer: issuer || null,
        year: year ? parseInt(year) : null,
        description: description || null,
        userId: session.userId,
      },
    })
    revalidatePath('/profile')
    revalidatePath('/profile/edit')
    return { success: true, message: '✅ تم إضافة الشهادة بنجاح' }
  } catch (error) {
    console.error('Add certification error:', error)
    return { success: false, message: '❌ حدث خطأ أثناء إضافة الشهادة' }
  }
}

export async function deleteCertificationAction(id: string) {
  const session = await verifySession()
  if (!session?.userId) {
    return { success: false, message: 'يجب تسجيل الدخول أولاً' }
  }

  try {
    await prisma.certification.delete({ where: { id } })
    revalidatePath('/profile')
    revalidatePath('/profile/edit')
    return { success: true }
  } catch (error) {
    return { success: false, message: '❌ حدث خطأ أثناء حذف الشهادة' }
  }
}

// ========== إدارة الاختصاصات (الكفاءات) ==========

export async function addCompetencyAction(formData: FormData) {
  const session = await verifySession()
  if (!session?.userId) {
    return { success: false, message: 'يجب تسجيل الدخول أولاً' }
  }

  const specialtyId = formData.get('specialtyId') as string
  const description = formData.get('description') as string

  if (!specialtyId) {
    return { success: false, message: 'الرجاء اختيار الاختصاص' }
  }

  try {
    const existing = await prisma.competency.findUnique({
      where: { userId_specialtyId: { userId: session.userId, specialtyId } },
    })
    if (existing) {
      return { success: false, message: '⚠️ هذا الاختصاص مضاف مسبقاً' }
    }

    const specialty = await prisma.specialty.findUnique({ where: { id: specialtyId } })

    await prisma.competency.create({
      data: {
        userId: session.userId,
        specialtyId,
        categoryId: specialty?.categoryId || null,
        description: description || null,
      },
    })
    revalidatePath('/profile')
    revalidatePath('/profile/edit')
    return { success: true, message: '✅ تم إضافة الاختصاص بنجاح' }
  } catch (error) {
    console.error('Add competency error:', error)
    return { success: false, message: '❌ حدث خطأ أثناء إضافة الاختصاص' }
  }
}

export async function deleteCompetencyAction(id: string) {
  const session = await verifySession()
  if (!session?.userId) {
    return { success: false, message: 'يجب تسجيل الدخول أولاً' }
  }

  try {
    await prisma.competency.delete({ where: { id } })
    revalidatePath('/profile')
    revalidatePath('/profile/edit')
    return { success: true }
  } catch (error) {
    return { success: false, message: '❌ حدث خطأ أثناء حذف الاختصاص' }
  }
}

export async function toggleMainCompetencyAction(id: string, isMain: boolean) {
  const session = await verifySession()
  if (!session?.userId) return { success: false }

  try {
    if (isMain) {
      await prisma.competency.updateMany({
        where: { userId: session.userId, isMain: true },
        data: { isMain: false },
      })
    }
    await prisma.competency.update({
      where: { id },
      data: { isMain },
    })
    revalidatePath('/profile')
    revalidatePath('/profile/edit')
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
