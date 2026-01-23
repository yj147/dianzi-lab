import { prisma } from '@/lib/db'
import TrashTable from './_components/TrashTable'

async function getTrashedIdeas() {
  return prisma.idea.findMany({
    where: { isDeleted: true },
    select: {
      id: true,
      title: true,
      updatedAt: true,
      user: { select: { email: true } },
    },
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

      <TrashTable ideas={ideas} />
    </div>
  )
}
