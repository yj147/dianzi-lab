import Hero from '@/components/Hero'
import IdeaCard from "@/components/IdeaCard";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { unstable_cache } from 'next/cache'

type HomePageProps = {
  searchParams?: {
    q?: string
    tag?: string
  }
}

function normalizeQuery(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  return trimmed.slice(0, 100)
}

async function getCompletedIdeas({ q, tag }: { q?: string; tag?: string }) {
  return prisma.idea.findMany({
    where: {
      status: "COMPLETED",
      isDeleted: false,
      ...(tag ? { tags: { has: tag } } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, description: true, tags: true },
  });
}

const getCompletedIdeasCached = unstable_cache(
  async (q?: string, tag?: string) => getCompletedIdeas({ q, tag }),
  ['completed-ideas'],
  { revalidate: 60, tags: ['completed-ideas'] },
)

export default async function Home({ searchParams }: HomePageProps) {
  const q = normalizeQuery(searchParams?.q)
  const tag = normalizeQuery(searchParams?.tag)
  const ideas =
    process.env.NODE_ENV === 'test'
      ? await getCompletedIdeas({ q, tag })
      : await getCompletedIdeasCached(q, tag);

  return (
    <div className="text-slate-700">
      <Hero />

      <section id="tools" className="organic-overlap mx-auto max-w-6xl px-6">
        <div className="floating-card relative overflow-hidden p-10 md:p-12">
          <div className="blob-shape absolute right-0 top-0 size-64 bg-coral-400/5 -mr-20 -mt-20" aria-hidden="true" />

          <div className="relative z-10 mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
            <div className="text-left">
              <h2 className="text-balance mb-2 text-4xl font-bold text-slate-800">梦境仓库</h2>
              <p className="text-pretty font-medium text-slate-500">那些已经被赋予生命的奇妙装置...</p>
            </div>

            <div className="flex gap-4">
              <details className="relative">
                <summary
                  aria-label="筛选"
                  className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-center rounded-full bg-coral-100 p-3 text-coral-500 transition-colors hover:bg-coral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff] cursor-pointer"
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    filter_vintage
                  </span>
                </summary>
                <div className="absolute right-0 mt-3 w-64 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-lg backdrop-blur-md">
                  <p className="mb-3 text-sm font-bold text-slate-700">按标签筛选</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(ideas.flatMap((idea) => idea.tags))).map((t) => {
                      const params = new URLSearchParams()
                      params.set("tag", t)
                      if (q) params.set("q", q)
                      return (
                        <Link
                          key={t}
                          href={`/?${params.toString()}#tools`}
                          className="rounded-full border border-lavender-200 bg-white/70 px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-lavender-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff]"
                        >
                          {t}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </details>

              <details className="relative">
                <summary
                  aria-label="搜索"
                  className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-center rounded-full bg-lavender-100 p-3 text-lavender-500 transition-colors hover:bg-lavender-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff] cursor-pointer"
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    search
                  </span>
                </summary>
                <div className="absolute right-0 mt-3 w-72 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-lg backdrop-blur-md">
                  <form action="/#tools" method="GET" className="flex items-center gap-3">
                    {tag ? <input type="hidden" name="tag" value={tag} /> : null}
                    <label htmlFor="tools-search" className="sr-only">
                      搜索工具
                    </label>
                    <input
                      id="tools-search"
                      name="q"
                      defaultValue={q}
                      placeholder="搜索工具…"
                      className="h-12 w-full rounded-full border border-white/70 bg-white/60 px-5 text-sm font-medium text-slate-600 placeholder:text-slate-400 shadow-sm backdrop-blur-md outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff]"
                    />
                    <button
                      type="submit"
                      className="flex size-12 items-center justify-center rounded-full bg-lavender-100 text-lavender-500 shadow-sm transition-transform transition-colors duration-200 hover:scale-105 hover:bg-lavender-200 hover:text-lavender-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff] motion-reduce:transform-none motion-reduce:transition-none"
                      aria-label="搜索"
                    >
                      <span className="material-symbols-outlined" aria-hidden="true">
                        search
                      </span>
                    </button>
                  </form>

                  {tag || q ? (
                    <Link
                      href="/#tools"
                      className="mt-3 block text-center text-sm font-bold text-slate-500 underline decoration-2 underline-offset-2 hover:text-slate-700"
                    >
                      清除筛选
                    </Link>
                  ) : null}
                </div>
              </details>
            </div>
          </div>

          {ideas.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {ideas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="relative mb-10">
                <div className="flex size-48 items-center justify-center rounded-full border-4 border-dashed border-mint-200 bg-mint-50 animate-pulse motion-reduce:animate-none">
                  <span className="material-symbols-outlined text-8xl text-mint-200" aria-hidden="true">
                    bedroom_baby
                  </span>
                </div>
                <div className="absolute -right-4 -top-4 flex size-16 items-center justify-center rounded-full bg-coral-100 rotate-12">
                  <span className="material-symbols-outlined text-coral-400" aria-hidden="true">
                    nest_cam_magnet_mount
                  </span>
                </div>
              </div>

              <h3 className="text-balance mb-4 text-3xl font-bold text-slate-800">梦境还在孵化中...</h3>
              <p className="text-pretty mb-10 max-w-md text-lg font-medium text-slate-400">
                这片区域正虚位以待。快来释放你的想象力，成为第一个播种奇迹的人！
              </p>

              <Link
                href="/submit"
                className="rounded-3xl bg-mint-200 px-12 py-5 text-xl font-black text-emerald-800 border-b-8 border-mint-300 transition-transform hover:translate-y-1 hover:border-b-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff]"
              >
                播撒第一颗种子
              </Link>
            </div>
          )}

          <div className="absolute bottom-4 right-10 flex gap-2" aria-hidden="true">
            <div className="size-2 rounded-full bg-lavender-200" />
            <div className="size-2 rounded-full bg-mint-200" />
            <div className="size-2 rounded-full bg-coral-400" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-32 md:grid-cols-3">
        <div className="rounded-[3rem] border-2 border-lavender-100 bg-lavender-50/80 p-10 transition-transform hover:-rotate-2">
          <span className="material-symbols-outlined mb-6 text-5xl text-lavender-300" aria-hidden="true">
            bubble_chart
          </span>
          <h3 className="mb-4 text-2xl font-bold text-slate-800">无限气泡</h3>
          <p className="text-pretty font-medium text-slate-500">
            每个点子都是一个漂浮的气泡，在这里它们永远不会破碎。
          </p>
        </div>

        <div className="rounded-[3rem] border-2 border-mint-100 bg-mint-50/80 p-10 transition-transform md:translate-y-8 hover:rotate-2">
          <span className="material-symbols-outlined mb-6 text-5xl text-mint-200" aria-hidden="true">
            psychology_alt
          </span>
          <h3 className="mb-4 text-2xl font-bold text-slate-800">灵魂共鸣</h3>
          <p className="text-pretty font-medium text-slate-500">
            寻找与你频率相同的造梦者，让协作像云朵般轻盈。
          </p>
        </div>

        <div className="rounded-[3rem] border-2 border-coral-100/30 bg-coral-50/80 p-10 transition-transform hover:-rotate-1">
          <span className="material-symbols-outlined mb-6 text-5xl text-coral-400" aria-hidden="true">
            rocket_launch
          </span>
          <h3 className="mb-4 text-2xl font-bold text-slate-800">奇迹升空</h3>
          <p className="text-pretty font-medium text-slate-500">
            从草图到成品，我们提供最温柔的助推力。
          </p>
        </div>
      </section>
    </div>
  );
}
