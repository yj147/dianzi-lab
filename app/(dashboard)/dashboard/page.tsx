import type { Prisma } from '@prisma/client'
import { format } from 'date-fns'
import { Activity, ArrowUpRight, FileText, Plus, Search, Trophy } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import StatusBadge from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { cn } from '@/lib/utils'

type DashboardPageProps = {
  searchParams?: {
    status?: string
    q?: string
  }
}

type StatusFilterKey = 'all' | 'incubating' | 'completed'

function normalizeQuery(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  return trimmed.slice(0, 100)
}

function normalizeStatus(value: string | undefined): StatusFilterKey {
  return value === 'completed' ? 'completed' : value === 'incubating' ? 'incubating' : 'all'
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await getSession()

  if (!session) {
    redirect('/login?callbackUrl=/dashboard')
  }

  const q = normalizeQuery(searchParams?.q)
  const status = normalizeStatus(normalizeQuery(searchParams?.status))

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

  const [ideas, totalCount, completedCount] = await Promise.all([
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
    prisma.idea.count({ where: { userId: session.sub, isDeleted: false } }),
    prisma.idea.count({ where: { userId: session.sub, isDeleted: false, status: 'COMPLETED' } }),
  ])

  const incubatingCount = Math.max(0, totalCount - completedCount)

  const buildDashboardHref = (nextStatus: StatusFilterKey, nextQuery: string | undefined = q) => {
    const params = new URLSearchParams()
    if (nextQuery) params.set('q', nextQuery)
    if (nextStatus !== 'all') params.set('status', nextStatus)
    const qs = params.toString()
    return qs ? `/dashboard?${qs}` : '/dashboard'
  }

  const filters = [
    { key: 'all', label: '全部' },
    { key: 'incubating', label: '孵化中' },
    { key: 'completed', label: '已完成' },
  ] as const

  const hasFilters = Boolean(q || status !== 'all')

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-balance font-heading text-3xl font-bold text-brand-dark sm:text-4xl">
            我的工坊
          </h1>
          <p className="text-pretty mt-2 text-gray-600">查看你提交的点子进度与评估结果。</p>
        </div>
        <Button asChild size="lg">
          <Link href="/submit" className="inline-flex items-center gap-2">
            <Plus className="size-5" aria-hidden="true" />
            提交新点子
          </Link>
        </Button>
      </header>

      <section className="mb-10 grid gap-6 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border-2 border-brand-dark bg-brand-surface p-6 shadow-solid-sm">
          <div className="flex size-12 items-center justify-center rounded-full bg-brand-primary text-white shadow-solid-sm">
            <FileText className="size-6" aria-hidden="true" />
          </div>
          <div>
            <div className="tabular-nums font-heading text-3xl font-bold text-brand-dark">{totalCount}</div>
            <div className="text-xs font-bold text-gray-500">提交总数</div>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border-2 border-brand-dark bg-brand-surface p-6 shadow-solid-sm">
          <div className="flex size-12 items-center justify-center rounded-full bg-brand-primary text-white shadow-solid-sm">
            <Activity className="size-6" aria-hidden="true" />
          </div>
          <div>
            <div className="tabular-nums font-heading text-3xl font-bold text-brand-dark">{incubatingCount}</div>
            <div className="text-xs font-bold text-gray-500">孵化中</div>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border-2 border-brand-dark bg-brand-surface p-6 shadow-solid-sm">
          <div className="flex size-12 items-center justify-center rounded-full bg-brand-primary text-white shadow-solid-sm">
            <Trophy className="size-6" aria-hidden="true" />
          </div>
          <div>
            <div className="tabular-nums font-heading text-3xl font-bold text-brand-dark">{completedCount}</div>
            <div className="text-xs font-bold text-gray-500">已完成</div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter) => {
              const active = status === filter.key
              return (
                <Link
                  key={filter.key}
                  href={buildDashboardHref(filter.key)}
                  className={cn(
                    'rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    active
                      ? 'border-brand-dark bg-brand-dark text-white'
                      : 'border-brand-dark bg-brand-surface text-brand-dark hover:bg-gray-50'
                  )}
                >
                  {filter.label}
                </Link>
              )
            })}
            {hasFilters ? (
              <Link
                href="/dashboard"
                className="ml-1 text-sm font-bold text-gray-500 underline-offset-4 hover:text-brand-dark hover:underline"
              >
                清除筛选
              </Link>
            ) : null}
          </div>

          <form action="/dashboard" method="get" className="flex w-full max-w-md items-center gap-2">
            {status !== 'all' ? <input type="hidden" name="status" value={status} /> : null}
            <label className="sr-only" htmlFor="dashboard-search">
              搜索
            </label>
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <Input
                id="dashboard-search"
                name="q"
                defaultValue={q ?? ''}
                placeholder="搜索标题或描述…"
                className="pl-10"
              />
            </div>
            <Button type="submit" variant="secondary" className="shrink-0">
              搜索
            </Button>
          </form>
        </div>

        {ideas.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-brand-dark/40 bg-brand-surface p-12 text-center shadow-solid-sm">
            <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-brand-primary text-white shadow-solid-sm">
              <FileText className="size-6" aria-hidden="true" />
            </div>
            <h2 className="text-balance font-heading text-2xl font-bold text-brand-dark">
              {hasFilters ? '没有匹配的点子' : '工坊空空如也'}
            </h2>
            <p className="text-pretty mx-auto mt-3 max-w-xl text-sm text-gray-600">
              {hasFilters
                ? '换个关键词或筛选条件试试，或者清除筛选返回全部列表。'
                : '每一个改变世界的产品都始于一个简单的想法。现在就开始你的第一个创作吧。'}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {hasFilters ? (
                <Button asChild variant="secondary">
                  <Link href="/dashboard">清除筛选</Link>
                </Button>
              ) : null}
              <Button asChild size="lg">
                <Link href="/submit" className="inline-flex items-center gap-2">
                  <Plus className="size-5" aria-hidden="true" />
                  {hasFilters ? '去提交新点子' : '提交第一个点子'}
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {ideas.map((idea) => (
              <article
                key={idea.id}
                className="rounded-xl border-2 border-brand-dark bg-brand-surface p-6 shadow-solid-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-heading text-xl font-bold text-brand-dark">{idea.title}</h3>
                      <StatusBadge status={idea.status} />
                    </div>
                    {idea.description ? (
                      <p className="text-pretty mt-2 text-sm text-gray-600">{idea.description}</p>
                    ) : null}
                    <p className="mt-3 font-mono text-xs text-gray-400">
                      Created: {format(new Date(idea.createdAt), 'yyyy-MM-dd')}
                    </p>
                  </div>

                  {idea.assessment ? (
                    <div className="flex shrink-0 items-center gap-3">
                      <Button asChild variant="secondary">
                        <Link href={`/idea/${idea.id}/result`} className="inline-flex items-center gap-2">
                          <ArrowUpRight className="size-4" aria-hidden="true" />
                          查看评估
                        </Link>
                      </Button>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

