'use server'

import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createSession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'

const SignupSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين').trim(),
  email: z.string().email('البريد الإلكتروني غير صحيح').trim(),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل').trim(),
})

const LoginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح').trim(),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
})

export type FormState = {
  errors?: {
    name?: string[]
    email?: string[]
    password?: string[]
  }
  message?: string
  success?: boolean
} | undefined

export async function signup(state: FormState, formData: FormData) {
  const validatedFields = SignupSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'يرجى تصحيح الأخطاء في الحقول',
    }
  }

  const { name, email, password } = validatedFields.data

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return { message: 'البريد الإلكتروني مسجل بالفعل', errors: { email: ['البريد الإلكتروني مستخدم مسبقاً'] } }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { name, email, passwordHash: hashedPassword, role: 'SPECIALIST' },
    })

    await createSession(user.id, user.role)
    return { success: true, message: 'OK' }
  } catch (error) {
    return { message: 'حدث خطأ أثناء التسجيل. حاول مرة أخرى.' }
  }
}

export async function login(state: FormState, formData: FormData) {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'يرجى تصحيح الأخطاء في الحقول',
    }
  }

  const { email, password } = validatedFields.data

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.isActive) {
      return { message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return { message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }
    }

    await createSession(user.id, user.role)
    return { success: true, message: 'OK' }
  } catch (error) {
    console.error('Login error:', error)
    return { message: 'حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.' }
  }
}

export async function logout() {
  await deleteSession()
  redirect('/')
}
