import Link from 'next/link'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-[#fdf8ff]">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] size-[60%] blob-shape bg-lavender-200/40 blur-[80px]" />
        <div className="absolute -bottom-[10%] -right-[10%] size-[70%] blob-shape-avatar bg-mint-100/40 blur-[80px]" />
        <div className="absolute top-[40%] right-[20%] size-[35%] rounded-full bg-coral-200/20 blur-[60px]" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="size-10 rounded-full bg-white/50 backdrop-blur flex items-center justify-center text-coral-400 shadow-sm transition-transform group-hover:rotate-12">
            <span className="material-symbols-outlined" aria-hidden="true">
              auto_fix_high
            </span>
          </div>
          <span className="font-script text-2xl text-slate-800">奇迹工坊</span>
        </Link>

        <Link
          href="/"
          className="rounded-full px-3 py-2 text-sm font-bold text-slate-500 transition-colors hover:text-coral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff]"
        >
          返回首页{' '}
          <span className="material-symbols-outlined text-sm align-middle" aria-hidden="true">
            arrow_forward
          </span>
        </Link>
      </nav>

      <main className="relative z-10 flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
