import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-600 dark:bg-slate-800">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-emerald-200 bg-white p-0.5">
                <img src="/logo.png" alt="مدربي DZ" className="h-full w-full object-contain rounded-full" />
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-emerald-700 block">مدربي</span>
                <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">DZ</span>
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">تسجيل الدخول</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              مرحباً بعودتك! سجل دخولك للوصول إلى حسابك
            </p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ليس لديك حساب؟{' '}
              <Link href="/auth/signup" className="font-medium text-emerald-600 hover:text-emerald-700">
                سجل الآن
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
