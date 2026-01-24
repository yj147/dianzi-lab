'use client'

import * as React from 'react'

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

  const icon = isDark === null ? 'contrast' : isDark ? 'light_mode' : 'dark_mode'
  const label =
    isDark === null ? '切换主题' : isDark ? '切换为亮色模式' : '切换为暗色模式'

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={handleToggle}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-full border border-white/50 bg-white/40 text-slate-700 shadow-sm backdrop-blur-md transition-colors duration-200 hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10',
        className
      )}
    >
      <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
        {icon}
      </span>
    </button>
  )
}
