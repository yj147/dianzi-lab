'use client'

import * as React from 'react'
import { Contrast, Moon, Sun } from 'lucide-react'

import { cn } from '@/lib/utils'

const STORAGE_KEY = 'theme'
const DARK_CLASS = 'dark'

function getRoot(): HTMLElement | null {
  return typeof document === 'undefined' ? null : document.documentElement
}

function getIsDark(): boolean {
  const root = getRoot()
  return root ? root.classList.contains(DARK_CLASS) : false
}

function applyTheme(isDark: boolean) {
  const root = getRoot()
  if (!root) return

  root.classList.toggle(DARK_CLASS, isDark)
  root.style.colorScheme = isDark ? 'dark' : 'light'

  try {
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light')
  } catch {
    // ignore
  }
}

export default function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    setIsDark(getIsDark())
  }, [])

  const handleToggle = () => {
    const nextIsDark = !getIsDark()
    applyTheme(nextIsDark)
    setIsDark(nextIsDark)
  }

  const label =
    isDark === null ? '切换主题' : isDark ? '切换为亮色模式' : '切换为暗色模式'

  const Icon = isDark === null ? Contrast : isDark ? Sun : Moon

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={handleToggle}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors duration-200 hover:bg-gray-200 hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none',
        className
      )}
    >
      <Icon size={18} aria-hidden="true" />
    </button>
  )
}
