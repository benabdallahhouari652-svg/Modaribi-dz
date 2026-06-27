'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, MapPin, Phone, Pencil, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadProfile() {
      try {
        const authRes = await fetch('/api/auth/me')
        const authData = await authRes.json()
        if (!authData?.user) {
          router.push('/auth/login')
          return
        }

        const res = await fetch('/api/profile/data')
        const json = await res.json()
        if (!json.success) {
          setError(json.error || 'فشل تحميل البروفيل')
          return
        }
        if (cancelled) return
        setUser(json.user)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطأ في الاتصال')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadProfile()
    return () => { cancelled = true }
  }, [router])

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
        <p className="mt-4 text-gray-500">جاري التحميل...</p>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h2 className="mt-4 text-xl font-bold text-red-700">حدث خطأ</h2>
          <p className="mt-2 text-red-600">{error || 'عذراً، حدث خطأ'}</p>
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

  const fullProfile = user
  const stats = [
    { label: 'التقييمات', value: fullProfile._count?.reviewsReceived || 0 },
    { label: 'الاختصاصات', value: fullProfile.competencies?.length || 0 },
    { label: 'الموارد', value: fullProfile._count?.libraryResources || 0 },
    { label: 'الابتكارات', value: fullProfile._count?.innovations || 0 },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-gray-200 bg-white p-8">
        <div className="flex items-start gap-6">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700 border-2 border-emerald-200">
            {fullProfile.avatar ? (
              <img src={fullProfile.avatar} alt={fullProfile.name} className="h-full w-full object-cover" />
            ) : (
              fullProfile.nameArabic?.charAt(0) || fullProfile.name.charAt(0)
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {fullProfile.nameArabic || `${fullProfile.surname ? fullProfile.surname + ' ' : ''}${fullProfile.name}`}
            </h1>
            {fullProfile.title && <p className="mt-1 text-gray-600">{fullProfile.title}</p>}
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {fullProfile.email}
              </span>
              {fullProfile.wilaya && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {fullProfile.wilaya}
                </span>
              )}
              {fullProfile.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {fullProfile.phone}
                </span>
              )}
            </div>
          </div>
          <Link href="/profile/edit" className="group relative shrink-0">
            <Button variant="outline" size="sm" className="gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 font-bold">
              <Pencil className="h-4 w-4" />
              ✏️ تعديل الملف
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-4 gap-4 rounded-lg bg-gray-50 p-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl font-bold text-emerald-700">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Edit Profile Link */}
        <div className="mt-6 text-center">
          <Link href="/profile/edit">
            <Button variant="outline" size="sm" className="gap-2 border-emerald-300 text-emerald-700 font-bold">
              <Pencil className="h-4 w-4" />
              ✏️ تعديل الملف الشخصي
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
