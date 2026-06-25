'use client'

import { useState, useRef } from 'react'
import { Plus, Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { addBook } from '@/lib/actions/library'

export function LibraryUploadForm() {
  const [showForm, setShowForm] = useState(false)
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      setMessage({ text: '❌ الرجاء اختيار ملف PDF فقط', type: 'error' })
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      setMessage({ text: '❌ حجم الملف يجب أن يكون أقل من 20 ميغابايت', type: 'error' })
      return
    }

    setUploadingPdf(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'cv')
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) {
        setPdfUrl(data.url)
        setMessage({ text: '✅ تم رفع الملف بنجاح', type: 'success' })
      }
    } catch (err) {
      setMessage({ text: '❌ فشل رفع الملف', type: 'error' })
    } finally {
      setUploadingPdf(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!pdfUrl) {
      setMessage({ text: '❌ الرجاء رفع ملف PDF أولاً', type: 'error' })
      return
    }

    const formData = new FormData(e.currentTarget)
    formData.append('fileUrl', pdfUrl)
    const result = await addBook(formData)
    if (result?.success) {
      setShowForm(false)
      setPdfUrl('')
      setMessage({ text: result.message || '✅ تمت الإضافة', type: 'success' })
      setTimeout(() => setMessage(null), 4000)
    } else {
      setMessage({ text: result?.message || '❌ فشلت الإضافة', type: 'error' })
    }
  }

  return (
    <div>
      {/* Message */}
      {message && (
        <div className={`mb-4 rounded-lg p-3 text-sm flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة كتاب PDF
        </Button>
      ) : (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">إضافة كتاب جديد</h3>
            <button onClick={() => setShowForm(false)} className="rounded-lg p-1 hover:bg-emerald-100">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* PDF Upload */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">ملف PDF *</label>
              <div className="flex items-center gap-3">
                <input type="file" ref={pdfInputRef} accept=".pdf,application/pdf" onChange={handlePdfUpload} className="hidden" />
                <Button type="button" variant="outline" size="sm" onClick={() => pdfInputRef.current?.click()} disabled={uploadingPdf} className="gap-1">
                  <Upload className="h-4 w-4" />
                  {uploadingPdf ? 'جاري الرفع...' : 'رفع PDF'}
                </Button>
                {pdfUrl && <span className="text-xs text-emerald-600">✅ تم الرفع</span>}
              </div>
            </div>

            {/* Title */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">عنوان الكتاب *</label>
                <Input name="title" placeholder="مثلاً: دليل التدريب الرياضي" required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">العنوان (عربي)</label>
                <Input name="titleArabic" placeholder="عنوان الكتاب بالعربية" />
              </div>
            </div>

            {/* Author & Description */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">المؤلف</label>
              <Input name="author" placeholder="اسم المؤلف (اختياري)" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">وصف قصير</label>
              <textarea
                name="description"
                rows={3}
                placeholder="وصف مختصر عن محتوى الكتاب..."
                className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="gap-1">
                <CheckCircle className="h-4 w-4" />
                نشر الكتاب
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="gap-1">
                <X className="h-4 w-4" />
                إلغاء
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
