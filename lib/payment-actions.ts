'use server'

import { revalidatePath } from 'next/cache'

import { getSession, type SessionPayload } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PaymentStatus } from '@prisma/client'

async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  return session
}

export async function updateIdeaPrice(ideaId: string, price: number | null) {
  await requireAdmin()

  if (price !== null && !Number.isFinite(price)) {
    throw new Error('Invalid price')
  }

  const idea = await prisma.idea.update({
    where: { id: ideaId },
    data: { price },
  })

  revalidatePath(`/admin/ideas/${ideaId}`)

  return idea
}

export async function updatePaymentStatus(ideaId: string, status: PaymentStatus) {
  await requireAdmin()

  const paidAt =
    status === PaymentStatus.PAID
      ? new Date()
      : status === PaymentStatus.PENDING
        ? null
        : undefined

  const idea = await prisma.idea.update({
    where: { id: ideaId },
    data: { paymentStatus: status, paidAt },
  })

  revalidatePath(`/admin/ideas/${ideaId}`)

  return idea
}
