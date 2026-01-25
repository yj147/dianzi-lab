'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { logout } from '@/lib/auth-actions'
import { cn } from '@/lib/utils'
import ThemeToggle from '@/components/ThemeToggle'

const NAV_ITEMS = [
  { href: '/admin', label: '控制台', exact: true, activeIcon: 'space_dashboard' },
  { href: '/admin/ideas', label: '梦境管理', exact: false, activeIcon: 'admin_panel_settings' },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
          <span className="font-script text-2xl text-slate-800 dark:text-slate-100">奇迹工坊</span>
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
          {/* 汉堡按钮（移动端） */}
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full bg-white/60 md:hidden dark:bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={mobileMenuOpen}
          >
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-200" aria-hidden="true">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          <ThemeToggle />

          <button
            type="button"
            className="flex items-center gap-2 pr-4 border-r border-slate-200 dark:border-white/10"
            aria-label="通知"
          >
            <span className="material-symbols-outlined text-lavender-400" aria-hidden="true">
              notifications
            </span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full border-2 border-white shadow-sm bg-white/60 flex items-center justify-center text-sm font-bold text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-100">
              {getAvatarText(userEmail)}
            </div>
            <span className="hidden font-display text-slate-700 dark:text-slate-200 sm:block">
              {userEmail}
            </span>
          </div>

          <button
            type="button"
            onClick={() => void logout()}
            className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-coral-50 hover:text-coral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:text-slate-200 dark:hover:bg-white/10 sm:flex"
            aria-label="退出登录"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              logout
            </span>
            <span className="hidden lg:inline">退出登录</span>
          </button>
        </div>
      </div>

      {/* 移动端菜单面板 */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full mx-4 mt-2 md:hidden">
          <div className="glass-panel space-y-2 rounded-[1.5rem] p-4">
            {NAV_ITEMS.map((item) => {
              const isActive = isActivePath(pathname, item.href, item.exact)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-4 py-3 transition-colors',
                    isActive ? 'bg-white font-bold text-coral-500' : 'text-slate-600 hover:bg-white/50'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {item.activeIcon}
                  </span>
                  {item.label}
                </Link>
              )
            })}

            <div className="border-t border-slate-100 pt-2">
              <button
                type="button"
                onClick={() => void logout()}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-500 transition-colors hover:bg-coral-50 hover:text-coral-500"
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  logout
                </span>
                退出登录
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
