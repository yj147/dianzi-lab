'use client'

import { logout } from '@/lib/auth-actions'

export default function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
    >
      退出登录
    </button>
  )
}
