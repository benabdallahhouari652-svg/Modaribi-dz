'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Search, User, LogOut, BookOpen, Lightbulb, Newspaper, MessageCircle, Mail, Monitor, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DarkModeToggle } from '@/components/theme/dark-mode-toggle'

const navLinks = [
  { href: '/', label: 'الرئيسية', icon: null },
  { href: '/search', label: 'البحث', icon: Search },
  { href: '/categories', label: 'التصنيفات', icon: null },
  { href: '/library', label: 'المكتبة', icon: BookOpen },
  { href: '/innovations', label: 'الابتكار', icon: Lightbulb },
  { href: '/webinars', label: 'الندوات', icon: Monitor },
  { href: '/magazine', label: 'المجلة', icon: Newspaper },
  { href: '/messages', label: 'الرسائل', icon: Mail },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; surname?: string; email: string; role: string; avatar?: string; title?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data?.user) setUser(data.user)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-emerald-200 bg-white p-0.5">
              <img src="/logo.png" alt="مدربي DZ" className="h-full w-full object-contain rounded-full" />
            </div>
            <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">مدربي</span>
            <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">DZ</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-emerald-400"
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Theme Toggle */}
          <div className="hidden md:flex md:items-center">
            <DarkModeToggle />
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex md:items-center md:gap-2">
            {loading ? null : user ? (
              <>
                <Link href="/profile/edit">
                  <Button variant="default" size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
                    <Pencil className="h-4 w-4" />
                    تعديل
                  </Button>
                </Link>
                <Link href="/api/auth/logout">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-red-500 hover:text-red-700 hover:bg-red-50">
                    <LogOut className="h-4 w-4" />
                    خروج
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <User className="h-4 w-4" />
                    دخول
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="gap-1.5">
                    تسجيل
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn('md:hidden', isOpen ? 'block' : 'hidden')}>
        <div className="space-y-1 border-t border-gray-200 bg-white px-4 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-emerald-400"
            >
              {link.icon && <link.icon className="h-4 w-4" />}
              {link.label}
            </Link>
          ))}
          <hr className="my-2 border-gray-200 dark:border-gray-700" />
          <div className="flex items-center justify-between px-2 py-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">المظهر</span>
            <DarkModeToggle />
          </div>
          {user ? (
            <>
              <Link href="/profile/edit" onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50">
                <User className="h-4 w-4" />
                تعديل الملف الشخصي
              </Link>
              <Link href="/api/auth/logout" onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
                <LogOut className="h-4 w-4" />
                خروج
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login" onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50">
                <User className="h-4 w-4" />
                دخول
              </Link>
              <Link href="/auth/signup" onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700">
                تسجيل جديد
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
