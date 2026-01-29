import type { Metadata } from 'next'
import Link from 'next/link'
import { Lightbulb, Rocket, Shield, User } from 'lucide-react'

import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: '登录 | Bambi Lab Idea',
}

type LoginPageProps = {
  searchParams?: {
    callbackUrl?: string
  }
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const callbackUrl =
    typeof searchParams?.callbackUrl === 'string'
      ? searchParams.callbackUrl
      : undefined

  return (
    <div className="w-full max-w-6xl xl:max-w-7xl">
      <div className="grid overflow-hidden rounded-2xl border-2 border-brand-dark bg-surface shadow-solid-lg animate-fade-in-up motion-reduce:animate-none lg:grid-cols-2">
        <div className="hidden bg-brand-primary p-12 lg:block">
          <div className="flex h-full flex-col justify-between text-white">
            <div>
              <h2 className="mb-4 font-heading text-3xl font-bold lg:text-4xl">
                欢迎回来
              </h2>
              <p className="text-lg text-white/80 lg:text-xl">
                登录您的账户，继续探索创新的无限可能。
              </p>
            </div>

            <div className="space-y-6 lg:space-y-8">
              <div
                className="flex items-start gap-4 animate-fade-in-up motion-reduce:animate-none"
                style={{
                  animationDelay: '200ms',
                  animationFillMode: 'backwards',
                }}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface/20">
                  <Lightbulb size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-heading font-bold">创意孵化</h3>
                  <p className="text-sm text-white/70">
                    将您的想法转化为可行的产品方案
                  </p>
                </div>
              </div>

              <div
                className="flex items-start gap-4 animate-fade-in-up motion-reduce:animate-none"
                style={{
                  animationDelay: '350ms',
                  animationFillMode: 'backwards',
                }}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface/20">
                  <Rocket size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-heading font-bold">快速交付</h3>
                  <p className="text-sm text-white/70">
                    专业团队助您快速实现产品上线
                  </p>
                </div>
              </div>

              <div
                className="flex items-start gap-4 animate-fade-in-up motion-reduce:animate-none"
                style={{
                  animationDelay: '500ms',
                  animationFillMode: 'backwards',
                }}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface/20">
                  <Shield size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-heading font-bold">知识产权保护</h3>
                  <p className="text-sm text-white/70">
                    100% 代码归属权，零股权出让
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-white/60">
              &copy; {new Date().getFullYear()} Bambi Lab Idea
            </p>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex-1 p-8 lg:p-10">
            <div className="mb-8 flex justify-center lg:justify-start">
              <div className="flex size-14 items-center justify-center rounded-xl bg-brand-primary text-white shadow-solid-sm">
                <User size={26} aria-hidden="true" />
              </div>
            </div>

            <h1 className="mb-2 text-center font-heading text-3xl font-bold text-brand-dark lg:text-left">
              欢迎回到实验室
            </h1>
            <p className="mb-10 text-center text-base text-muted-foreground lg:text-left">
              登录以继续你的创意之旅
            </p>

            <LoginForm callbackUrl={callbackUrl} />
          </div>

          <div className="border-t border-border bg-muted p-5 text-center text-sm text-muted-foreground">
            还没有账号？{' '}
            <Link
              href="/register"
              className="font-bold text-primary hover:underline"
            >
              立即注册
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
