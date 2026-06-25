import Link from 'next/link'
import { BookOpen, Lightbulb, Newspaper, Mail, MapPin, Phone } from 'lucide-react'

const footerLinks = {
  الرئيسية: [
    { href: '/search', label: 'البحث عن مختصين' },
    { href: '/categories', label: 'التصنيفات' },
    { href: '/library', label: 'المكتبة الرقمية' },
  ],
  المنصة: [
    { href: '/about', label: 'عن المنصة' },
    { href: '/contact', label: 'اتصل بنا' },
    { href: '/privacy', label: 'سياسة الخصوصية' },
  ],
  الأقسام: [
    { href: '/innovations', label: 'فضاء الابتكار' },
    { href: '/magazine', label: 'مجلة مدربي DZ' },
    { href: '/library', label: 'البحوث والدراسات' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-emerald-200 bg-white p-0.5">
                <img src="/logo.png" alt="مدربي DZ" className="h-full w-full object-contain rounded-full" />
              </div>
              <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">مدربي</span>
              <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">DZ</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed dark:text-gray-400">
              منصة الكفاءات الرياضية والتربوية والعلمية في الجزائر.
              تهدف إلى ربط المختصين بالأندية والأكاديميات وخلق فرص التعاون والتطوير.
            </p>
            <div className="mt-4 flex gap-3">
              <span className="text-2xl">🇩🇿</span>
            </div>
          </div>

          {/* Link Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-200">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 transition-colors hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} مدربي DZ. جميع الحقوق محفوظة.
            </p>
            <p className="text-xs text-gray-500">
              صنع في 🇩🇿 الجزائر
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
