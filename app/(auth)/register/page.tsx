import type { Metadata } from 'next'
import Link from 'next/link'
import { Code, Sparkles, Target, UserPlus } from 'lucide-react'

import RegisterForm from './RegisterForm'

export const metadata: Metadata = {
  title: '注册 | Bambi Lab Idea',
}

export default function RegisterPage() {
  return (
    <div className="w-full max-w-5xl">
      <div className="grid overflow-hidden rounded-2xl border-2 border-brand-dark bg-surface shadow-solid-lg animate-fade-in-up motion-reduce:animate-none lg:grid-cols-2">
        <div className="hidden bg-brand-accent p-10 lg:block">
          <div className="flex h-full flex-col justify-between text-white">
            <div>
              <h2 className="mb-4 font-heading text-3xl font-bold">加入我们</h2>
              <p className="text-lg text-white/80">
                成为 Bambi Lab 的一员，开启您的创业之旅。
              </p>
            </div>

            <div className="space-y-6">
              <div
                className="flex items-start gap-4 animate-fade-in-up motion-reduce:animate-none"
                style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface/20">
                  <Sparkles size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-heading font-bold">提交创意</h3>
                  <p className="text-sm text-white/70">分享您的想法，让专业团队评估可行性</p>
                </div>
              </div>

              <div
                className="flex items-start gap-4 animate-fade-in-up motion-reduce:animate-none"
                style={{ animationDelay: '350ms', animationFillMode: 'backwards' }}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface/20">
                  <Target size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-heading font-bold">精准匹配</h3>
                  <p className="text-sm text-white/70">根据项目需求匹配最合适的技术栈</p>
                </div>
              </div>

              <div
                className="flex items-start gap-4 animate-fade-in-up motion-reduce:animate-none"
                style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface/20">
                  <Code size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-heading font-bold">专业开发</h3>
                  <p className="text-sm text-white/70">经验丰富的工程师团队为您服务</p>
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
              <div className="flex size-14 items-center justify-center rounded-xl bg-brand-accent text-white shadow-solid-sm">
                <UserPlus size={26} aria-hidden="true" />
              </div>
            </div>

            <h1 className="mb-2 text-center font-heading text-3xl font-bold text-brand-dark lg:text-left">
              创建账号
            </h1>
            <p className="mb-10 text-center text-base text-muted-foreground lg:text-left">
              提交你的第一个伟大想法
            </p>

            <RegisterForm />
          </div>

          <div className="border-t border-border bg-muted p-5 text-center text-sm text-muted-foreground">
            已经有账号？{' '}
            <Link href="/login" className="font-bold text-brand-primary hover:underline">
              直接登录
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
