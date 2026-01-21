import { Metadata } from 'next'

import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: '登录 | 点子 Lab',
}

export default function LoginPage() {
  return (
    <main className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-blue-500/20 px-4 py-20 overflow-hidden">
      {/* Background Decorative Spheres */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <LoginForm />
      </div>
    </main>
  )
}
