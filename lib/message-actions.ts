'use server'

import { redirect } from 'next/navigation'

import { MESSAGE_MAX_LENGTH } from '@/lib/constants'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export type CreateMessageResult =
  | { success: true; messageId: string }
  | { success: false; error: string }

type UserSummary = {
  id: string
  email: string
}

export type MessageWithUsers = {
  id: string
  content: string
  senderId: string
  receiverId: string
  ideaId: string
  isRead: boolean
  createdAt: Date
  sender: UserSummary
  receiver: UserSummary
}

export type InboxMessage = {
  id: string
  content: string
  isRead: boolean
  createdAt: Date
  sender: UserSummary
  idea: { id: string; title: string }
}

function normalizeContent(content: string): string {
  return content.trim()
}

function validateContent(content: string): string | null {
  const normalized = normalizeContent(content)
  if (normalized.length < 1) return '消息内容不能为空'
  if (normalized.length > MESSAGE_MAX_LENGTH) return `消息内容不能超过${MESSAGE_MAX_LENGTH}个字符`
  return null
}

export async function createMessage(
  ideaId: string,
  receiverId: string,
  content: string
): Promise<CreateMessageResult> {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const contentError = validateContent(content)
  if (contentError) {
    return { success: false, error: contentError }
  }

  if (receiverId === session.sub) {
    return { success: false, error: '不能给自己发送消息' }
  }

  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
    select: { id: true, userId: true, isDeleted: true },
  })
  if (!idea || idea.isDeleted) {
    return { success: false, error: '点子不存在或已删除' }
  }

  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
    select: { id: true },
  })
  if (!receiver) {
    return { success: false, error: '收件人不存在' }
  }

  // 只允许 idea owner 与对方用户在该 idea 下互发消息（避免把 idea 当成公共聊天室）
  if (session.sub !== idea.userId && receiverId !== idea.userId) {
    return { success: false, error: '无权限发送该点子的消息' }
  }

  const message = await prisma.message.create({
    data: {
      content: normalizeContent(content),
      senderId: session.sub,
      receiverId,
      ideaId: idea.id,
    },
    select: { id: true },
  })

  return { success: true, messageId: message.id }
}

export async function getMessagesByIdeaId(
  ideaId: string
): Promise<MessageWithUsers[]> {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
    select: { id: true, userId: true, isDeleted: true },
  })
  if (!idea || idea.isDeleted) {
    return []
  }

  const isOwner = idea.userId === session.sub

  const whereClause = isOwner
    ? { ideaId: idea.id }
    : {
        ideaId: idea.id,
        OR: [{ senderId: session.sub }, { receiverId: session.sub }],
      }

  return prisma.message.findMany({
    where: whereClause,
    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    select: {
      id: true,
      content: true,
      senderId: true,
      receiverId: true,
      ideaId: true,
      isRead: true,
      createdAt: true,
      sender: { select: { id: true, email: true } },
      receiver: { select: { id: true, email: true } },
    },
  })
}

export async function getInboxMessages(): Promise<InboxMessage[]> {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  return prisma.message.findMany({
    where: { receiverId: session.sub },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    select: {
      id: true,
      content: true,
      isRead: true,
      createdAt: true,
      sender: { select: { id: true, email: true } },
      idea: { select: { id: true, title: true } },
    },
  })
}
