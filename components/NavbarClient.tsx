'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Lightbulb, LogOut, Menu, Shield, User, X } from 'lucide-react'

import { logout } from '@/lib/auth-actions'
import { cn } from '@/lib/utils'
import ThemeToggle from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface NavbarClientProps {
  isLoggedIn: boolean
  userEmail?: string
  userRole?: string
}

function getDisplayName(userEmail?: string): string {
  if (!userEmail) return '用户'
  const local = userEmail.split('@')[0]?.trim()
  return local ? local : '用户'
}

export default function NavbarClient({ isLoggedIn, userEmail, userRole }: NavbarClientProps) {
  const pathname = usePathname()
  const [isNavMenuOpen, setIsNavMenuOpen] = React.useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false)

  const displayName = getDisplayName(userEmail)
  const initial = displayName.slice(0, 1).toUpperCase()

  const handleLogout = async () => {
    await logout()
  }

  // hash 链接不做高亮，只做页面级高亮
  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/'
    if (href.startsWith('/#')) return false
    return pathname.startsWith(href)
  }

  const navLinks = isLoggedIn
    ? [
        { name: '探索', href: '/' },
        { name: '提交点子', href: '/submit' },
        { name: '我的点子', href: '/dashboard' },
        ...(userRole === 'ADMIN' ? [{ name: '管理后台', href: '/admin' }] : []),
      ]
    : [
        { name: '探索', href: '/' },
      ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-border bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-primary text-white shadow-solid-sm transition-colors hover:bg-brand-accent">
            <Lightbulb size={20} strokeWidth={2.5} aria-hidden="true" />
          </div>
          <span className="font-heading text-2xl font-bold text-foreground">
            Bambi<span className="text-brand-primary"> Lab Idea</span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-6">
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    isActive ? 'text-brand-primary' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {link.name}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <div className="hidden items-center gap-4 md:flex">
              {isLoggedIn ? (
                <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-label="用户菜单"
                      className="flex items-center gap-3 rounded-full bg-surface px-3 py-2 shadow-solid-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-solid motion-reduce:transition-none"
                    >
                      <div className="flex size-9 items-center justify-center rounded-full bg-foreground text-sm font-heading font-bold text-background">
                        {initial}
                      </div>
                      <span className="max-w-[160px] truncate text-sm font-bold text-foreground">{displayName}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={12}
                    className="w-72 rounded-xl border-2 border-border bg-surface p-2 shadow-solid"
                  >
                    <DropdownMenuLabel className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-muted-foreground" aria-hidden="true" />
                        <p className="text-sm font-bold text-foreground">{displayName}</p>
                      </div>
                      {userEmail ? (
                        <p className="mt-1 truncate font-mono text-xs text-muted-foreground">{userEmail}</p>
                      ) : null}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {userRole === 'ADMIN' ? (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2 font-bold">
                          <Shield size={16} aria-hidden="true" />
                          管理后台
                        </Link>
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center gap-2 font-bold">
                        <User size={16} aria-hidden="true" />
                        我的点子
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault()
                        void handleLogout()
                      }}
                      className="text-red-600 focus:text-red-600"
                    >
                      <LogOut size={16} aria-hidden="true" />
                      退出登录
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-base font-bold text-foreground transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    登录
                  </Link>
                  <Button asChild>
                    <Link href="/register">加入实验室</Link>
                  </Button>
                </>
              )}
            </div>

            <div className="md:hidden">
              <DropdownMenu open={isNavMenuOpen} onOpenChange={setIsNavMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label={isNavMenuOpen ? '关闭菜单' : '打开菜单'}
                    className="inline-flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
                  >
                    {isNavMenuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={12}
                  className="w-64 rounded-xl border-2 border-border bg-surface p-2 shadow-solid"
                >
                  {isLoggedIn ? (
                    <>
                      <DropdownMenuLabel className="px-3 py-2">
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 items-center justify-center rounded-full bg-foreground text-sm font-heading font-bold text-background">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-foreground">{displayName}</p>
                            {userEmail ? (
                              <p className="truncate font-mono text-xs text-muted-foreground">{userEmail}</p>
                            ) : null}
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                    </>
                  ) : null}
                  {navLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href} className="font-bold" onClick={() => setIsNavMenuOpen(false)}>
                        {link.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  {isLoggedIn ? (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault()
                          setIsNavMenuOpen(false)
                          void handleLogout()
                        }}
                        className="text-red-600 focus:text-red-600"
                      >
                        <LogOut size={16} aria-hidden="true" />
                        退出登录
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/login" className="font-bold" onClick={() => setIsNavMenuOpen(false)}>
                          登录
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/register" className="font-bold" onClick={() => setIsNavMenuOpen(false)}>
                          加入实验室
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
