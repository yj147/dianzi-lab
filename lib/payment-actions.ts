'use server'

import { revalidatePath } from 'next/cache'

import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PaymentStatus } from '@prisma/client'

const PRICE_REGEX = /^\d+(\.\d{1,2})?$/
const MAX_PRICE = 9999999.99

export async function updateIdeaPrice(
  ideaId: string,
  price: string | null
): Promise<{ success: true; idea: { id: string; price: string | null } } | { success: false; error: string }> {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    return { success: false, error: '无权限操作' }
  }

  if (price !== null) {
    if (!PRICE_REGEX.test(price)) {
      return { success: false, error: '价格格式无效，应为数字且最多两位小数' }
    }
    const numPrice = parseFloat(price)
    if (numPrice < 0 || numPrice > MAX_PRICE) {
      return { success: false, error: `价格必须在 0 到 ${MAX_PRICE} 之间` }
    }
  }

  const idea = await prisma.idea.update({
    where: { id: ideaId },
    data: { price: price ? parseFloat(price) : null },
    select: { id: true, price: true },
  })

  revalidatePath(`/admin/ideas/${ideaId}`)

  return { success: true, idea: { id: idea.id, price: idea.price?.toString() ?? null } }
}

export async function updatePaymentStatus(
  ideaId: string,
  status: PaymentStatus
): Promise<{ success: true; idea: { id: string; paymentStatus: PaymentStatus; paidAt: Date | null } } | { success: false; error: string }> {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    return { success: false, error: '无权限操作' }
  }

  const paidAt =
    status === PaymentStatus.PAID
      ? new Date()
      : status === PaymentStatus.PENDING
        ? null
        : undefined

  const idea = await prisma.idea.update({
    where: { id: ideaId },
    data: { paymentStatus: status, paidAt },
    select: { id: true, paymentStatus: true, paidAt: true },
  })

  revalidatePath(`/admin/ideas/${ideaId}`)

  return { success: true, idea }
}
