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
      <div className="overflow-hidden rounded-2xl border-2 border-brand-dark bg-white shadow-solid-lg animate-fade-in-up motion-reduce:animate-none">
        <div className="p-8 pb-6">
          <div className="mb-6 flex justify-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-brand-primary text-white shadow-solid-sm">
              <UserPlus size={22} aria-hidden="true" />
            </div>
          </div>

          <h1 className="mb-1 text-center font-heading text-2xl font-bold text-brand-dark">创建账号</h1>
          <p className="mb-8 text-center text-sm text-gray-500">提交你的第一个伟大想法</p>

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
