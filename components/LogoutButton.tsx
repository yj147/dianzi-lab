'use client'

import { logout } from '@/lib/auth-actions'
import { cn } from '@/lib/utils'
import { LogOut } from 'lucide-react'

type LogoutButtonProps = {
  className?: string
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  return (
    <button
      type="button"
      onClick={() => void logout()}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/40 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-md transition-colors hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff]',
        className
      )}
    >
      <LogOut className="size-4" aria-hidden="true" />
      退出登录
    </button>
  )
}
