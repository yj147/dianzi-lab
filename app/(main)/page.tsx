import Hero from '@/components/Hero'
import IdeaCard from '@/components/IdeaCard'
import { prisma } from '@/lib/db'
import Link from 'next/link'
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

async function getIncubatingIdeas() {
  return prisma.idea.findMany({
    where: {
      status: "IN_PROGRESS",
      isDeleted: false,
    },
    orderBy: { updatedAt: "desc" },
    take: 6,
    select: { id: true, title: true, description: true, tags: true },
  });
}

const getCompletedIdeasCached = unstable_cache(
  async (q?: string, tag?: string) => getCompletedIdeas({ q, tag }),
  ['completed-ideas'],
  { revalidate: 60, tags: ['completed-ideas'] },
)

const getIncubatingIdeasCached = unstable_cache(
  async () => getIncubatingIdeas(),
  ['incubating-ideas'],
  { revalidate: 60, tags: ['incubating-ideas'] },
)

export default async function Home({ searchParams }: HomePageProps) {
  const q = normalizeQuery(searchParams?.q)
  const tag = normalizeQuery(searchParams?.tag)
  const completedIdeas =
    process.env.NODE_ENV === 'test'
      ? await getCompletedIdeas({ q, tag })
      : await getCompletedIdeasCached(q, tag);
  const incubatingIdeas =
    process.env.NODE_ENV === 'test'
      ? await getIncubatingIdeas()
      : await getIncubatingIdeasCached()

  const tags = Array.from(new Set(completedIdeas.flatMap((idea) => idea.tags))).sort((a, b) =>
    a.localeCompare(b, 'zh-CN')
  )

  return (
    <div>
      <Hero />

      <section id="tools" className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-12 flex flex-col gap-4 border-b-2 border-brand-dark pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-heading text-4xl font-bold text-brand-dark">实验室出品</h2>
              <p className="mt-2 text-pretty text-lg text-gray-600">已经成功孵化并上线的小产品。</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/submit"
                className="text-sm font-bold text-gray-600 underline underline-offset-4 hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                我也要提交 →
              </Link>
              <p className="font-mono text-sm text-gray-500">LAUNCHED</p>
            </div>
          </div>

          <form method="GET" className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-[1fr,220px,auto]">
            <div>
              <label htmlFor="q" className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                搜索
              </label>
                <input
                  id="q"
                  name="q"
                  defaultValue={q}
                  placeholder="关键词（标题/描述）"
                  className="h-11 w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 text-sm text-brand-dark placeholder:text-gray-400 outline-none transition-colors duration-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:bg-white motion-reduce:transition-none"
                />
            </div>

            <div>
              <label htmlFor="tag" className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                标签
              </label>
              <select
                id="tag"
                name="tag"
                defaultValue={tag ?? ''}
                className="h-11 w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 text-sm font-mono text-gray-700 outline-none transition-colors duration-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:bg-white motion-reduce:transition-none"
              >
                <option value="">全部标签</option>
                  {tags.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-end gap-3">
              <button
                type="submit"
                className="h-11 rounded-lg border-2 border-brand-dark bg-brand-dark px-5 font-heading text-base font-bold text-white shadow-solid transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:bg-brand-accent hover:shadow-solid-lg active:translate-y-0 active:shadow-none motion-reduce:transition-none"
              >
                应用筛选
              </button>
              {q || tag ? (
                <Link
                  href="/#tools"
                  className="pb-2 text-sm font-bold text-gray-600 underline underline-offset-4 hover:text-brand-dark"
                >
                  清除
                </Link>
              ) : null}
            </div>
          </form>

          {completedIdeas.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {completedIdeas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} statusLabel="已上线" />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center shadow-solid-sm">
              <h3 className="font-heading text-2xl font-bold text-brand-dark">暂无已上线作品</h3>
              <p className="mt-2 text-pretty text-gray-600">先提交一个点子，开始你的第一张蓝图。</p>
              <div className="mt-8">
                <Link
                  href="/submit"
                  className="inline-flex h-11 items-center justify-center rounded-lg border-2 border-brand-dark bg-brand-dark px-5 font-heading text-base font-bold text-white shadow-solid transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:bg-brand-accent hover:shadow-solid-lg active:translate-y-0 active:shadow-none motion-reduce:transition-none"
                >
                  去提交点子
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="border-t-2 border-brand-dark/10 py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-12 flex flex-col gap-4 border-b-2 border-brand-dark pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-heading text-4xl font-bold text-brand-dark">孵化中</h2>
              <p className="mt-2 text-pretty text-lg text-gray-600">正在代码工厂中打磨的原型。</p>
            </div>
            <p className="font-mono text-sm text-gray-500">INCUBATING</p>
          </div>

          {incubatingIdeas.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {incubatingIdeas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} statusLabel="孵化中" />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center shadow-solid-sm">
              <h3 className="font-heading text-2xl font-bold text-brand-dark">还没有孵化中的项目</h3>
              <p className="mt-2 text-pretty text-gray-600">成为第一个播种灵感的人。</p>
              <div className="mt-8">
                <Link
                  href="/submit"
                  className="inline-flex h-11 items-center justify-center rounded-lg border-2 border-brand-dark bg-brand-dark px-5 font-heading text-base font-bold text-white shadow-solid transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:bg-brand-accent hover:shadow-solid-lg active:translate-y-0 active:shadow-none motion-reduce:transition-none"
                >
                  开始孵化
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="border-t-2 border-brand-dark/10 py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="rounded-2xl border-2 border-brand-dark bg-white p-10 text-center shadow-solid-lg md:p-14">
            <h2 className="text-balance font-heading text-4xl font-bold text-brand-dark">别让灵感溜走</h2>
            <p className="mt-4 text-pretty text-lg text-gray-600">
              今天提交的一个小点子，可能就是下一个改变世界的产品。
            </p>
            <div className="mt-10">
              <Link
                href="/submit"
                className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-brand-dark bg-brand-dark px-8 font-heading text-lg font-bold text-white shadow-solid transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:bg-brand-accent hover:shadow-solid-lg active:translate-y-0 active:shadow-none motion-reduce:transition-none"
              >
                开始孵化
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
