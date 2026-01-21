import type { IdeaStatus } from '@prisma/client'

import { prisma } from '@/lib/db'
import { STATUS_CONFIG } from '@/lib/constants'
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
    include: { user: { select: { email: true } } },
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">点子管理</h1>
      </div>

      <IdeasTable ideas={ideas} />
    </div>
  )
}

