import type { Prisma } from '@prisma/client'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import LogoutButton from '@/components/LogoutButton'
import DashboardAvatar from '@/components/DashboardAvatar'

type DashboardPageProps = {
  searchParams?: {
    status?: string
    q?: string
  }
}

function normalizeQuery(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  return trimmed.slice(0, 100)
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await getSession()

  if (!session) {
    redirect('/login?callbackUrl=/dashboard')
  }

  const q = normalizeQuery(searchParams?.q)
  const status = normalizeQuery(searchParams?.status)

  const where: Prisma.IdeaWhereInput = {
    userId: session.sub,
    isDeleted: false,
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {}),
    ...(status === 'completed'
      ? { status: 'COMPLETED' }
      : status === 'incubating'
        ? { status: { not: 'COMPLETED' } }
        : {}),
  }

  const [ideas, completedCount] = await Promise.all([
    prisma.idea.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        assessment: { select: { id: true } },
      },
    }),
    prisma.idea.count({ where: { userId: session.sub, isDeleted: false, status: 'COMPLETED' } }),
  ])
  const userHandle = session.email.split('@')[0]?.trim()
  const displayName = `造梦者·${userHandle || '阿星'}`
  const level = Math.max(1, completedCount + 1)

  const buildDashboardHref = (nextStatus: string, nextQuery: string | undefined = q) => {
    const params = new URLSearchParams()
    if (nextQuery) params.set('q', nextQuery)
    if (nextStatus !== 'all') params.set('status', nextStatus)
    const qs = params.toString()
    return qs ? `/dashboard?${qs}` : '/dashboard'
  }

  return (
    <div>
      <nav className="px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/50 bg-white/30 px-4 py-3 shadow-sm backdrop-blur-md sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-lavender-300 to-coral-300 text-white shadow-inner rotate-3">
              <span className="material-symbols-outlined" aria-hidden="true">
                auto_awesome
              </span>
            </div>
            <span className="sr-only font-script text-2xl text-slate-800 sm:not-sr-only">奇迹工坊</span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/submit"
              className="flex items-center gap-2 rounded-full bg-coral-400 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-coral-200 transition-transform hover:-translate-y-0.5 hover:bg-coral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff] motion-reduce:transform-none motion-reduce:transition-none sm:px-5"
            >
              <span className="material-symbols-outlined text-sm" aria-hidden="true">
                add
              </span>
              <span className="sr-only sm:not-sr-only">新建梦境</span>
            </Link>

            <DashboardAvatar displayName={displayName} />
          </div>
        </div>
      </nav>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-12">
        <aside className="space-y-6 lg:col-span-3">
          <div className="glass-panel relative overflow-hidden rounded-[2.5rem] p-8 text-center">
            <div className="absolute left-0 top-0 h-24 w-full bg-gradient-to-b from-lavender-200/50 to-transparent" aria-hidden="true" />

            <div className="relative z-10">
              <div className="mx-auto mb-4 flex size-24 items-center justify-center rounded-full bg-white p-1 shadow-xl">
                <div className="flex size-full items-center justify-center rounded-full bg-lavender-50">
                  <span className="material-symbols-outlined mt-1 text-6xl text-lavender-300" aria-hidden="true">
                    face_3
                  </span>
                </div>
              </div>
              <h2 className="mb-1 truncate text-xl font-bold text-slate-800">{displayName}</h2>
              <p className="mb-6 truncate text-sm font-medium text-slate-500">
                Level {level} · 幻像编织者
              </p>

              <div className="mb-6 flex justify-center gap-4 text-center tabular-nums">
                <div>
                  <div className="text-2xl font-black text-coral-400">{ideas.length}</div>
                  <div className="text-xs font-bold text-slate-400">梦境</div>
                </div>
                <div className="w-px bg-slate-200" aria-hidden="true" />
                <div>
                  <div className="text-2xl font-black text-mint-500">{completedCount}</div>
                  <div className="text-xs font-bold text-slate-400">已成真</div>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 rounded-xl bg-lavender-50 px-4 py-2.5 font-bold text-lavender-600 transition-colors hover:bg-lavender-100"
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    dashboard
                  </span>
                  我的工坊
                </Link>
                <Link
                  href="/dashboard/favorites"
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 font-medium text-slate-500 transition-colors hover:bg-white/50"
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    collections_bookmark
                  </span>
                  收藏灵感
                </Link>
                <Link
                  href="/dashboard/inbox"
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 font-medium text-slate-500 transition-colors hover:bg-white/50"
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    notifications
                  </span>
                  星际信箱
                  <span className="ml-auto rounded-full bg-coral-400 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    3
                  </span>
                </Link>
              </div>

              <div className="mt-6">
                <LogoutButton className="w-full justify-center" />
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] bg-gradient-to-br from-mint-50 to-white p-6">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-700">
              <span className="material-symbols-outlined text-mint-500" aria-hidden="true">
                lightbulb
              </span>
              今日灵感碎片
            </h3>
            <p className="text-pretty text-sm italic leading-relaxed text-slate-600">
              “如果云朵是棉花糖做的，那下雨的时候是不是会很甜？”
            </p>
            <Link
              href="/submit"
              className="mt-4 inline-block text-xs font-bold text-mint-600 underline decoration-2 underline-offset-2 hover:text-mint-700"
            >
              记录这个想法
            </Link>
          </div>
        </aside>

        <div className="space-y-8 lg:col-span-9">
          <header className="glass-panel rounded-[3rem] bg-gradient-to-r from-lavender-50 via-white to-mint-50 p-8 flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <h1 className="text-balance mb-2 text-4xl font-script text-slate-800 md:text-5xl">
                点亮你的奇思妙想
              </h1>
              <p className="text-pretty font-medium text-slate-500">欢迎回来，今天想编织什么梦？</p>
            </div>
            <div className="flex items-center gap-3">
              <details className="relative">
                <summary
                  aria-label="搜索"
                  className="list-none [&::-webkit-details-marker]:hidden flex size-12 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-400 shadow-sm transition-transform transition-colors duration-200 hover:scale-110 hover:text-coral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff] cursor-pointer motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    search
                  </span>
                </summary>
                <div className="absolute right-0 mt-3 w-72 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-lg backdrop-blur-md">
                  <form method="GET" className="flex items-center gap-3">
                    {status && status !== 'all' ? <input type="hidden" name="status" value={status} /> : null}
                    <label htmlFor="dashboard-search" className="sr-only">
                      搜索梦境
                    </label>
                    <input
                      id="dashboard-search"
                      name="q"
                      defaultValue={q}
                      placeholder="搜索梦境…"
                      className="h-12 w-full rounded-full border border-white/70 bg-white/60 px-5 text-sm font-medium text-slate-600 placeholder:text-slate-400 shadow-sm backdrop-blur-md outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff]"
                    />
                    <button
                      type="submit"
                      className="flex size-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm transition-transform transition-colors duration-200 hover:scale-105 hover:text-coral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff] motion-reduce:transform-none motion-reduce:transition-none"
                      aria-label="搜索"
                    >
                      <span className="material-symbols-outlined" aria-hidden="true">
                        search
                      </span>
                    </button>
                  </form>

                  {q ? (
                    <Link
                      href={buildDashboardHref(status || 'all', undefined)}
                      className="mt-3 block text-center text-sm font-bold text-slate-500 underline decoration-2 underline-offset-2 hover:text-slate-700"
                    >
                      清除搜索
                    </Link>
                  ) : null}
                </div>
              </details>
              <Link
                href="/submit"
                className="rounded-full bg-coral-400 px-8 py-3 font-bold text-white shadow-lg shadow-coral-200 transition-transform hover:-translate-y-1 hover:bg-coral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff]"
              >
                编织梦想
              </Link>
            </div>
          </header>

          <div className="flex flex-col items-start justify-between gap-4 px-2 sm:flex-row sm:items-center">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-700">
              <span className="material-symbols-outlined text-lavender-400" aria-hidden="true">
                auto_stories
              </span>
              我的梦境记录
            </h2>

            <div className="flex rounded-full border border-white/50 bg-white/40 p-1 backdrop-blur-sm">
              <Link
                href={buildDashboardHref('all')}
                className={cn(
                  'rounded-full px-5 py-2 text-sm transition-colors',
                  !status || status === 'all'
                    ? 'bg-white font-bold text-slate-800 shadow-sm'
                    : 'font-medium text-slate-500 hover:bg-white/50'
                )}
              >
                全部
              </Link>
              <Link
                href={buildDashboardHref('incubating')}
                className={cn(
                  'rounded-full px-5 py-2 text-sm transition-colors',
                  status === 'incubating'
                    ? 'bg-white font-bold text-slate-800 shadow-sm'
                    : 'font-medium text-slate-500 hover:bg-white/50'
                )}
              >
                孵化中
              </Link>
              <Link
                href={buildDashboardHref('completed')}
                className={cn(
                  'rounded-full px-5 py-2 text-sm transition-colors',
                  status === 'completed'
                    ? 'bg-white font-bold text-slate-800 shadow-sm'
                    : 'font-medium text-slate-500 hover:bg-white/50'
                )}
              >
                已完成
              </Link>
            </div>
          </div>

          {ideas.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ideas.map((idea, index) => {
                const description = idea.description.length > 80 ? `${idea.description.slice(0, 80)}…` : idea.description
                const previewIcon = ['cloud_circle', 'potted_plant', 'rocket_launch'][index % 3]

                const statusConfig = (() => {
                  switch (idea.status) {
                    case 'PENDING':
                      return {
                        label: '待审核',
                        badge: 'bg-lavender-50 text-lavender-500 border-lavender-100',
                        preview: 'bg-lavender-50',
                        titleHover: 'group-hover:text-lavender-500',
                        action: 'arrow' as const,
                      }
                    case 'APPROVED':
                      return {
                        label: '已采纳',
                        badge: 'bg-mint-50 text-emerald-600 border-mint-100',
                        preview: 'bg-mint-50',
                        titleHover: 'group-hover:text-emerald-600',
                        action: 'edit' as const,
                      }
                    case 'IN_PROGRESS':
                      return {
                        label: '开发中',
                        badge: 'bg-amber-50 text-amber-600 border-amber-100',
                        preview: 'bg-amber-50',
                        titleHover: 'group-hover:text-amber-600',
                        action: 'edit' as const,
                      }
                    case 'COMPLETED':
                      return {
                        label: '已完成',
                        badge: 'bg-coral-50 text-coral-500 border-coral-100',
                        preview: 'bg-coral-50',
                        titleHover: 'group-hover:text-coral-500',
                        action: 'stars' as const,
                      }
                  }
                })()

                return (
                  <div key={idea.id} className="glass-panel group relative overflow-hidden rounded-[2.5rem] p-6 transition-transform duration-200 hover:-translate-y-2">
                    <div className="absolute right-4 top-4 z-20">
                      <span
                        className={cn(
                          'rounded-full border px-3 py-1 text-xs font-bold shadow-sm',
                          statusConfig.badge
                        )}
                      >
                        {statusConfig.label}
                      </span>
                    </div>

                    <div
                      className={cn(
                        'mb-5 flex h-40 w-full items-center justify-center overflow-hidden rounded-[2rem] border-4 border-white shadow-inner',
                        statusConfig.preview
                      )}
                      aria-hidden="true"
                    >
                      <span className="material-symbols-outlined text-7xl text-slate-300 opacity-80 transition-transform duration-500 group-hover:scale-110">
                        {previewIcon}
                      </span>
                    </div>

                    <h3 className={cn('mb-2 text-xl font-bold text-slate-800 transition-colors', statusConfig.titleHover)}>
                      {idea.title}
                    </h3>
                    <p className="mb-6 line-clamp-2 text-sm text-slate-500">{description}</p>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs font-bold tabular-nums text-slate-400">
                        {new Date(idea.createdAt).toLocaleDateString('zh-CN')}
                      </span>

                      <div className="flex items-center gap-2">
                        {idea.assessment && (
                          <Link
                            href={`/idea/${idea.id}/result`}
                            className="flex size-8 items-center justify-center rounded-full bg-lavender-100 text-lavender-600 transition-colors hover:bg-lavender-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff]"
                            aria-label="查看评估"
                            title="查看评估"
                          >
                            <span className="material-symbols-outlined text-lg" aria-hidden="true">
                              assessment
                            </span>
                          </Link>
                        )}

                        {statusConfig.action === 'stars' ? (
                          <div className="flex gap-1" aria-label="评分">
                            <span className="material-symbols-outlined text-sm text-yellow-400" aria-hidden="true">
                              star
                            </span>
                            <span className="material-symbols-outlined text-sm text-yellow-400" aria-hidden="true">
                              star
                            </span>
                            <span className="material-symbols-outlined text-sm text-yellow-400" aria-hidden="true">
                              star
                            </span>
                          </div>
                        ) : statusConfig.action === 'edit' ? (
                          <Link
                            href="/submit"
                            className="flex size-8 items-center justify-center rounded-full bg-mint-100 text-mint-600 transition-colors hover:bg-mint-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff]"
                            aria-label="继续编织"
                          >
                            <span className="material-symbols-outlined text-lg" aria-hidden="true">
                              edit
                            </span>
                          </Link>
                        ) : (
                          <Link
                            href="/submit"
                            className="flex size-8 items-center justify-center rounded-full bg-lavender-100 text-lavender-600 transition-colors hover:bg-lavender-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff]"
                            aria-label="继续编织"
                          >
                            <span className="material-symbols-outlined text-lg" aria-hidden="true">
                              arrow_forward
                            </span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}

              <Link
                href="/submit"
                className="group flex min-h-[340px] flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-300 p-6 text-center transition-colors hover:border-mint-300 hover:bg-mint-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff] motion-reduce:transition-none"
              >
                <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-110 motion-reduce:transform-none motion-reduce:transition-none">
                  <span className="material-symbols-outlined text-4xl text-slate-300 transition-colors group-hover:text-mint-400" aria-hidden="true">
                    add
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-400 transition-colors group-hover:text-mint-600">
                  捕捉新灵感
                </h3>
                <p className="max-w-[200px] text-sm text-slate-400">别让那个稍纵即逝的想法跑掉了...</p>
              </Link>
            </div>
          ) : (
            <div className="glass-panel rounded-[3rem] p-10 text-center">
              <div className="mx-auto mb-6 flex size-28 items-center justify-center rounded-full border-4 border-dashed border-mint-200 bg-mint-50">
                <span className="material-symbols-outlined text-6xl text-mint-200" aria-hidden="true">
                  bedroom_baby
                </span>
              </div>
              <h3 className="text-balance mb-3 text-2xl font-bold text-slate-800">梦境还在孵化中...</h3>
              <p className="text-pretty mx-auto mb-8 max-w-md font-medium text-slate-400">
                这片区域正虚位以待。快来释放你的想象力，成为第一个播种奇迹的人！
              </p>
              <Link
                href="/submit"
                className="inline-flex items-center justify-center rounded-3xl bg-mint-200 px-10 py-4 text-xl font-black text-emerald-800 border-b-8 border-mint-300 transition-transform hover:translate-y-1 hover:border-b-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff]"
              >
                播撒第一颗种子
              </Link>
            </div>
          )}

          <div className="glass-panel relative mt-12 overflow-hidden rounded-[3rem] bg-gradient-to-br from-lavender-50 via-white to-mint-50 p-10 text-center">
            <div className="absolute left-0 top-0 h-full w-full" aria-hidden="true">
              <div className="absolute -left-[20%] -top-[50%] h-[500px] w-[500px] rounded-full bg-lavender-200/30 blur-3xl" />
              <div className="absolute -bottom-[50%] -right-[20%] h-[500px] w-[500px] rounded-full bg-coral-200/30 blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <span className="material-symbols-outlined mb-4 text-5xl text-lavender-300" aria-hidden="true">
                explore
              </span>
              <h2 className="mb-4 text-3xl font-bold text-slate-800">探索奇迹工坊</h2>
              <p className="mb-8 max-w-lg font-medium text-slate-500">
                这里还有成千上万个奇妙的梦境正在发生。去看看其他造梦者都在做什么吧！
              </p>
              <Link
                href="/"
                className="rounded-full bg-lavender-300 px-8 py-3 font-bold text-white shadow-lg shadow-lavender-200 transition-transform transition-colors duration-200 hover:scale-105 hover:bg-lavender-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff] motion-reduce:transform-none motion-reduce:transition-none"
              >
                进入公共梦域
              </Link>
            </div>
          </div>

          <footer className="relative z-10 mt-12 py-8 text-center text-sm font-medium text-slate-400">
            <p>© 2026 奇迹工坊 Wonder Workshop · 让想象力自由飞翔</p>
          </footer>
        </div>
      </main>
    </div>
  )
}
