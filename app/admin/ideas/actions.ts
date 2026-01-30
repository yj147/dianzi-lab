'use server'

import type { IdeaStatus } from '@prisma/client'

import { getSession } from '@/lib/auth'
import { MESSAGE_MAX_LENGTH } from '@/lib/constants'
import { prisma } from '@/lib/db'
import { revalidatePath, revalidateTag } from 'next/cache'

export type AdminSendMessageResult =
  | { success: true; messageId: string }
  | { success: false; error: string }

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

export async function adminSendMessage(
  ideaId: string,
  content: string
): Promise<AdminSendMessageResult> {
  try {
    await requireAdmin()

    const session = await getSession()
    if (!session) {
      return { success: false, error: '未登录' }
    }

    const normalized = content.trim()
    if (normalized.length < 1) {
      return { success: false, error: '消息内容不能为空' }
    }
    if (normalized.length > MESSAGE_MAX_LENGTH) {
      return {
        success: false,
        error: `消息内容不能超过${MESSAGE_MAX_LENGTH}个字符`,
      }
    }

    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      select: { id: true, userId: true, isDeleted: true },
    })
    if (!idea || idea.isDeleted) {
      return { success: false, error: '点子不存在或已删除' }
    }

    const receiverId = idea.userId
    if (receiverId === session.sub) {
      return { success: false, error: '不能给自己发送消息' }
    }

    const message = await prisma.message.create({
      data: {
        content: normalized,
        senderId: session.sub,
        receiverId,
        ideaId: idea.id,
      },
      select: { id: true },
    })

    revalidatePath(`/admin/ideas/${ideaId}`)

    return { success: true, messageId: message.id }
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return { success: false, error: '无权限操作' }
    }

    return { success: false, error: '发送失败，请稍后再试' }
  }
}
