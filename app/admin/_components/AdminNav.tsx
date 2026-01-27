'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Lightbulb, Trash2, Users } from 'lucide-react'

import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/admin', label: '仪表板', icon: LayoutDashboard },
  { href: '/admin/ideas', label: '梦境管理', icon: Lightbulb },
  { href: '/admin/users', label: '用户管理', icon: Users },
  { href: '/admin/trash', label: '回收站', icon: Trash2 },
] as const

export default function AdminNav({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <nav aria-label="管理员导航" className={cn('flex flex-wrap gap-2', className)}>
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              active
                ? 'border-brand-dark bg-brand-dark text-white'
                : 'border-brand-dark bg-brand-surface text-brand-dark hover:bg-gray-50'
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

