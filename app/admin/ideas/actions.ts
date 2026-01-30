'use server'

import type { IdeaStatus } from '@prisma/client'

import { getSession, type SessionPayload } from '@/lib/auth'
import { MESSAGE_MAX_LENGTH } from '@/lib/constants'
import { prisma } from '@/lib/db'
import { revalidatePath, revalidateTag } from 'next/cache'
import { showcaseEditSchema, type ShowcaseEditInput } from './[id]/schema'

export type AdminSendMessageResult =
  | { success: true; messageId: string }
  | { success: false; error: string }

export type UpdateIdeaShowcaseResult =
  | { success: true }
  | { success: false; error: string }

async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  return session
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

export async function updateIdeaShowcase(
  ideaId: string,
  input: ShowcaseEditInput
): Promise<UpdateIdeaShowcaseResult> {
  try {
    await requireAdmin()

    const parsed = showcaseEditSchema.safeParse(input)
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]
      return { success: false, error: firstIssue.message }
    }

    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      select: { id: true, status: true, isDeleted: true },
    })
    if (!idea || idea.isDeleted) {
      return { success: false, error: '点子不存在或已删除' }
    }
    if (idea.status !== 'COMPLETED') {
      return { success: false, error: '仅已完成项目可编辑案例信息' }
    }

    await prisma.idea.update({
      where: { id: ideaId },
      data: {
        screenshots: parsed.data.screenshots,
        techStack: parsed.data.techStack,
        duration: parsed.data.duration ? parsed.data.duration : null,
        externalUrl: parsed.data.externalUrl ? parsed.data.externalUrl : null,
      },
    })

    revalidatePath(`/admin/ideas/${ideaId}`)
    revalidateTag('completed-ideas')

    return { success: true }
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return { success: false, error: '无权限操作' }
    }

    return { success: false, error: '保存失败，请稍后再试' }
  }
}

export async function adminSendMessage(
  ideaId: string,
  content: string
): Promise<AdminSendMessageResult> {
  try {
    const session = await requireAdmin()

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
