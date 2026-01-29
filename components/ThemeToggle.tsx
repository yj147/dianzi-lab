'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'

import { cn } from '@/lib/utils'

const STORAGE_KEY = 'theme'
const DARK_CLASS = 'dark'

type ThemeMode = 'light' | 'dark' | 'auto'

function getRoot(): HTMLElement | null {
  return typeof document === 'undefined' ? null : document.documentElement
}

function getTimeBasedDark(): boolean {
  const hour = new Date().getHours()
  return hour < 6 || hour >= 18
}

function applyTheme(mode: ThemeMode) {
  const root = getRoot()
  if (!root) return

  const isDark = mode === 'dark' || (mode === 'auto' && getTimeBasedDark())
  root.classList.toggle(DARK_CLASS, isDark)
  root.style.colorScheme = isDark ? 'dark' : 'light'

  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    // ignore
  }
}

function getStoredMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'auto')
      return stored
  } catch {
    // ignore
  }
  return 'auto'
}

export default function ThemeToggle({ className }: { className?: string }) {
  const [mode, setMode] = React.useState<ThemeMode | null>(null)

  React.useEffect(() => {
    setMode(getStoredMode())
  }, [])

  const handleToggle = () => {
    if (mode === 'auto') {
      // 从 auto 切换到相反的固定主题
      const next: ThemeMode = getTimeBasedDark() ? 'light' : 'dark'
      applyTheme(next)
      setMode(next)
    } else {
      // 从固定主题切换回 auto
      applyTheme('auto')
      setMode('auto')
    }
  }

  const resolvedMode = mode ?? 'auto'
  const isDark =
    resolvedMode === 'dark' || (resolvedMode === 'auto' && getTimeBasedDark())
  const Icon = isDark ? Moon : Sun

  return (
    <button
      type="button"
      aria-label="切换主题"
      onClick={handleToggle}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors duration-200 hover:bg-muted/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none',
        className
      )}
    >
      <Icon size={18} aria-hidden="true" />
    </button>
  )
}
