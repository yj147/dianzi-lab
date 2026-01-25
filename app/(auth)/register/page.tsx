import { Metadata } from 'next'
import RegisterForm from './RegisterForm'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '注册 | 奇迹工坊',
}

export default function RegisterPage() {
  return (
    <div className="relative w-full max-w-5xl">
      <div className="glass-panel w-full overflow-hidden rounded-[3rem] flex flex-col md:flex-row min-h-[650px]">
        <div className="relative w-full md:w-5/12 bg-gradient-to-b from-lavender-100/50 via-white/20 to-mint-100/50 overflow-hidden p-6 sm:p-8 flex flex-col justify-center items-center">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 blur-2xl" />
            <div className="absolute bottom-10 left-0 hidden w-full px-6 text-center md:block">
              <p className="mb-2 font-script text-2xl text-coral-400 drop-shadow-sm">欢迎加入</p>
              <p className="text-pretty text-sm font-medium text-slate-500">
                把你的想法留在这里
                <br />
                我们一起把它点亮。
              </p>
            </div>
          </div>

          <div className="relative z-10 h-full w-full flex items-center justify-center">
            <div className="relative animate-float-slow">
              <div className="size-20 sm:size-24 rounded-full bg-mint-50 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl sm:text-6xl text-mint-300/90 mt-2" aria-hidden="true">
                  toys
                </span>
              </div>
              <div className="h-16 w-28 sm:h-20 sm:w-32 rounded-t-[4rem] bg-lavender-200 -mt-2 mx-auto relative z-[-1] flex justify-center">
                <div className="h-full w-20 sm:w-24 rounded-t-[4rem] bg-lavender-300 opacity-50" />
              </div>

              <div className="absolute -right-10 sm:-right-12 top-0 animate-bounce animation-delay-500">
                <div className="bg-white p-2 rounded-xl shadow-md rotate-12">
                  <span className="material-symbols-outlined text-3xl text-coral-400" aria-hidden="true">
                    star
                  </span>
                </div>
              </div>

              <div className="absolute -left-8 sm:-left-10 top-10 animate-bounce animation-delay-1000">
                <div className="bg-white p-2 rounded-full shadow-md -rotate-12">
                  <span className="material-symbols-outlined text-3xl text-lavender-400" aria-hidden="true">
                    auto_awesome
                  </span>
                </div>
              </div>

              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[130%] w-[130%] sm:h-[140%] sm:w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-white/60 animate-spin-slow">
                <span
                  className="material-symbols-outlined absolute -top-3 left-1/2 -translate-x-1/2 text-xl text-yellow-300"
                  aria-hidden="true"
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined absolute bottom-1/4 -right-2 text-lg text-lavender-300"
                  aria-hidden="true"
                >
                  auto_awesome
                </span>
                <span
                  className="material-symbols-outlined absolute top-1/4 -left-2 text-lg text-mint-300"
                  aria-hidden="true"
                >
                  bubble_chart
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center md:hidden">
            <p className="mb-2 font-script text-xl text-coral-400 drop-shadow-sm">欢迎加入</p>
            <p className="text-pretty text-sm font-medium text-slate-500">
              把你的想法留在这里
              <br />
              我们一起把它点亮。
            </p>
          </div>

          <span className="material-symbols-outlined sparkle pointer-events-none text-2xl top-10 left-10" aria-hidden="true">
            star
          </span>
          <span
            className="material-symbols-outlined sparkle pointer-events-none text-xl top-20 right-10 animation-delay-500"
            aria-hidden="true"
          >
            spark
          </span>
          <span
            className="material-symbols-outlined sparkle pointer-events-none text-lg bottom-32 left-8 animation-delay-1000"
            aria-hidden="true"
          >
            flare
          </span>
        </div>

        <div className="w-full md:w-7/12 bg-white/30 backdrop-blur-sm p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-full mb-8 shadow-inner border border-white/50 w-full max-w-xs sm:w-max sm:max-w-none mx-auto sm:mx-0">
            <Link
              href="/login"
              className="flex-1 sm:flex-none text-center px-4 sm:px-6 py-2 rounded-full text-slate-500 hover:text-slate-700 font-bold text-sm transition-colors hover:bg-white/50"
            >
              登录
            </Link>
            <Link
              href="/register"
              className="flex-1 sm:flex-none text-center px-4 sm:px-6 py-2 rounded-full bg-white text-coral-500 shadow-sm font-bold text-sm"
            >
              注册
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-balance text-4xl lg:text-5xl font-script text-slate-800 mb-3">开启新旅程</h1>
            <p className="text-pretty text-slate-500 font-medium">创建账号，开始你的奇思妙想之旅。</p>
          </div>

          <RegisterForm />
        </div>
      </div>

      <div className="absolute right-0 bottom-0 pointer-events-none opacity-20 hidden lg:block translate-x-1/4 translate-y-1/4">
        <span className="material-symbols-outlined text-[300px] text-mint-200" aria-hidden="true">
          toys
        </span>
      </div>
    </div>
  )
}
