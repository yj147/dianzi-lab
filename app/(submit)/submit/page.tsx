import Link from 'next/link'

import { getSession } from '@/lib/auth'
import SubmitForm from './SubmitForm'

export default async function SubmitPage() {
  const session = await getSession()

  return (
    <div className="mx-auto w-full max-w-6xl grid grid-cols-1 gap-12 items-center lg:grid-cols-12">
      <div className="relative text-center lg:col-span-5 lg:text-left">
        <div className="hidden lg:block absolute -top-24 -left-12 size-32 animate-wiggle" aria-hidden="true">
          <svg className="h-full w-full text-lavender-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 100 100">
            <path
              d="M50 10 Q70 5 80 25 T90 60 T70 90 T30 90 T10 60 T20 25 T50 10Z"
              strokeDasharray="5,5"
            />
            <circle className="text-coral-300" cx="30" cy="40" fill="currentColor" r="5" />
            <circle className="text-mint-300" cx="70" cy="60" fill="currentColor" r="8" />
          </svg>
        </div>

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-coral-100 bg-coral-50 px-5 py-2 text-sm font-bold text-coral-500 shadow-sm -rotate-2">
          <span className="material-symbols-outlined text-base" aria-hidden="true">
            auto_awesome
          </span>
          创意孵化器
        </div>
        <h1 className="text-balance mb-6 text-5xl font-black leading-tight text-slate-800 lg:text-7xl">
          <span className="mb-2 block text-4xl font-script text-lavender-500 lg:text-5xl -rotate-1 origin-bottom-left">
            点亮你的
          </span>
          奇思妙想
        </h1>
        <p className="text-pretty mb-10 max-w-lg text-xl font-medium leading-relaxed text-slate-500 mx-auto lg:mx-0">
          在这个充满无限可能的梦境里，每一个小小的想法都是一颗等待发芽的魔法种子。准备好编织你的现实了吗？
        </p>

        <Link
          href="/#tools"
          className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-lavender-200 bg-white/80 px-8 py-4 font-bold text-lavender-500 shadow-sm transition-colors hover:bg-lavender-50 hover:border-lavender-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff]"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            explore
          </span>
          探索奇迹工坊
        </Link>

        <div className="absolute bottom-0 -left-10 hidden h-24 w-24 lg:block animate-float-slow" aria-hidden="true">
          <svg className="h-full w-full text-mint-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path
              d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" fill="#dcfce7" r="4" />
          </svg>
        </div>
      </div>

      <div className="relative lg:col-span-7">
        <div className="absolute -top-10 -right-10 size-40 rounded-full bg-coral-200 blur-2xl opacity-40 mix-blend-multiply animate-none sm:animate-blob motion-reduce:animate-none" aria-hidden="true" />
        <div
          className="absolute -bottom-10 -left-10 size-40 rounded-full bg-lavender-200 blur-2xl opacity-40 mix-blend-multiply animate-none sm:animate-blob animation-delay-2000 motion-reduce:animate-none"
          aria-hidden="true"
        />

        {session ? (
          <SubmitForm />
        ) : (
          <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[3rem] border border-white/80 bg-white/60 p-8 text-center shadow-[0_20px_60px_-15px_rgba(167,139,250,0.25)] backdrop-blur-2xl md:p-12">
            <h2 className="text-balance mb-4 text-2xl font-bold text-slate-800">登录后即可提交点子</h2>
            <p className="text-pretty mb-8 text-slate-500 font-medium">分享你的创意，让大家一起完善它。</p>
            <Link
              href="/login?callbackUrl=/submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-coral-400 py-4 text-lg font-bold text-white shadow-lg shadow-coral-400/30 transition-transform hover:-translate-y-0.5 hover:bg-coral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff]"
            >
              立即登录
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
