import { Metadata } from 'next'

import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: '登录 | 点子 Lab',
}

export default function LoginPage() {
  return (
    <main className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100/50 px-4 py-20 overflow-hidden">
      {/* Background Decorative Spheres - Subtle Fog */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-cyan-400/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  )
}
