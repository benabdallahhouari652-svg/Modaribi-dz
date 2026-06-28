'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Bell, MessageCircle, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

type Notification = {
  id: string
  content: string
  createdAt: string
  isRead: boolean
  sender: {
    id: string
    name: string
    nameArabic: string | null
    avatar: string | null
    title: string | null
  }
}

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [messages, setMessages] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications')
      if (!res.ok) return
      const data = await res.json()
      setUnreadCount(data.unreadCount || 0)
      setMessages(data.messages || [])
    } catch {
      // silent fail
    }
  }, [])

  // Initial fetch + polling every 30s
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    const diffHour = Math.floor(diffMs / 3600000)
    const diffDay = Math.floor(diffMs / 86400000)

    if (diffMin < 1) return 'الآن'
    if (diffMin < 60) return `منذ ${diffMin} د`
    if (diffHour < 24) return `منذ ${diffHour} س`
    if (diffDay < 7) return `منذ ${diffDay} ي`
    return new Intl.DateTimeFormat('ar', { month: 'short', day: 'numeric' }).format(date)
  }

  const truncateContent = (text: string, maxLen = 60) => {
    return text.length > maxLen ? text.slice(0, maxLen) + '…' : text
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center rounded-lg p-2 text-gray-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-emerald-400"
        aria-label="الإشعارات"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 origin-top-left rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 dark:border-gray-700 dark:bg-slate-800 z-50">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">الإشعارات</h3>
            <Link
              href="/messages"
              onClick={() => setIsOpen(false)}
              className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              عرض الكل
            </Link>
          </div>

          {/* Messages List */}
          <div className="max-h-72 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <Mail className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">لا توجد إشعارات</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {messages.map((msg) => (
                  <Link
                    key={msg.id}
                    href="/messages"
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50',
                      !msg.isRead && 'bg-emerald-50/50 dark:bg-emerald-900/10'
                    )}
                  >
                    {/* Avatar */}
                    <div
                      className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                        !msg.isRead
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      )}
                    >
                      {(msg.sender.nameArabic || msg.sender.name).charAt(0)}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={cn(
                            'text-sm truncate',
                            !msg.isRead
                              ? 'font-bold text-gray-900 dark:text-white'
                              : 'font-medium text-gray-700 dark:text-gray-300'
                          )}
                        >
                          {msg.sender.nameArabic || msg.sender.name}
                        </p>
                        <span className="shrink-0 text-[10px] text-gray-400">
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                      {msg.sender.title && (
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">{msg.sender.title}</p>
                      )}
                      <p
                        className={cn(
                          'mt-0.5 text-xs leading-relaxed line-clamp-2',
                          !msg.isRead
                            ? 'text-gray-700 dark:text-gray-300'
                            : 'text-gray-500 dark:text-gray-400'
                        )}
                      >
                        {truncateContent(msg.content)}
                      </p>
                    </div>

                    {/* Unread dot */}
                    {!msg.isRead && (
                      <div className="mt-1.5 flex h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-4 py-2.5 dark:border-gray-700">
            <Link
              href="/messages/compose"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              رسالة جديدة
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
