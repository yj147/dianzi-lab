import { prisma } from '@/lib/db'
import AdminHeader from '@/app/admin/_components/AdminHeader'
import TrashTable from './_components/TrashTable'

async function getTrashedIdeas() {
  return prisma.idea.findMany({
    where: { isDeleted: true },
    select: {
      id: true,
      title: true,
      description: true,
      updatedAt: true,
      user: { select: { email: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })
}

export default async function AdminTrashPage() {
  const ideas = await getTrashedIdeas()

  return (
    <div>
      <AdminHeader activeTab="TRASH" trashCount={ideas.length} />
      <TrashTable ideas={ideas} />
    </div>
  )
}
