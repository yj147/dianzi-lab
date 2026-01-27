import type { Metadata } from 'next'
import Link from 'next/link'
import { User } from 'lucide-react'

import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: '登录 | 点子 Lab',
}

type LoginPageProps = {
  searchParams?: {
    callbackUrl?: string
  }
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const callbackUrl = typeof searchParams?.callbackUrl === 'string' ? searchParams.callbackUrl : undefined

  return (
    <div className="w-full max-w-md">
      <div className="overflow-hidden rounded-2xl border-2 border-brand-dark bg-white shadow-solid-lg animate-fade-in-up motion-reduce:animate-none">
        <div className="p-8 pb-6">
          <div className="mb-6 flex justify-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-brand-primary text-white shadow-solid-sm">
              <User size={22} aria-hidden="true" />
            </div>
          </div>

          <h1 className="mb-1 text-center font-heading text-2xl font-bold text-brand-dark">欢迎回到实验室</h1>
          <p className="mb-8 text-center text-sm text-gray-500">登录以继续你的创意之旅</p>

          <LoginForm callbackUrl={callbackUrl} />
        </div>

        <div className="border-t border-gray-100 bg-gray-50 p-4 text-center text-sm text-gray-600">
          还没有账号？{' '}
          <Link href="/register" className="font-bold text-brand-primary hover:underline">
            立即注册
          </Link>
        </div>
      </div>
    </div>
  )
}
