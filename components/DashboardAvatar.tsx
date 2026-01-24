'use client'

import Link from 'next/link'
import { logout } from '@/lib/auth-actions'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DashboardAvatarProps {
  displayName: string
}

export default function DashboardAvatar({ displayName }: DashboardAvatarProps) {
  const handleLogout = async () => {
    await logout()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="用户菜单"
          className="group relative flex items-center justify-center focus-visible:outline-none"
        >
          <div
            className="blob-shape-avatar absolute -inset-1 rounded-full bg-gradient-to-r from-lavender-200 to-mint-200 blur opacity-0 transition-opacity duration-200 group-hover:opacity-75 motion-reduce:transition-none"
            aria-hidden="true"
          />
          <div className="relative flex size-10 items-center justify-center rounded-full border-2 border-white bg-white shadow-md">
            <span className="material-symbols-outlined text-2xl text-lavender-300" aria-hidden="true">
              face_3
            </span>
          </div>
          <div
            className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-mint-400"
            aria-hidden="true"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="w-64 rounded-[1.5rem] border border-white/60 bg-white/90 p-2 shadow-[0_20px_60px_-10px_rgba(180,160,255,0.3)] backdrop-blur-xl"
      >
        <div className="mb-2 flex items-center gap-3 border-b border-slate-100 px-3 pb-3 pt-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-lavender-50">
            <span className="material-symbols-outlined text-2xl text-lavender-300" aria-hidden="true">
              face_3
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-800">{displayName}</p>
            <p className="text-xs font-medium text-slate-400">幻象编织者</p>
          </div>
        </div>

        <DropdownMenuItem asChild>
          <Link
            href="/dashboard"
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-lavender-50"
          >
            <span className="material-symbols-outlined text-lg text-lavender-300 transition-colors group-hover:text-coral-400" aria-hidden="true">
              dashboard
            </span>
            <span className="text-sm font-medium text-slate-600 transition-colors group-hover:text-coral-400">
              我的工坊
            </span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/favorites"
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-lavender-50"
          >
            <span className="material-symbols-outlined text-lg text-lavender-300 transition-colors group-hover:text-coral-400" aria-hidden="true">
              collections_bookmark
            </span>
            <span className="text-sm font-medium text-slate-600 transition-colors group-hover:text-coral-400">
              收藏灵感
            </span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/settings"
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-lavender-50"
          >
            <span className="material-symbols-outlined text-lg text-lavender-300 transition-colors group-hover:text-coral-400" aria-hidden="true">
              settings
            </span>
            <span className="text-sm font-medium text-slate-600 transition-colors group-hover:text-coral-400">
              账号设置
            </span>
          </Link>
        </DropdownMenuItem>

        <div className="mt-2 border-t border-slate-100 pt-2">
          <button
            type="button"
            className="group flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
            onClick={() => void handleLogout()}
          >
            <span
              className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1"
              aria-hidden="true"
            >
              logout
            </span>
            <span className="text-sm font-bold">离开工坊</span>
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
