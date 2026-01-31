'use server'

import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { revalidateTag } from 'next/cache'

async function requireAdmin(): Promise<void> {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }
}

export async function restoreIdea(ideaId: string) {
  await requireAdmin()
  await prisma.idea.update({
    where: { id: ideaId },
    data: { isDeleted: false },
  })
  revalidateTag('completed-ideas')
}

export async function permanentDeleteIdea(ideaId: string) {
  await requireAdmin()
  await prisma.message.deleteMany({ where: { ideaId } })
  await prisma.assessment.deleteMany({ where: { ideaId } })
  await prisma.idea.delete({ where: { id: ideaId } })
  revalidateTag('completed-ideas')
}
