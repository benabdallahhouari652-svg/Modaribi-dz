'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function ProfileEditError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
        <h2 className="mt-4 text-xl font-bold text-red-700">حدث خطأ غير متوقع</h2>
        <p className="mt-2 text-red-600">
          عذراً، حدث خطأ أثناء تحميل الصفحة. يرجى المحاولة مرة أخرى.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <RefreshCw className="h-4 w-4" />
            إعادة المحاولة
          </button>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            الرجوع للبروفيل
          </Link>
        </div>
      </div>
    </div>
  )
}
