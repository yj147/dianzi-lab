import type { Metadata } from 'next'
import Link from 'next/link'
import { UserPlus } from 'lucide-react'

import RegisterForm from './RegisterForm'

export const metadata: Metadata = {
  title: '注册 | 点子 Lab',
}

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md">
      <div className="overflow-hidden rounded-2xl border-2 border-brand-dark bg-white shadow-solid-lg">
        <div className="border-b-2 border-brand-dark/10 p-8">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-brand-primary text-white shadow-solid-sm">
              <UserPlus size={22} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h1 className="font-heading text-2xl font-bold text-brand-dark">成为孵化师</h1>
              <p className="mt-1 text-sm text-gray-600">提交你的第一个伟大想法</p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1">
            <Link
              href="/login"
              className="flex-1 rounded-md px-4 py-2 text-center text-sm font-bold text-gray-600 transition-colors hover:bg-white/60 hover:text-brand-dark"
            >
              登录
            </Link>
            <Link
              href="/register"
              className="flex-1 rounded-md bg-white px-4 py-2 text-center text-sm font-bold text-brand-dark shadow-sm"
            >
              注册
            </Link>
          </div>
        </div>

        <div className="p-8">
          <RegisterForm />
        </div>

        <div className="border-t border-gray-100 bg-gray-50 p-4 text-center text-sm text-gray-600">
          已经有账号？{' '}
          <Link href="/login" className="font-bold text-brand-primary hover:underline">
            直接登录
          </Link>
        </div>
      </div>
    </div>
  )
}
