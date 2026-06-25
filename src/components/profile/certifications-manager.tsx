'use client'

import { useState, useActionState } from 'react'
import { Plus, Trash2, X, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { addCertificationAction, deleteCertificationAction } from '@/lib/actions/profile'

const CERT_TYPES = [
  { value: 'COACHING', label: '🏅 شهادة تدريب' },
  { value: 'ACADEMIC', label: '🎓 شهادة جامعية' },
  { value: 'PROFESSIONAL', label: '📜 شهادة مهنية' },
  { value: 'INTERNATIONAL', label: '🌍 شهادة دولية' },
  { value: 'TRAINING', label: '✨ دورة تكوينية' },
  { value: 'OTHER', label: '📌 أخرى' },
]

type CertDisplay = {
  id: string
  title: string
  type: string
  issuer: string | null
  year: number | null
  description: string | null
}

type CertsProps = {
  certifications: CertDisplay[]
}

export function CertificationsManager({ certifications }: CertsProps) {
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  async function handleSubmit(formData: FormData) {
    const result = await addCertificationAction(formData)
    if (result?.success) {
      setShowForm(false)
      setMessage({ text: result.message || '✅ تمت الإضافة', type: 'success' })
    } else {
      setMessage({ text: result?.message || '❌ فشلت الإضافة', type: 'error' })
    }
    setTimeout(() => setMessage(null), 4000)
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذه الشهادة؟')) return
    const result = await deleteCertificationAction(id)
    if (result?.success) {
      setMessage({ text: '✅ تم الحذف بنجاح', type: 'success' })
    } else {
      setMessage({ text: result?.message || '❌ فشل الحذف', type: 'error' })
    }
    setTimeout(() => setMessage(null), 4000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">الشهادات والدورات التكوينية</h2>
        <Button type="button" size="sm" onClick={() => setShowForm(!showForm)} className="gap-1">
          <Plus className="h-4 w-4" />
          إضافة شهادة
        </Button>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 rounded-lg p-3 text-sm flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <form action={handleSubmit} className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">اسم الشهادة *</label>
              <Input name="title" placeholder="مثلاً: شهادة تدريب كرة قدم" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">نوع الشهادة</label>
              <select name="type" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                {CERT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">سنة الحصول</label>
              <Input name="year" type="number" placeholder="مثلاً: 2020" min={1900} max={2030} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">الجهة المصدرة</label>
              <Input name="issuer" placeholder="مثلاً: الفاف، جامعة الجزائر" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">وصف إضافي (اختياري)</label>
              <textarea name="description" rows={2} className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="أي معلومات إضافية عن الشهادة" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" size="sm" className="gap-1">
              <CheckCircle className="h-4 w-4" />
              حفظ الشهادة
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)} className="gap-1">
              <X className="h-4 w-4" />
              إلغاء
            </Button>
          </div>
        </form>
      )}

      {/* Certifications List */}
      {certifications.length === 0 ? (
        <p className="text-sm text-gray-500">لم يتم إضافة أي شهادة بعد. أضف شهاداتك الآن!</p>
      ) : (
        <div className="space-y-3">
          {certifications.map((cert) => {
            const certType = CERT_TYPES.find((t) => t.value === cert.type)
            return (
              <div key={cert.id} className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 text-sm">
                  {certType?.label?.split(' ')[0] || '📜'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900">{cert.title}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    {certType && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">{certType.label.replace(/^[^\s]+\s/, '')}</span>}
                    {cert.issuer && <span>{cert.issuer}</span>}
                    {cert.year && <span>سنة {cert.year}</span>}
                  </div>
                  {cert.description && <p className="mt-1 text-xs text-gray-600">{cert.description}</p>}
                </div>
                <button type="button" onClick={() => handleDelete(cert.id)} className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="حذف">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
