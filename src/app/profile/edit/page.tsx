'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProfileEditForm } from '@/components/profile/edit-form'
import { CertificationsManager } from '@/components/profile/certifications-manager'
import { CompetenciesManager } from '@/components/profile/competencies-manager'
import { Loader2 } from 'lucide-react'

export default function ProfileEditPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [data, setData] = useState<{
    certifications: any[]
    competencies: any[]
    specialties: any[]
  } | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check auth first
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(async (authData) => {
        if (!authData?.user) {
          router.push('/auth/login')
          return
        }

        // Fetch edit page data
        const res = await fetch('/api/profile/edit-data')
        const json = await res.json()
        if (!json.success) {
          setError(true)
          return
        }
        setUser(json.user)
        setData({
          certifications: json.certifications,
          competencies: json.competencies,
          specialties: json.specialties,
        })
      })
      .catch(() => {
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
        <p className="mt-4 text-gray-500">جاري التحميل...</p>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 text-center">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8">
          <h2 className="text-xl font-bold text-red-700">حدث خطأ</h2>
          <p className="mt-2 text-red-600">عذراً، حدث خطأ أثناء تحميل صفحة التعديل.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">تعديل الملف الشخصي</h1>
        <p className="mt-1 text-gray-600">قم بتحديث معلوماتك المهنية والشخصية</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-8 space-y-8">
        <ProfileEditForm user={user} />
        <hr className="border-gray-200" />
        {data && (
          <CompetenciesManager competencies={data.competencies} specialties={data.specialties} />
        )}
        <hr className="border-gray-200" />
        {data && (
          <CertificationsManager certifications={data.certifications} />
        )}
      </div>
    </div>
  )
}
