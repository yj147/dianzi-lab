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
    <div className="space-y-8">
      <header>
        <h1 className="text-balance font-heading text-3xl font-bold text-brand-dark sm:text-4xl">回收站</h1>
        <p className="text-pretty mt-2 text-gray-600">已删除点子的恢复与永久删除。</p>
      </header>

      <TrashTable ideas={ideas} />
    </div>
  )
}
