import type { IdeaStatus, Prisma } from '@prisma/client'
import { format } from 'date-fns'
import {
  Activity,
  ArrowUpRight,
  Beaker,
  CheckCircle2,
  Clock,
  FileText,
  Lightbulb,
  Plus,
  Rocket,
  Search,
  ThumbsUp,
  Trophy,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { getSession } from '@/lib/auth'
import { STATUS_CONFIG } from '@/lib/constants'
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

const STATUS_CARD_STYLE: Record<IdeaStatus, { icon: LucideIcon; color: string }> = {
  PENDING: { icon: Clock, color: 'text-gray-500 bg-gray-100 border-gray-200' },
  APPROVED: { icon: CheckCircle2, color: 'text-brand-primary bg-blue-50 border-blue-200' },
  IN_PROGRESS: { icon: Beaker, color: 'text-orange-600 bg-orange-50 border-orange-200' },
  COMPLETED: { icon: Rocket, color: 'text-brand-success bg-green-50 border-green-200' },
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

  const [ideas, totalCount, pendingCount, completedCount] = await Promise.all([
    prisma.idea.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        tags: true,
        status: true,
        createdAt: true,
        assessment: { select: { id: true } },
      },
    }),
    prisma.idea.count({ where: { userId: session.sub, isDeleted: false } }),
    prisma.idea.count({ where: { userId: session.sub, isDeleted: false, status: 'PENDING' } }),
    prisma.idea.count({ where: { userId: session.sub, isDeleted: false, status: 'COMPLETED' } }),
  ])

  const approvedCount = Math.max(0, totalCount - pendingCount)

  const buildDashboardHref = (nextStatus: StatusFilterKey, nextQuery: string | undefined = q) => {
    const params = new URLSearchParams()
    if (nextQuery) params.set('q', nextQuery)
    if (nextStatus !== 'all') params.set('status', nextStatus)
    const qs = params.toString()
    return qs ? `/dashboard?${qs}` : '/dashboard'
  }

  const filters = [
    { key: 'all', label: '全部' },
    { key: 'incubating', label: '未上线' },
    { key: 'completed', label: '已上线' },
  ] as const

  const hasFilters = Boolean(q || status !== 'all')

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-dark mb-2">我的点子</h1>
          <p className="text-gray-500 text-lg">查看你提交的项目进度。</p>
        </div>
        <Button asChild>
          <Link href="/submit">
            <Plus size={18} className="mr-2" aria-hidden="true" /> 提交新项目
          </Link>
        </Button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border-2 border-brand-dark rounded-xl p-6 shadow-solid-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-brand-primary rounded-full flex items-center justify-center">
            <FileText size={24} aria-hidden="true" />
          </div>
          <div>
            <div className="text-3xl font-heading font-bold text-brand-dark tabular-nums">{totalCount}</div>
            <div className="text-sm text-gray-500 font-bold">提交总数</div>
          </div>
        </div>
        <div className="bg-white border-2 border-brand-dark rounded-xl p-6 shadow-solid-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
            <Trophy size={24} aria-hidden="true" />
          </div>
          <div>
            <div className="text-3xl font-heading font-bold text-brand-dark tabular-nums">{approvedCount}</div>
            <div className="text-sm text-gray-500 font-bold">已被采纳</div>
          </div>
        </div>
        <div className="bg-white border-2 border-brand-dark rounded-xl p-6 shadow-solid-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center">
            <ThumbsUp size={24} aria-hidden="true" />
          </div>
          <div>
            <div className="text-3xl font-heading font-bold text-brand-dark tabular-nums">{completedCount}</div>
            <div className="text-sm text-gray-500 font-bold">已上线</div>
          </div>
        </div>
      </section>

      <h2 className="font-heading font-bold text-xl mb-6 text-brand-dark flex items-center gap-2">
        <Activity size={20} aria-hidden="true" />
        项目列表
      </h2>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white rounded-lg p-1 border border-brand-dark/10 shadow-sm">
            {filters.map((filter) => {
              const active = status === filter.key
              return (
                <Link
                  key={filter.key}
                  href={buildDashboardHref(filter.key)}
                  className={cn(
                    'px-4 py-2 rounded-md text-sm font-bold transition-colors',
                    active ? 'bg-brand-dark text-white' : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {filter.label}
                </Link>
              )
            })}
          </div>

          {hasFilters ? (
            <Link href="/dashboard" className="text-sm font-bold text-gray-500 hover:text-brand-dark hover:underline">
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
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              id="dashboard-search"
              name="q"
              defaultValue={q ?? ''}
              placeholder="搜索标题或描述…"
              className="w-full pl-10 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors text-sm"
            />
          </div>
          <Button type="submit" variant="secondary" className="shrink-0">
            搜索
          </Button>
        </form>
      </div>

      {ideas.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-16 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
            <Lightbulb size={40} aria-hidden="true" />
          </div>
          <h3 className="font-heading font-bold text-2xl text-gray-700 mb-2">
            {hasFilters ? '没有匹配的项目' : '暂无点子'}
          </h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            {hasFilters
              ? '换个关键词或筛选条件试试，或者清除筛选返回全部列表。'
              : '每一个改变世界的产品都始于一个简单的想法。现在就开始你的第一个创作吧。'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {hasFilters ? (
              <Button asChild variant="secondary" size="lg">
                <Link href="/dashboard">清除筛选</Link>
              </Button>
            ) : null}
            <Button asChild size="lg">
              <Link href="/submit">提交第一个点子</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {ideas.map((idea) => {
            const statusMeta = STATUS_CARD_STYLE[idea.status]
            const StatusIcon = statusMeta.icon

            return (
              <div
                key={idea.id}
                className="group bg-white border border-gray-200 hover:border-brand-dark rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-heading font-bold text-xl text-brand-dark">{idea.title}</h3>
                    <div className="hidden md:block w-px h-4 bg-gray-300" aria-hidden="true" />
                    <span className="text-xs font-mono text-gray-400">
                      Created: {format(new Date(idea.createdAt), 'yyyy-MM-dd')}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 leading-relaxed max-w-3xl">{idea.description}</p>

                  {idea.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {idea.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500 font-mono">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="w-full md:w-64 flex-shrink-0 bg-gray-50 rounded-lg p-4 border border-gray-100 group-hover:bg-white group-hover:shadow-inner transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn('p-2 rounded-lg border', statusMeta.color)}>
                      <StatusIcon size={20} aria-hidden="true" />
                    </div>
                    <span className="font-bold text-sm text-brand-dark">{STATUS_CONFIG[idea.status].label}</span>
                  </div>

                  <div className="text-xs text-gray-500 leading-snug">{STATUS_CONFIG[idea.status].description}</div>

                  {idea.assessment ? (
                    <div className="mt-3">
                      <Link href={`/idea/${idea.id}/result`} className="text-xs font-bold text-brand-primary hover:underline inline-flex items-center gap-1">
                        查看评估 <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
