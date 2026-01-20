import Link from 'next/link'

import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">登录</h1>
        <LoginForm />
        <Link
          href="/register"
          className="text-sm text-gray-600 underline underline-offset-4 hover:text-foreground dark:text-gray-300"
        >
          没有账号？立即注册
        </Link>
      </section>
    </main>
  )
}
