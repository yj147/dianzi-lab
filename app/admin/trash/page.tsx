import { prisma } from '@/lib/db'
import EmptyState from '@/components/EmptyState'
import TrashTable from './_components/TrashTable'

async function getTrashedIdeas() {
  return prisma.idea.findMany({
    where: { isDeleted: true },
    include: { user: { select: { email: true } } },
    orderBy: { updatedAt: 'desc' },
  })
}

export default async function AdminTrashPage() {
  const ideas = await getTrashedIdeas()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">回收站</h1>
      </div>

      {ideas.length === 0 ? (
        <EmptyState message="回收站为空" />
      ) : (
        <TrashTable ideas={ideas} />
      )}
    </div>
  )
}

