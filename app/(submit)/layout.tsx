import Link from 'next/link'

import { getSession } from '@/lib/auth'

export default async function SubmitLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getSession()

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-[#fdf8ff] text-slate-700">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] h-[70%] w-[70%] blob-shape bg-gradient-to-br from-lavender-100/60 to-transparent blur-3xl opacity-70 animate-float-slow" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[60%] w-[60%] blob-shape-2 bg-gradient-to-tl from-mint-100/60 to-transparent blur-3xl opacity-70 animate-float-medium animation-delay-1000" />
        <div className="absolute top-[40%] left-[20%] h-[30%] w-[30%] rounded-full bg-coral-100/30 blur-3xl opacity-50 animate-float-fast" />

        <svg
          className="absolute right-[15%] top-[15%] h-24 w-24 text-lavender-400 opacity-20 animate-float-slow"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <path
            d="M50 10 C20 10 5 35 15 60 C5 80 25 95 50 95 C80 95 95 75 90 50 C95 20 70 10 50 10 Z"
            fill="currentColor"
          />
        </svg>

        <svg
          className="absolute bottom-[20%] left-[10%] h-32 w-32 text-mint-300 opacity-20 animate-float-medium"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <path
            d="M40 15 C10 20 -5 50 10 75 C20 95 60 100 80 85 C100 70 95 30 70 15 C60 5 50 10 40 15 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <nav className="relative z-10 px-6 py-6 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-full border-2 border-lavender-100 bg-white shadow-lg shadow-lavender-200/50 -rotate-6">
              <svg
                className="h-8 w-8 text-coral-400"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <span className="font-script text-3xl tracking-wider text-slate-800 md:text-4xl">奇迹工坊</span>
          </Link>

          <div className="hidden items-center gap-8 rounded-full border border-white/60 bg-white/40 px-8 py-3 shadow-sm backdrop-blur-md md:flex">
            <Link href="/" className="font-bold text-slate-600 transition-colors hover:text-coral-500">
              幻象大厅
            </Link>
            <Link href="/#tools" className="font-bold text-slate-600 transition-colors hover:text-coral-500">
              造梦工具
            </Link>
            <Link href="/#about" className="font-bold text-slate-600 transition-colors hover:text-coral-500">
              关于我们
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="rounded-full border-2 border-transparent bg-white px-6 py-2.5 font-bold text-slate-700 shadow-sm transition-colors hover:border-mint-200 hover:bg-mint-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff]"
              >
                我的工坊
              </Link>
            ) : (
              <Link
                href="/login?callbackUrl=/submit"
                className="rounded-full border-2 border-transparent bg-white px-6 py-2.5 font-bold text-slate-700 shadow-sm transition-colors hover:border-mint-200 hover:bg-mint-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff]"
              >
                登录
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        {children}
      </main>

      <footer className="relative z-10 px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-slate-400 md:flex-row">
          <p>© 2026 奇迹工坊 · 让奇思妙想自由呼吸</p>
          <p className="flex items-center gap-2">
            <span>用</span>
            <span className="material-symbols-outlined text-base text-coral-400" aria-hidden="true">
              favorite
            </span>
            <span>与魔法驱动</span>
          </p>
        </div>
      </footer>
    </div>
  )
}

