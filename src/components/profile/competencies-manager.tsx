'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, X, CheckCircle, AlertCircle, Star, StarOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { addCompetencyAction, deleteCompetencyAction, toggleMainCompetencyAction } from '@/lib/actions/profile'

type Specialty = {
  id: string
  name: string
  nameArabic: string
  slug: string
  icon: string | null
  category?: { nameArabic: string | null; name: string | null } | null
}

type Competency = {
  id: string
  specialty?: { name: string; nameArabic: string } | null
  category?: { name: string; nameArabic: string } | null
  isMain: boolean
  isVerified: boolean
}

type CompetenciesManagerProps = {
  competencies: Competency[]
  specialties: Specialty[]
}

export function CompetenciesManager({ competencies, specialties }: CompetenciesManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  async function handleSubmit(formData: FormData) {
    const result = await addCompetencyAction(formData)
    if (result?.success) {
      setShowForm(false)
      setMessage({ text: result.message || '✅ تمت الإضافة', type: 'success' })
    } else {
      setMessage({ text: result?.message || '❌ فشلت الإضافة', type: 'error' })
    }
    setTimeout(() => setMessage(null), 4000)
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا الاختصاص؟')) return
    const result = await deleteCompetencyAction(id)
    if (result?.success) {
      setMessage({ text: '✅ تم الحذف بنجاح', type: 'success' })
    } else {
      setMessage({ text: result?.message || '❌ فشل الحذف', type: 'error' })
    }
    setTimeout(() => setMessage(null), 4000)
  }

  async function handleToggleMain(id: string, isMain: boolean) {
    await toggleMainCompetencyAction(id, !isMain)
    window.location.reload()
  }

  // Group specialties by category
  const grouped = specialties.reduce((acc: Record<string, Specialty[]>, s) => {
    const catName = s.category?.nameArabic || s.category?.name || 'أخرى'
    if (!acc[catName]) acc[catName] = []
    acc[catName].push(s)
    return acc
  }, {})

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">الاختصاصات والمجالات</h2>
        <Button type="button" size="sm" onClick={() => setShowForm(!showForm)} className="gap-1">
          <Plus className="h-4 w-4" />
          إضافة اختصاص
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
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">الاختصاص *</label>
            <select
              name="specialtyId"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">اختر الاختصاص</option>
              {Object.entries(grouped).map(([catName, specs]) => (
                <optgroup key={catName} label={catName}>
                  {specs.map((s) => (
                    <option key={s.id} value={s.id}>{s.nameArabic || s.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">وصف (اختياري)</label>
            <textarea name="description" rows={2} className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="مثلاً: متخصص في تدريب الفئات العمرية" />
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" size="sm" className="gap-1">
              <CheckCircle className="h-4 w-4" />
              حفظ
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)} className="gap-1">
              <X className="h-4 w-4" />
              إلغاء
            </Button>
          </div>
        </form>
      )}

      {/* Competencies List */}
      {competencies.length === 0 ? (
        <p className="text-sm text-gray-500">لم يتم إضافة اختصاصات بعد. أضف اختصاصاتك الآن!</p>
      ) : (
        <div className="space-y-2">
          {competencies.map((comp) => (
            <div key={comp.id} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
              <CheckCircle className={`h-5 w-5 shrink-0 ${comp.isVerified ? 'text-emerald-500' : 'text-gray-300'}`} />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900">
                  {comp.specialty?.nameArabic || comp.specialty?.name}
                </p>
                {comp.category && (
                  <p className="text-xs text-gray-500">{comp.category.nameArabic || comp.category.name}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleToggleMain(comp.id, comp.isMain)}
                className={`rounded-lg p-1.5 transition-colors ${comp.isMain ? 'text-amber-500 hover:bg-amber-50' : 'text-gray-300 hover:bg-gray-100'}`}
                title={comp.isMain ? 'إلغاء رئيسي' : 'تعيين كرئيسي'}
              >
                {comp.isMain ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(comp.id)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="حذف"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
