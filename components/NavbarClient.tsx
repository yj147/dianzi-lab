'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { logout } from '@/lib/auth-actions'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface NavbarClientProps {
  isLoggedIn: boolean
  userEmail?: string
}

function getDisplayName(userEmail?: string): string {
  if (!userEmail) return '造梦者'
  const local = userEmail.split('@')[0]?.trim()
  if (!local) return '造梦者'
  return `造梦者·${local}`
}

export default function NavbarClient({ isLoggedIn, userEmail }: NavbarClientProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false)
  const pathname = usePathname()
  const displayName = getDisplayName(userEmail)

  const handleLogout = async () => {
    await logout()
  }

  // 判断链接是否为当前页面
  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/'
    if (href.startsWith('/#')) return pathname === '/'
    return pathname.startsWith(href)
  }

  const navLinks = isLoggedIn
    ? [
        { name: '幻象大厅', href: '/' },
        { name: '造梦工具', href: '/#tools' },
        { name: '我的梦境', href: '/dashboard', icon: 'cloud_queue', emphasized: true },
      ]
    : [
        { name: '幻象大厅', href: '/' },
        { name: '造梦工具', href: '/#tools' },
        { name: '关于我们', href: '/#about' },
      ]

  return (
    <>
      {isLoggedIn && isUserMenuOpen ? (
        <div
          className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-sm transition-all duration-500 motion-reduce:transition-none"
          aria-hidden="true"
        />
      ) : null}

      <nav
        className={cn(
          'z-50 px-8',
          isLoggedIn
            ? 'sticky top-0 border-b border-white/20 bg-white/10 py-4 backdrop-blur-md'
            : 'relative py-6'
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <div className="blob-shape flex size-12 items-center justify-center bg-lavender-200 text-coral-400 shadow-inner transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-3xl" aria-hidden="true">
                auto_fix_high
              </span>
            </div>
            <span className="font-script text-3xl text-slate-800">奇迹工坊</span>
          </Link>

          <div
            className={cn(
              'hidden items-center gap-10 rounded-full border border-white/50 bg-white/50 px-8 py-3 backdrop-blur-md md:flex',
              isLoggedIn && 'shadow-sm'
            )}
          >
            {navLinks.map((link) => {
              const isEmphasized = 'emphasized' in link && link.emphasized
              const isActive = isActiveLink(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'font-medium transition-colors focus-visible:outline-none focus-visible:text-coral-400',
                    isEmphasized
                      ? 'flex items-center gap-1 font-bold'
                      : 'hover:text-coral-400',
                    isActive ? 'text-coral-400' : isEmphasized ? 'text-lavender-400' : ''
                  )}
                >
                  {isEmphasized ? (
                    <>
                      <span className="material-symbols-outlined text-lg" aria-hidden="true">
                        {link.icon}
                      </span>
                      {link.name}
                    </>
                  ) : (
                    link.name
                  )}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  aria-label="通知"
                  className="group relative rounded-full p-2 transition-colors hover:bg-lavender-100"
                >
                  <span
                    className="material-symbols-outlined text-2xl text-slate-600 transition-colors group-hover:text-coral-400"
                    aria-hidden="true"
                  >
                    notifications
                  </span>
                  <span className="absolute right-2.5 top-2 flex h-3 w-3" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral-400 opacity-75 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-coral-500" />
                  </span>
                </button>

                <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <button type="button" aria-label="用户菜单" className="group relative flex items-center justify-center">
                      <div
                        className="blob-shape-avatar absolute -inset-1 rounded-full bg-gradient-to-r from-lavender-300 to-mint-200 blur opacity-75 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:transition-none"
                        aria-hidden="true"
                      />
                      <div className="relative flex size-10 items-center justify-center rounded-full border-2 border-white bg-white shadow-lg">
                        <span className="material-symbols-outlined mt-1 text-3xl text-slate-400" aria-hidden="true">
                          face_3
                        </span>
                      </div>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    sideOffset={16}
                    className="relative w-80 rounded-[2rem] border border-white/60 bg-white/80 p-3 shadow-[0_20px_60px_-10px_rgba(180,160,255,0.3)] ring-1 ring-white/50 backdrop-blur-2xl"
                  >
                    <div
                      className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-coral-400/10 blur-3xl"
                      aria-hidden="true"
                    />
                    <div
                      className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-lavender-300/10 blur-3xl"
                      aria-hidden="true"
                    />

                    <div className="mb-2 flex items-center gap-4 border-b border-slate-100/60 p-4 pb-4">
                      <div className="relative">
                        <div className="flex size-14 items-center justify-center rounded-full border-2 border-lavender-100 bg-white shadow-sm">
                          <span className="material-symbols-outlined mt-1 text-4xl text-slate-400" aria-hidden="true">
                            face_3
                          </span>
                        </div>
                        <div
                          className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-white bg-mint-200"
                          aria-hidden="true"
                        >
                          <span
                            className="material-symbols-outlined text-[10px] font-bold text-emerald-600"
                            aria-hidden="true"
                          >
                            check
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-lg font-bold leading-tight text-slate-800">{displayName}</p>
                        <div className="mt-1 flex items-center gap-1">
                          <span className="rounded-full border border-lavender-200 bg-gradient-to-r from-lavender-100 to-white px-2 py-0.5 text-[11px] font-bold text-lavender-500 shadow-sm">
                            初级造梦家
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard"
                          className="group flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 transition-all hover:bg-white/60 hover:shadow-sm"
                        >
                          <div className="flex size-9 items-center justify-center rounded-full bg-lavender-50 transition-colors group-hover:bg-coral-50">
                            <span
                              className="material-symbols-outlined text-[20px] text-lavender-300 transition-colors group-hover:text-coral-400"
                              aria-hidden="true"
                            >
                              cloud_queue
                            </span>
                          </div>
                          <span className="font-medium text-slate-600 transition-colors group-hover:text-coral-400">
                            我的梦境
                          </span>
                          <span
                            className="material-symbols-outlined ml-auto text-sm text-slate-300 transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          >
                            chevron_right
                          </span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard/favorites"
                          className="group flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 transition-all hover:bg-white/60 hover:shadow-sm"
                        >
                          <div className="flex size-9 items-center justify-center rounded-full bg-lavender-50 transition-colors group-hover:bg-coral-50">
                            <span
                              className="material-symbols-outlined text-[20px] text-lavender-300 transition-colors group-hover:text-coral-400"
                              aria-hidden="true"
                            >
                              diamond
                            </span>
                          </div>
                          <span className="font-medium text-slate-600 transition-colors group-hover:text-coral-400">
                            灵感收藏
                          </span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard/settings"
                          className="group flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 transition-all hover:bg-white/60 hover:shadow-sm"
                        >
                          <div className="flex size-9 items-center justify-center rounded-full bg-lavender-50 transition-colors group-hover:bg-coral-50">
                            <span
                              className="material-symbols-outlined text-[20px] text-lavender-300 transition-colors group-hover:text-coral-400"
                              aria-hidden="true"
                            >
                              manage_accounts
                            </span>
                          </div>
                          <span className="font-medium text-slate-600 transition-colors group-hover:text-coral-400">
                            账号设置
                          </span>
                        </Link>
                      </DropdownMenuItem>
                    </div>

                    <div className="mt-3 border-t border-slate-100/60 pt-3">
                      <button
                        type="button"
                        className="group flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500 hover:shadow-inner"
                        onClick={() => void handleLogout()}
                      >
                        <span
                          className="material-symbols-outlined transition-transform group-hover:-translate-x-1"
                          aria-hidden="true"
                        >
                          logout
                        </span>
                        <span className="text-sm font-bold">离开工坊</span>
                      </button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link
                  href="/submit"
                  className="flex items-center gap-2 rounded-full bg-coral-400 px-6 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(251,113,133,0.35)] transition-all hover:scale-105 hover:bg-coral-500 hover:shadow-[0_10px_25px_rgba(251,113,133,0.45)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff]"
                >
                  <span className="material-symbols-outlined text-xl" aria-hidden="true">
                    palette
                  </span>
                  开始编织
                </Link>
              </div>
            ) : (
              <>
                <Link href="/login" className="px-4 font-semibold text-slate-600 transition-colors hover:text-coral-400 focus-visible:outline-none focus-visible:text-coral-400">
                  潜入
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-coral-400 px-7 py-3 font-bold text-white shadow-lg shadow-coral-400/20 transition-transform hover:scale-105 hover:bg-coral-500 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2"
                >
                  开启梦境
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
