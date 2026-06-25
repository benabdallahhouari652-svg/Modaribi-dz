'use client'

import { useActionState } from 'react'
import { sendMessage } from '@/lib/actions/messages'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, ArrowRight } from 'lucide-react'
import Link from 'next/link'

type Specialist = {
  id: string
  name: string
  nameArabic: string | null
  title: string | null
}

type ComposeFormProps = {
  specialists: Specialist[]
  preselectedId?: string
}

export function ComposeForm({ specialists, preselectedId }: ComposeFormProps) {
  const [state, action, pending] = useActionState(sendMessage, undefined)

  if (state?.success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
          <Send className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">✅ تم إرسال الرسالة!</h3>
        <p className="mt-2 text-gray-600">سيتم إشعار المستلم برسالتك</p>
        <div className="mt-6 flex gap-3">
          <Link href="/messages">
            <Button variant="outline" className="gap-2">
              <ArrowRight className="h-4 w-4" />
              صندوق الوارد
            </Button>
          </Link>
          <Link href="/messages/compose">
            <Button className="gap-2">
              <Send className="h-4 w-4" />
              رسالة أخرى
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-6">
      {state?.message && !state?.success && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{state.message}</div>
      )}

      <div>
        <label htmlFor="receiverId" className="mb-1.5 block text-sm font-medium text-gray-700">إلى</label>
        <select
          id="receiverId"
          name="receiverId"
          defaultValue={preselectedId || ''}
          required
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">اختر المستلم</option>
          {specialists.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nameArabic || s.name} {s.title ? `- ${s.title}` : ''}
            </option>
          ))}
        </select>
        {state?.errors?.receiverId && (
          <p className="mt-1 text-xs text-red-600">{state.errors.receiverId[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="content" className="mb-1.5 block text-sm font-medium text-gray-700">الرسالة</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          required
          placeholder="اكتب رسالتك هنا..."
          className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        />
        {state?.errors?.content && (
          <p className="mt-1 text-xs text-red-600">{state.errors.content[0]}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={pending} className="gap-2">
          <Send className="h-4 w-4" />
          {pending ? 'جاري الإرسال...' : 'إرسال'}
        </Button>
        <Link href="/messages">
          <Button type="button" variant="outline" className="gap-2">
            <ArrowRight className="h-4 w-4" />
            رجوع
          </Button>
        </Link>
      </div>
    </form>
  )
}
