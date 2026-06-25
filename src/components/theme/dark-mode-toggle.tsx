'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from './theme-provider'
import { Button } from '@/components/ui/button'

export function DarkModeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggle}
      className="gap-1.5 rounded-full"
      title={theme === 'light' ? 'الوضع الليلي' : 'الوضع النهاري'}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  )
}
