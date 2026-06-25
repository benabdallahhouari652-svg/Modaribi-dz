'use client'

import { useActionState, useState, useRef } from 'react'
import { updateProfile } from '@/lib/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, ArrowRight, Upload, Camera, FileText, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'
import type { User } from '@prisma/client'
import { WILAYAS } from '@/lib/constants'

type ProfileEditFormProps = {
  user: User
}

export function ProfileEditForm({ user }: ProfileEditFormProps) {
  const [state, action, pending] = useActionState(updateProfile, undefined)
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || '')
  const [cvPreview, setCvPreview] = useState(user.cv || '')
  const [uploading, setUploading] = useState(false)
  const [uploadingCv, setUploadingCv] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cvFileInputRef = useRef<HTMLInputElement>(null)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string)
    reader.readAsDataURL(file)

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'image')
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) {
        setAvatarPreview(data.url)
        const avatarInput = document.getElementById('avatar') as HTMLInputElement
        if (avatarInput) avatarInput.value = data.url
      }
    } catch (err) {
      console.error('Upload failed', err)
    } finally {
      setUploading(false)
    }
  }

  async function handleCvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingCv(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'cv')
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) {
        const cvInput = document.getElementById('cvFile') as HTMLInputElement
        if (cvInput) cvInput.value = data.url
        setCvPreview(data.url)
      }
    } catch (err) {
      console.error('CV upload failed', err)
    } finally {
      setUploadingCv(false)
    }
  }

  return (
    <form action={action} className="space-y-6">
      {state?.message && !state?.errors && (
        <div className={`rounded-lg p-3 text-sm ${state.success ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {state.message}
        </div>
      )}

      {/* Basic Info */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">المعلومات الأساسية</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Photo Upload */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">الصورة الشخصية</label>
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700 border-2 border-emerald-200">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="الصورة" className="h-full w-full object-cover rounded-full" />
                ) : (
                  <Camera className="h-8 w-8 text-emerald-400" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="gap-1">
                  <Upload className="h-4 w-4" />
                  {uploading ? 'جاري الرفع...' : 'اختيار صورة'}
                </Button>
                <p className="text-xs text-gray-500">أو أدخل رابط الصورة مباشرة</p>
                <Input id="avatar" name="avatar" defaultValue={user.avatar || ''} placeholder="https://example.com/photo.jpg" dir="ltr" onChange={(e) => setAvatarPreview(e.target.value)} />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">الاسم (فرنسي)</label>
            <Input id="name" name="name" defaultValue={user.name} required />
            {state?.errors?.name && <p className="mt-1 text-xs text-red-600">{state.errors.name[0]}</p>}
          </div>
          <div>
            <label htmlFor="surname" className="mb-1.5 block text-sm font-medium text-gray-700">اللقب (الاسم العائلي)</label>
            <Input id="surname" name="surname" defaultValue={user.surname || ''} placeholder="مثلاً: بن عبد الله" />
          </div>
          <div>
            <label htmlFor="nameArabic" className="mb-1.5 block text-sm font-medium text-gray-700">الاسم الكامل (عربي)</label>
            <Input id="nameArabic" name="nameArabic" defaultValue={user.nameArabic || ''} />
          </div>
          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-gray-700">المسمى المهني</label>
            <Input id="title" name="title" defaultValue={user.title || ''} placeholder="مثلاً: مدرب كرة قدم معتمد" />
          </div>
          <div>
            <label htmlFor="experienceYears" className="mb-1.5 block text-sm font-medium text-gray-700">سنوات الخبرة</label>
            <Input id="experienceYears" name="experienceYears" type="number" defaultValue={user.experienceYears || ''} />
          </div>
          <div>
            <label htmlFor="gender" className="mb-1.5 block text-sm font-medium text-gray-700">الجنس</label>
            <select
              id="gender"
              name="gender"
              defaultValue={user.gender || ''}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">اختر</option>
              <option value="MALE">ذكر</option>
              <option value="FEMALE">أنثى</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">معلومات التواصل</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700">رقم الهاتف</label>
            <Input id="phone" name="phone" defaultValue={user.phone || ''} placeholder="+213-XXX-XXX-XXX" dir="ltr" />
          </div>
          <div>
            <label htmlFor="whatsapp" className="mb-1.5 block text-sm font-medium text-gray-700">رقم واتساب</label>
            <Input id="whatsapp" name="whatsapp" defaultValue={user.whatsapp || ''} placeholder="213XXXXXXXXX" dir="ltr" />
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">الموقع</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="wilaya" className="mb-1.5 block text-sm font-medium text-gray-700">الولاية</label>
            <select
              id="wilaya"
              name="wilaya"
              defaultValue={user.wilaya || ''}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">اختر الولاية</option>
              {WILAYAS.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="municipality" className="mb-1.5 block text-sm font-medium text-gray-700">البلدية</label>
            <Input id="municipality" name="municipality" defaultValue={user.municipality || ''} />
          </div>
        </div>
      </div>

      {/* Bio */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">نبذة تعريفية</h2>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={user.bio || ''}
          placeholder="اكتب نبذة عن خبراتك ومؤهلاتك..."
          className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        />
      </div>

      {/* Full CV (Text) */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">السيرة الذاتية (نص)</h2>
        <textarea
          id="cv"
          name="cv"
          rows={8}
          defaultValue={user.cv || ''}
          placeholder="اكتب سيرتك الذاتية كاملة..."
          className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        />
      </div>

      {/* Full CV (File Upload) */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">السيرة الذاتية (ملف PDF)</h2>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <FileText className="h-7 w-7" />
          </div>
          <div className="flex-1 space-y-2">
            <input
              type="file"
              ref={cvFileInputRef}
              accept=".pdf,application/pdf"
              onChange={handleCvUpload}
              className="hidden"
            />
            <input id="cvFile" name="cvFile" type="hidden" defaultValue={user.cv?.startsWith('/') ? user.cv : ''} />
            <Button type="button" variant="outline" size="sm" onClick={() => cvFileInputRef.current?.click()} disabled={uploadingCv} className="gap-1">
              <Upload className="h-4 w-4" />
              {uploadingCv ? 'جاري الرفع...' : 'رفع ملف PDF'}
            </Button>
            <p className="text-xs text-gray-500">أقصى حجم 10 ميغابايت - صيغة PDF فقط</p>
            {user.cv?.startsWith('/') && (
              <div className="flex items-center gap-1 text-xs text-emerald-600">
                <LinkIcon className="h-3 w-3" />
                <span>ملف موجود حالياً</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Professional Info */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">معلومات مهنية إضافية</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="languages" className="mb-1.5 block text-sm font-medium text-gray-700">اللغات</label>
            <Input id="languages" name="languages" defaultValue={user.languages || ''} placeholder="عربية، فرنسية، إنجليزية" />
          </div>
          <div>
            <label htmlFor="ageGroupTarget" className="mb-1.5 block text-sm font-medium text-gray-700">الفئة العمرية المستهدفة</label>
            <select
              id="ageGroupTarget"
              name="ageGroupTarget"
              defaultValue={user.ageGroupTarget || ''}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">الكل</option>
              <option value="الأطفال">الأطفال</option>
              <option value="الشباب">الشباب</option>
              <option value="الكبار">الكبار</option>
              <option value="كل الفئات">كل الفئات</option>
            </select>
          </div>
          <div>
            <label htmlFor="trainingType" className="mb-1.5 block text-sm font-medium text-gray-700">نوع التدريب</label>
            <select
              id="trainingType"
              name="trainingType"
              defaultValue={user.trainingType || ''}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">اختر</option>
              <option value="INDIVIDUAL">فردي</option>
              <option value="GROUP">جماعي</option>
              <option value="BOTH">كلاهما</option>
            </select>
          </div>
          <div>
            <label htmlFor="maritalStatus" className="mb-1.5 block text-sm font-medium text-gray-700">الحالة العائلية</label>
            <select
              id="maritalStatus"
              name="maritalStatus"
              defaultValue={user.maritalStatus || ''}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">اختر</option>
              <option value="SINGLE">أعزب</option>
              <option value="MARRIED">متزوج</option>
              <option value="DIVORCED">مطلق</option>
              <option value="WIDOWED">أرمل</option>
            </select>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">التوفر</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isContracted" value="true" defaultChecked={user.isContracted} className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
            <span className="text-sm text-gray-700">أنا مرتبط بعقد مع فريق/نادي</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="acceptsRemoteWork" value="true" defaultChecked={user.acceptsRemoteWork} className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
            <span className="text-sm text-gray-700">أقبل العمل عن بعد</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="acceptsTravel" value="true" defaultChecked={user.acceptsTravel} className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
            <span className="text-sm text-gray-700">أستطيع التنقل للعمل خارج الولاية</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="acceptsWorkOutside" value="true" defaultChecked={user.acceptsWorkOutside} className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
            <span className="text-sm text-gray-700">أقبل العمل خارج الوطن</span>
          </label>
        </div>
      </div>

      {/* Social */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">روابط التواصل الاجتماعي</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="website" className="mb-1.5 block text-sm font-medium text-gray-700">الموقع الإلكتروني</label>
            <Input id="website" name="website" defaultValue={user.website || ''} dir="ltr" />
          </div>
          <div>
            <label htmlFor="facebook" className="mb-1.5 block text-sm font-medium text-gray-700">فيسبوك</label>
            <Input id="facebook" name="facebook" defaultValue={user.facebook || ''} dir="ltr" />
          </div>
          <div>
            <label htmlFor="instagram" className="mb-1.5 block text-sm font-medium text-gray-700">انستغرام</label>
            <Input id="instagram" name="instagram" defaultValue={user.instagram || ''} dir="ltr" />
          </div>
          <div>
            <label htmlFor="linkedin" className="mb-1.5 block text-sm font-medium text-gray-700">لينكد إن</label>
            <Input id="linkedin" name="linkedin" defaultValue={user.linkedin || ''} dir="ltr" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <Button type="submit" disabled={pending} className="gap-2">
          <Save className="h-4 w-4" />
          {pending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </Button>
        <Link href="/profile">
          <Button type="button" variant="outline" className="gap-2">
            <ArrowRight className="h-4 w-4" />
            رجوع
          </Button>
        </Link>
      </div>
    </form>
  )
}
