'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'

import { cn } from '@/lib/utils'

const STORAGE_KEY = 'theme'
const DARK_CLASS = 'dark'

type ThemeMode = 'light' | 'dark' | 'system'

function getRoot(): HTMLElement | null {
  return typeof document === 'undefined' ? null : document.documentElement
}

function getSystemDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(mode: ThemeMode) {
  const root = getRoot()
  if (!root) return

  const isDark = mode === 'dark' || (mode === 'system' && getSystemDark())
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
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {
    // ignore
  }
  return 'system'
}

export default function ThemeToggle({ className }: { className?: string }) {
  const [mode, setMode] = React.useState<ThemeMode | null>(null)

  React.useEffect(() => {
    setMode(getStoredMode())
  }, [])

  React.useEffect(() => {
    if (mode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('system')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [mode])

  const handleToggle = () => {
    const next: ThemeMode = mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light'
    applyTheme(next)
    setMode(next)
  }

  const labels: Record<ThemeMode, string> = {
    light: '切换主题',
    dark: '切换主题',
    system: '切换主题',
  }
  const label = mode ? labels[mode] : '切换主题'
  const resolvedMode = mode ?? 'system'
  const isDark = resolvedMode === 'dark' || (resolvedMode === 'system' && getSystemDark())
  const Icon = isDark ? Moon : Sun

  return (
    <button
      type="button"
      aria-label={label}
      title={undefined}
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
