'use server'

import type { IdeaStatus } from '@prisma/client'

import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { revalidateTag } from 'next/cache'

async function requireAdmin(): Promise<void> {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }
}

export async function updateIdeaStatus(ideaId: string, status: IdeaStatus) {
  await requireAdmin()
  await prisma.idea.update({ where: { id: ideaId }, data: { status } })
  revalidateTag('completed-ideas')
}

export async function moveToTrash(ideaId: string) {
  await requireAdmin()
  await prisma.idea.update({ where: { id: ideaId }, data: { isDeleted: true } })
  revalidateTag('completed-ideas')
}
