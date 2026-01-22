'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { logout } from '@/lib/auth-actions'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/admin', label: '仪表板', exact: true, activeIcon: 'space_dashboard' },
  { href: '/admin/ideas', label: '点子管理', exact: false, activeIcon: 'admin_panel_settings' },
  { href: '/admin/users', label: '用户管理', exact: false, activeIcon: 'group' },
  { href: '/admin/trash', label: '垃圾箱', exact: false, activeIcon: 'delete' },
] as const

function isActivePath(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

function getAvatarText(email: string): string {
  const trimmed = email.trim()
  if (!trimmed) return '?'
  return trimmed[0]?.toUpperCase() ?? '?'
}

export default function AdminTopNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()

  return (
    <nav className="relative z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-lavender-200 blob-shape flex items-center justify-center text-coral-400 shadow-inner">
            <span className="material-symbols-outlined text-2xl" aria-hidden="true">
              auto_fix_high
            </span>
          </div>
          <span className="font-script text-2xl text-slate-800">奇迹工坊</span>
        </Link>

        <div className="hidden md:flex items-center bg-white/40 backdrop-blur-md rounded-full px-2 py-1.5 gap-2 border border-white/50 shadow-sm">
          {NAV_ITEMS.map((item) => {
            const isActive = isActivePath(pathname, item.href, item.exact)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-5 py-2 rounded-full text-sm transition-colors',
                  isActive
                    ? 'bg-white text-coral-500 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-coral-400 font-medium'
                )}
              >
                {isActive ? (
                  <span className="material-symbols-outlined align-middle text-lg mr-1" aria-hidden="true">
                    {item.activeIcon}
                  </span>
                ) : null}
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 pr-4 border-r border-slate-200"
            aria-label="通知"
          >
            <span className="material-symbols-outlined text-lavender-400" aria-hidden="true">
              notifications
            </span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full border-2 border-white shadow-sm bg-white/60 flex items-center justify-center text-sm font-bold text-slate-700">
              {getAvatarText(userEmail)}
            </div>
            <span className="hidden font-display text-slate-700 sm:block">{userEmail}</span>
          </div>

          <button
            type="button"
            onClick={() => void logout()}
            className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-coral-50 hover:text-coral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-300 focus-visible:ring-offset-2 sm:flex"
            aria-label="退出登录"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              logout
            </span>
            <span className="hidden lg:inline">退出登录</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
