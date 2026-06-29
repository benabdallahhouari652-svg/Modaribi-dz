'use client'

import { useActionState } from 'react'
import { signup, type FormState } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Mail, Lock, UserPlus } from 'lucide-react'

export function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <form action={action} className="space-y-5">
      {state?.message && !state?.success && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
          الاسم الكامل
        </label>
        <div className="relative">
          <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="name"
            name="name"
            placeholder="الاسم والنسب"
            className="pr-10"
          />
        </div>
        {state?.errors?.name && (
          <p className="mt-1 text-xs text-red-600">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
          البريد الإلكتروني
        </label>
        <div className="relative">
          <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="example@email.com"
            className="pr-10"
            dir="ltr"
          />
        </div>
        {state?.errors?.email && (
          <p className="mt-1 text-xs text-red-600">{state.errors.email[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
          كلمة المرور
        </label>
        <div className="relative">
          <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="6 أحرف على الأقل"
            className="pr-10"
            dir="ltr"
          />
        </div>
        {state?.errors?.password && (
          <p className="mt-1 text-xs text-red-600">{state.errors.password[0]}</p>
        )}
      </div>

      <Button type="submit" disabled={pending} className="w-full gap-2">
        <UserPlus className="h-4 w-4" />
        {pending ? 'جاري التسجيل...' : 'إنشاء حساب'}
      </Button>

      <p className="text-center text-xs text-gray-500">
        بالتسجيل أنت توافق على شروط الاستخدام وسياسة الخصوصية
      </p>
    </form>
  )
}
