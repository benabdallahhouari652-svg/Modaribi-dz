'use client'

import { useActionState, useState } from 'react'
import { createWebinar } from '@/lib/actions/webinars'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, X, Video } from 'lucide-react'

export function WebinarForm() {
  const [state, action, pending] = useActionState(createWebinar, undefined)
  const [showForm, setShowForm] = useState(false)

  if (!showForm) {
    return (
      <Button onClick={() => setShowForm(true)} className="gap-2">
        <Video className="h-4 w-4" />
        إضافة ندوة جديدة
      </Button>
    )
  }

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">إضافة ندوة جديدة</h3>
        <button onClick={() => setShowForm(false)} className="rounded-lg p-1 hover:bg-blue-100">
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <form action={action} className="space-y-4">
        {state?.message && !state?.success && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{state.message}</div>
        )}
        {state?.success && (
          <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-600">{state.message}</div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">العنوان *</label>
            <Input name="title" placeholder="بالفرنسية أو الإنجليزية" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">العنوان (عربي)</label>
            <Input name="titleArabic" placeholder="عنوان الندوة بالعربية" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">الوصف *</label>
          <textarea name="description" rows={3} required
            className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="وصف الندوة ومحاورها..."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">اسم المقدم *</label>
            <Input name="presenter" placeholder="الاسم الكامل" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">التاريخ والوقت *</label>
            <Input name="date" type="datetime-local" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">المدة (دقائق)</label>
            <Input name="duration" type="number" placeholder="مثلاً: 60" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">نبذة عن المقدم</label>
          <textarea name="presenterBio" rows={2}
            className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="مؤهلات وخبرات المقدم..."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">رابط Zoom</label>
            <Input name="zoomLink" placeholder="https://zoom.us/j/..." dir="ltr" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">رابط التسجيل (YouTube)</label>
            <Input name="videoUrl" placeholder="https://youtube.com/..." dir="ltr" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">التصنيف</label>
            <select name="category"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">اختر التصنيف</option>
              <option value="تدريب حراس مرمى">🧤 تدريب حراس مرمى</option>
              <option value="تحليل أداء">📊 تحليل أداء</option>
              <option value="تغذية رياضية">🥗 تغذية رياضية</option>
              <option value="إعداد بدني">💪 إعداد بدني</option>
              <option value="تكتيك">📋 تكتيك</option>
              <option value="تطوير ذاتي">🧠 تطوير ذاتي</option>
              <option value="أخرى">📌 أخرى</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">صورة مصغرة</label>
            <Input name="thumbnail" placeholder="رابط الصورة" dir="ltr" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">أقصى عدد للحضور</label>
            <Input name="maxAttendees" type="number" placeholder="مثلاً: 100" />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isLive" value="true" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700">هذه الندوة مباشرة الآن</span>
          </label>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={pending} className="gap-1">
            <Save className="h-4 w-4" />
            {pending ? 'جاري الحفظ...' : 'نشر الندوة'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="gap-1">
            <X className="h-4 w-4" />
            إلغاء
          </Button>
        </div>
      </form>
    </div>
  )
}
