import type { IdeaStatus } from '@prisma/client'

import { prisma } from '@/lib/db'
import { STATUS_CONFIG } from '@/lib/constants'
import IdeasTable from './_components/IdeasTable'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'

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
          <h1 className="relative inline-block text-balance font-script text-5xl text-slate-800 md:text-6xl">
            梦境管理员
            <span className="absolute -right-8 -top-4 text-amber-400">
              <Sparkles className="h-8 w-8 fill-current" />
            </span>
          </h1>
          <p className="mt-2 pl-2 font-medium text-slate-500">
            审核来自世界各地的奇思妙想，编织新的现实。
          </p>
        </div>
        <div className="flex gap-4">
          <details className="relative">
            <summary className="flex list-none items-center gap-2 rounded-2xl border border-white/60 bg-white/60 px-5 py-2.5 font-bold text-slate-600 shadow-sm transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-400 motion-reduce:transition-none [&::-webkit-details-marker]:hidden">
              <span className="material-symbols-outlined text-lavender-400">filter_list</span>
              筛选：{statusLabel}
              <span className="material-symbols-outlined text-[20px] text-slate-400">expand_more</span>
            </summary>
            <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-2 shadow-lg backdrop-blur-xl">
              <Link
                href="/admin/ideas"
                className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-lavender-50"
              >
                全部梦境
                {!status ? (
                  <span className="material-symbols-outlined text-[18px] text-coral-400">check</span>
                ) : null}
              </Link>
              {(['PENDING', 'APPROVED', 'IN_PROGRESS', 'COMPLETED'] as const).map((nextStatus) => (
                <Link
                  key={nextStatus}
                  href={`/admin/ideas?status=${nextStatus}`}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-lavender-50"
                >
                  {STATUS_CONFIG[nextStatus].label}
                  {status === nextStatus ? (
                    <span className="material-symbols-outlined text-[18px] text-coral-400">check</span>
                  ) : null}
                </Link>
              ))}
            </div>
          </details>
          <a
            href="/submit"
            className="flex items-center gap-2 rounded-2xl bg-coral-400 px-6 py-2.5 font-bold text-white shadow-lg shadow-coral-400/20 transition-colors duration-200 hover:bg-coral-500 motion-reduce:transition-none"
          >
            <span className="material-symbols-outlined">add</span>
            新增灵感
          </a>
        </div>
      </div>

      <IdeasTable ideas={ideas} />
    </div>
  )
}
