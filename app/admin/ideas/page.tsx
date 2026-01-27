import type { IdeaStatus } from '@prisma/client'

import Link from 'next/link'
import { Check, ChevronDown, Filter, Plus } from 'lucide-react'

import { prisma } from '@/lib/db'
import { STATUS_CONFIG } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import IdeasTable from './_components/IdeasTable'

function isIdeaStatus(value: string | undefined): value is IdeaStatus {
  return value !== undefined && Object.prototype.hasOwnProperty.call(STATUS_CONFIG, value)
}

async function getIdeas(status?: IdeaStatus) {
  return prisma.idea.findMany({
    where: {
      isDeleted: false,
      ...(status && { status }),
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      isDeleted: true,
      createdAt: true,
      user: { select: { email: true } },
      assessment: { select: { finalScore: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function AdminIdeasPage({
  searchParams,
}: {
  searchParams?: { status?: string }
}) {
  const status = isIdeaStatus(searchParams?.status) ? searchParams?.status : undefined
  const ideas = await getIdeas(status)
  const statusLabel = status ? STATUS_CONFIG[status].label : '全部梦境'

  return (
    <div className="space-y-10">
      {/* 页面头部 */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-balance font-heading text-3xl font-bold text-brand-dark md:text-4xl">
            梦境管理
          </h1>
          <p className="text-pretty mt-2 text-gray-600">审核和管理用户提交的点子。</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <details className="relative">
            <summary className="flex list-none cursor-pointer items-center gap-2 rounded-full border-2 border-brand-dark bg-brand-surface px-4 py-2 text-sm font-bold text-brand-dark shadow-solid-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none [&::-webkit-details-marker]:hidden">
              <Filter className="size-4 text-brand-primary" aria-hidden="true" />
              筛选：{statusLabel}
              <ChevronDown className="size-4 text-gray-400" aria-hidden="true" />
            </summary>
            <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border-2 border-brand-dark bg-white p-2 shadow-solid-sm">
              <Link
                href="/admin/ideas"
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-bold text-brand-dark transition-colors hover:bg-gray-50"
              >
                全部梦境
                {!status ? (
                  <Check className="size-4 text-brand-primary" aria-hidden="true" />
                ) : null}
              </Link>
              {(['PENDING', 'APPROVED', 'IN_PROGRESS', 'COMPLETED'] as const).map((nextStatus) => (
                <Link
                  key={nextStatus}
                  href={`/admin/ideas?status=${nextStatus}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-bold text-brand-dark transition-colors hover:bg-gray-50"
                >
                  {STATUS_CONFIG[nextStatus].label}
                  {status === nextStatus ? (
                    <Check className="size-4 text-brand-primary" aria-hidden="true" />
                  ) : null}
                </Link>
              ))}
            </div>
          </details>
          <Button asChild size="lg">
            <Link href="/submit" className="inline-flex items-center gap-2">
              <Plus className="size-5" aria-hidden="true" />
              新增点子
            </Link>
          </Button>
        </div>
      </div>

      <IdeasTable ideas={ideas} />
    </div>
  )
}
