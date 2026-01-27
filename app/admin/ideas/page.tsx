import type { IdeaStatus } from '@prisma/client'

import Link from 'next/link'

import PulseDot from '@/components/PulseDot'
import { prisma } from '@/lib/db'
import { STATUS_CONFIG } from '@/lib/constants'
import AdminHeader from '@/app/admin/_components/AdminHeader'
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
      tags: true,
      status: true,
      isDeleted: true,
      createdAt: true,
      user: { select: { email: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

async function getIdeaStats() {
  const [pendingCount, buildingCount, trashCount] = await Promise.all([
    prisma.idea.count({ where: { isDeleted: false, status: 'PENDING' } }),
    prisma.idea.count({ where: { isDeleted: false, status: 'IN_PROGRESS' } }),
    prisma.idea.count({ where: { isDeleted: true } }),
  ])

  return { pendingCount, buildingCount, trashCount }
}

export default async function AdminIdeasPage({
  searchParams,
}: {
  searchParams?: { status?: string }
}) {
  const status = isIdeaStatus(searchParams?.status) ? searchParams?.status : undefined
  const [ideas, stats] = await Promise.all([getIdeas(status), getIdeaStats()])

  const filters = [
    { key: 'ALL', label: '全部', href: '/admin/ideas' },
    ...(['PENDING', 'APPROVED', 'IN_PROGRESS', 'COMPLETED'] as const).map((key) => ({
      key,
      label: STATUS_CONFIG[key].label,
      href: `/admin/ideas?status=${key}`,
    })),
  ] as const

  return (
    <div>
      <AdminHeader activeTab="IDEAS" trashCount={stats.trashCount} />

      <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-brand-dark p-5 text-white shadow-solid-sm">
          <div className="mb-1 text-xs font-bold uppercase tracking-wider text-white/50">待审核</div>
          <div className="flex items-center gap-2 font-heading text-3xl font-bold tabular-nums">
            {stats.pendingCount}
            {stats.pendingCount > 0 ? (
              <PulseDot className="bg-red-500" />
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border-2 border-brand-dark bg-white p-5 shadow-solid-sm">
          <div className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-500">开发中</div>
          <div className="font-heading text-3xl font-bold tabular-nums text-orange-600">{stats.buildingCount}</div>
        </div>
      </section>

      <div className="mb-6 inline-flex flex-wrap gap-2 rounded-xl bg-gray-100 p-1.5">
        {filters.map((filter) => {
          const active = filter.key === 'ALL' ? !status : status === filter.key
          return (
            <Link
              key={filter.key}
              href={filter.href}
              className={
                active
                  ? 'rounded-lg bg-white px-4 py-2 text-sm font-bold text-brand-dark shadow-sm'
                  : 'rounded-lg px-4 py-2 text-sm font-bold text-gray-500 transition-all hover:bg-gray-200 hover:text-brand-dark'
              }
            >
              {filter.label}
            </Link>
          )
        })}
      </div>

      <IdeasTable ideas={ideas} />
    </div>
  )
}
