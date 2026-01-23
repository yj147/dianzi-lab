import { getSession } from '@/lib/auth'

export default async function Footer() {
  const session = await getSession()
  const year = new Date().getFullYear()

  if (session) {
    return (
      <footer id="about" className="relative z-10 px-6 pb-16 pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[4rem] bg-slate-900 p-12 text-white md:p-20">
            <div className="absolute left-0 top-0 h-64 w-64 bg-lavender-400/10 blur-3xl" aria-hidden="true" />

            <div className="relative z-10 grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-4">
              <div className="col-span-1 lg:col-span-2">
                <div className="mb-8 flex items-center gap-3">
                  <div className="blob-shape flex size-10 items-center justify-center bg-coral-400">
                    <span className="material-symbols-outlined text-white" aria-hidden="true">
                      magic_button
                    </span>
                  </div>
                  <span className="font-script text-3xl">奇迹工坊</span>
                </div>

                <p className="mb-8 max-w-sm text-lg font-medium text-slate-400">
                  让世界多一点不可思议，
                  <br />
                  让生活充满温柔的惊喜。
                </p>

                <div className="flex gap-4">
                  <a
                    className="flex size-12 items-center justify-center rounded-full border border-slate-700 transition-colors hover:border-coral-400 hover:bg-coral-400"
                    href="#"
                  >
                    <span className="material-symbols-outlined text-xl" aria-hidden="true">
                      flutter_dash
                    </span>
                  </a>
                  <a
                    className="flex size-12 items-center justify-center rounded-full border border-slate-700 transition-colors hover:border-lavender-300 hover:bg-lavender-300"
                    href="#"
                  >
                    <span className="material-symbols-outlined text-xl" aria-hidden="true">
                      camera
                    </span>
                  </a>
                </div>
              </div>

              <div>
                <h3 className="mb-8 text-xl font-bold">漫游指南</h3>
                <ul className="space-y-4 text-slate-400 font-medium">
                  <li>
                    <a className="transition-colors hover:text-mint-200" href="#">
                      新手秘籍
                    </a>
                  </li>
                  <li>
                    <a className="transition-colors hover:text-mint-200" href="#">
                      灵感泉源
                    </a>
                  </li>
                  <li>
                    <a className="transition-colors hover:text-mint-200" href="#">
                      工坊守则
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-8 text-xl font-bold">联系我们</h3>
                <ul className="space-y-4 text-slate-400 font-medium">
                  <li>
                    <a className="transition-colors hover:text-coral-400" href="#">
                      给猫头鹰写信
                    </a>
                  </li>
                  <li>
                    <a className="transition-colors hover:text-coral-400" href="#">
                      加入星际群组
                    </a>
                  </li>
                  <li>
                    <a className="transition-colors hover:text-coral-400" href="#">
                      加入我们
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-slate-800 pt-10 text-sm text-slate-500 md:flex-row">
              <p>© {year} 奇迹工坊 · 让奇思妙想自由呼吸</p>
              <p className="flex items-center gap-2">
                用爱与魔法驱动{' '}
                <span className="material-symbols-outlined text-xs text-coral-400" aria-hidden="true">
                  favorite
                </span>{' '}
                StellarLink
              </p>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer id="about" className="relative z-10 px-6 pb-16 pt-20">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[4rem] border border-white/60 bg-lavender-50/50 p-12 text-slate-700 shadow-xl backdrop-blur-sm md:p-20">
          <div className="absolute right-0 top-0 h-64 w-64 -mr-20 -mt-20 rounded-full bg-mint-100/40 blur-3xl" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 h-56 w-56 -ml-16 -mb-16 rounded-full bg-coral-100/30 blur-3xl" aria-hidden="true" />

          <div className="relative z-10 grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-4">
            <div className="col-span-1 lg:col-span-2">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-coral-400 text-white shadow-lg shadow-coral-200 -rotate-12">
                  <span className="material-symbols-outlined text-2xl" aria-hidden="true">
                    auto_fix_normal
                  </span>
                </div>
                <span className="font-script text-4xl text-slate-800">奇迹工坊</span>
              </div>
              <p className="mb-8 max-w-sm text-lg font-medium leading-relaxed text-slate-600">
                让世界多一点不可思议，
                <br />
                让生活充满温柔的惊喜。
              </p>
              <div className="flex gap-4">
                <a
                  className="flex size-12 items-center justify-center rounded-full border-2 border-lavender-200 bg-white text-lavender-300 shadow-sm transition-all hover:-translate-y-1 hover:border-coral-400 hover:bg-coral-400 hover:text-white"
                  href="#"
                >
                  <span className="material-symbols-outlined text-xl" aria-hidden="true">
                    flutter_dash
                  </span>
                </a>
                <a
                  className="flex size-12 items-center justify-center rounded-full border-2 border-lavender-200 bg-white text-lavender-300 shadow-sm transition-all hover:-translate-y-1 hover:border-lavender-300 hover:bg-lavender-300 hover:text-white"
                  href="#"
                >
                  <span className="material-symbols-outlined text-xl" aria-hidden="true">
                    camera
                  </span>
                </a>
              </div>
            </div>

            <div>
              <h3 className="mb-8 flex items-center gap-2 text-xl font-bold text-slate-800">
                <span className="material-symbols-outlined text-2xl text-mint-200" aria-hidden="true">
                  explore
                </span>
                漫游指南
              </h3>
              <ul className="space-y-4 text-slate-600 font-medium">
                <li>
                  <a className="group flex items-center gap-2 transition-colors hover:text-coral-400" href="#">
                    <span
                      className="material-symbols-outlined text-sm text-lavender-300 transition-colors group-hover:text-coral-400"
                      aria-hidden="true"
                    >
                      arrow_forward_ios
                    </span>
                    新手秘籍
                  </a>
                </li>
                <li>
                  <a className="group flex items-center gap-2 transition-colors hover:text-coral-400" href="#">
                    <span
                      className="material-symbols-outlined text-sm text-lavender-300 transition-colors group-hover:text-coral-400"
                      aria-hidden="true"
                    >
                      arrow_forward_ios
                    </span>
                    灵感泉源
                  </a>
                </li>
                <li>
                  <a className="group flex items-center gap-2 transition-colors hover:text-coral-400" href="#">
                    <span
                      className="material-symbols-outlined text-sm text-lavender-300 transition-colors group-hover:text-coral-400"
                      aria-hidden="true"
                    >
                      arrow_forward_ios
                    </span>
                    工坊守则
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-8 flex items-center gap-2 text-xl font-bold text-slate-800">
                <span className="material-symbols-outlined text-2xl text-coral-400" aria-hidden="true">
                  outgoing_mail
                </span>
                联系我们
              </h3>
              <ul className="space-y-4 text-slate-600 font-medium">
                <li>
                  <a className="group flex items-center gap-2 transition-colors hover:text-coral-400" href="#">
                    <span
                      className="material-symbols-outlined text-lg text-lavender-300 transition-transform group-hover:scale-110 group-hover:text-coral-400"
                      aria-hidden="true"
                    >
                      pets
                    </span>
                    给猫头鹰写信
                  </a>
                </li>
                <li>
                  <a className="group flex items-center gap-2 transition-colors hover:text-coral-400" href="#">
                    <span
                      className="material-symbols-outlined text-lg text-lavender-300 transition-transform group-hover:scale-110 group-hover:text-coral-400"
                      aria-hidden="true"
                    >
                      rocket
                    </span>
                    加入星际群组
                  </a>
                </li>
                <li>
                  <a className="group flex items-center gap-2 transition-colors hover:text-coral-400" href="#">
                    <span
                      className="material-symbols-outlined text-lg text-lavender-300 transition-transform group-hover:scale-110 group-hover:text-coral-400"
                      aria-hidden="true"
                    >
                      diversity_2
                    </span>
                    加入我们
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-lavender-200/60 pt-10 text-sm font-medium text-slate-500 md:flex-row">
            <p>© {year} 奇迹工坊 · 让奇思妙想自由呼吸</p>
            <p className="flex items-center gap-2">
              用爱与魔法驱动{' '}
              <span
                className="material-symbols-outlined text-sm text-coral-400 animate-pulse motion-reduce:animate-none"
                aria-hidden="true"
              >
                favorite
              </span>{' '}
              StellarLink
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
