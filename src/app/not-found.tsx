import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-bold text-emerald-200">404</div>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">الصفحة غير موجودة</h1>
      <p className="mt-2 text-gray-600">عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها</p>
      <div className="mt-8 flex gap-3">
        <Link href="/">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            الرئيسية
          </Button>
        </Link>
        <Link href="/search">
          <Button variant="outline" className="gap-2">
            <Search className="h-4 w-4" />
            البحث
          </Button>
        </Link>
      </div>
    </div>
  )
}
