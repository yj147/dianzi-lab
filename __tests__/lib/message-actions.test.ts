/**
 * @jest-environment node
 */

import {
  createMessage,
  getInboxMessages,
  getMessagesByIdeaId,
} from '@/lib/message-actions'

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
}))

jest.mock('@/lib/db', () => ({
  prisma: {
    idea: {
      findUnique: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    message: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}))

function getRedirectMock(): jest.Mock {
  return jest.requireMock('next/navigation').redirect as jest.Mock
}

function getSessionMock(): jest.Mock {
  return jest.requireMock('@/lib/auth').getSession as jest.Mock
}

function getPrismaMock() {
  return jest.requireMock('@/lib/db').prisma as {
    idea: { findUnique: jest.Mock }
    user: { findUnique: jest.Mock }
    message: { create: jest.Mock; findMany: jest.Mock }
  }
}

function mockNextRedirect(): void {
  getRedirectMock().mockImplementation((url: string) => {
    const error = new Error('NEXT_REDIRECT')
    ;(error as any).digest = `NEXT_REDIRECT;${url}`
    throw error
  })
}

describe('lib/message-actions.createMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockNextRedirect()
  })

  it('未登录时 redirect("/login")', async () => {
    getSessionMock().mockResolvedValue(null)

    await expect(createMessage('idea_1', 'u2', 'hi')).rejects.toThrow(
      'NEXT_REDIRECT'
    )
    expect(getRedirectMock()).toHaveBeenCalledWith('/login')
  })

  it('content 为空时返回校验错误', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'u1',
      email: 'a@example.com',
      role: 'USER',
    })

    await expect(createMessage('idea_1', 'u2', '   ')).resolves.toEqual({
      success: false,
      error: '消息内容不能为空',
    })

    const prisma = getPrismaMock()
    expect(prisma.idea.findUnique).not.toHaveBeenCalled()
    expect(prisma.message.create).not.toHaveBeenCalled()
  })

  it('content 超长时返回校验错误', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'u1',
      email: 'a@example.com',
      role: 'USER',
    })

    await expect(
      createMessage('idea_1', 'u2', 'a'.repeat(1001))
    ).resolves.toEqual({
      success: false,
      error: '消息内容不能超过1000个字符',
    })

    const prisma = getPrismaMock()
    expect(prisma.message.create).not.toHaveBeenCalled()
  })

  it('不允许自己给自己发消息', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'u1',
      email: 'a@example.com',
      role: 'USER',
    })

    await expect(createMessage('idea_1', 'u1', 'hi')).resolves.toEqual({
      success: false,
      error: '不能给自己发送消息',
    })

    const prisma = getPrismaMock()
    expect(prisma.message.create).not.toHaveBeenCalled()
  })

  it('无权限时返回错误（sender/receiver 都不是 idea owner）', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'u_sender',
      email: 'sender@example.com',
      role: 'USER',
    })

    const prisma = getPrismaMock()
    prisma.idea.findUnique.mockResolvedValue({
      id: 'idea_1',
      userId: 'u_owner',
      isDeleted: false,
    })
    prisma.user.findUnique.mockResolvedValue({ id: 'u_receiver' })

    await expect(createMessage('idea_1', 'u_receiver', 'hi')).resolves.toEqual({
      success: false,
      error: '无权限发送该点子的消息',
    })

    expect(prisma.message.create).not.toHaveBeenCalled()
  })

  it('成功创建返回 messageId', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'u_owner',
      email: 'owner@example.com',
      role: 'USER',
    })

    const prisma = getPrismaMock()
    prisma.idea.findUnique.mockResolvedValue({
      id: 'idea_1',
      userId: 'u_owner',
      isDeleted: false,
    })
    prisma.user.findUnique.mockResolvedValue({ id: 'u_receiver' })
    prisma.message.create.mockResolvedValue({ id: 'msg_1' })

    await expect(
      createMessage('idea_1', 'u_receiver', '  hello  ')
    ).resolves.toEqual({ success: true, messageId: 'msg_1' })

    expect(prisma.message.create).toHaveBeenCalledWith({
      data: {
        content: 'hello',
        senderId: 'u_owner',
        receiverId: 'u_receiver',
        ideaId: 'idea_1',
      },
      select: { id: true },
    })
  })

  it('idea 不存在时返回错误', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'u1',
      email: 'a@example.com',
      role: 'USER',
    })

    const prisma = getPrismaMock()
    prisma.idea.findUnique.mockResolvedValue(null)

    await expect(createMessage('idea_x', 'u2', 'hi')).resolves.toEqual({
      success: false,
      error: '点子不存在或已删除',
    })

    expect(prisma.message.create).not.toHaveBeenCalled()
  })

  it('idea 已删除时返回错误', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'u1',
      email: 'a@example.com',
      role: 'USER',
    })

    const prisma = getPrismaMock()
    prisma.idea.findUnique.mockResolvedValue({
      id: 'idea_1',
      userId: 'u_owner',
      isDeleted: true,
    })

    await expect(createMessage('idea_1', 'u2', 'hi')).resolves.toEqual({
      success: false,
      error: '点子不存在或已删除',
    })

    expect(prisma.message.create).not.toHaveBeenCalled()
  })

  it('收件人不存在时返回错误', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'u_owner',
      email: 'owner@example.com',
      role: 'USER',
    })

    const prisma = getPrismaMock()
    prisma.idea.findUnique.mockResolvedValue({
      id: 'idea_1',
      userId: 'u_owner',
      isDeleted: false,
    })
    prisma.user.findUnique.mockResolvedValue(null)

    await expect(createMessage('idea_1', 'u_nobody', 'hi')).resolves.toEqual({
      success: false,
      error: '收件人不存在',
    })

    expect(prisma.message.create).not.toHaveBeenCalled()
  })
})

describe('lib/message-actions.getMessagesByIdeaId', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockNextRedirect()
  })

  it('未登录时 redirect("/login")', async () => {
    getSessionMock().mockResolvedValue(null)

    await expect(getMessagesByIdeaId('idea_1')).rejects.toThrow('NEXT_REDIRECT')
    expect(getRedirectMock()).toHaveBeenCalledWith('/login')
  })

  it('owner 可查看该 idea 的消息', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'u_owner',
      email: 'owner@example.com',
      role: 'USER',
    })

    const prisma = getPrismaMock()
    prisma.idea.findUnique.mockResolvedValue({
      id: 'idea_1',
      userId: 'u_owner',
      isDeleted: false,
    })

    const messages = [
      {
        id: 'm1',
        content: 'hi',
        senderId: 'u_owner',
        receiverId: 'u_receiver',
        ideaId: 'idea_1',
        isRead: false,
        createdAt: new Date('2026-01-01T00:00:00Z'),
        sender: { id: 'u_owner', email: 'owner@example.com' },
        receiver: { id: 'u_receiver', email: 'recv@example.com' },
      },
    ]
    prisma.message.findMany.mockResolvedValue(messages)

    await expect(getMessagesByIdeaId('idea_1')).resolves.toEqual(messages)

    expect(prisma.message.findMany).toHaveBeenCalledWith({
      where: { ideaId: 'idea_1' },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      select: expect.objectContaining({
        sender: { select: { id: true, email: true } },
        receiver: { select: { id: true, email: true } },
      }),
    })
  })

  it('参与者可查看该 idea 的消息', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'u_participant',
      email: 'p@example.com',
      role: 'USER',
    })

    const prisma = getPrismaMock()
    prisma.idea.findUnique.mockResolvedValue({
      id: 'idea_1',
      userId: 'u_owner',
      isDeleted: false,
    })

    const messages = [
      {
        id: 'm1',
        content: 'hi',
        senderId: 'u_participant',
        receiverId: 'u_owner',
        ideaId: 'idea_1',
        isRead: false,
        createdAt: new Date('2026-01-01T00:00:00Z'),
        sender: { id: 'u_participant', email: 'p@example.com' },
        receiver: { id: 'u_owner', email: 'owner@example.com' },
      },
    ]
    prisma.message.findMany.mockResolvedValue(messages)

    await expect(getMessagesByIdeaId('idea_1')).resolves.toEqual(messages)

    expect(prisma.message.findMany).toHaveBeenCalledWith({
      where: {
        ideaId: 'idea_1',
        OR: [{ senderId: 'u_participant' }, { receiverId: 'u_participant' }],
      },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      select: expect.objectContaining({
        sender: { select: { id: true, email: true } },
        receiver: { select: { id: true, email: true } },
      }),
    })
  })

  it('无关用户不可查看，返回空数组', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'u_other',
      email: 'other@example.com',
      role: 'USER',
    })

    const prisma = getPrismaMock()
    prisma.idea.findUnique.mockResolvedValue({
      id: 'idea_1',
      userId: 'u_owner',
      isDeleted: false,
    })
    prisma.message.findMany.mockResolvedValue([])

    await expect(getMessagesByIdeaId('idea_1')).resolves.toEqual([])

    expect(prisma.message.findMany).toHaveBeenCalledWith({
      where: {
        ideaId: 'idea_1',
        OR: [{ senderId: 'u_other' }, { receiverId: 'u_other' }],
      },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      select: expect.objectContaining({
        sender: { select: { id: true, email: true } },
        receiver: { select: { id: true, email: true } },
      }),
    })
  })
})

describe('lib/message-actions.getInboxMessages', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockNextRedirect()
  })

  it('未登录时 redirect("/login")', async () => {
    getSessionMock().mockResolvedValue(null)

    await expect(getInboxMessages()).rejects.toThrow('NEXT_REDIRECT')
    expect(getRedirectMock()).toHaveBeenCalledWith('/login')
  })

  it('返回当前用户的收件箱消息（按 createdAt DESC）', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'u_receiver',
      email: 'recv@example.com',
      role: 'USER',
    })

    const prisma = getPrismaMock()
    const prismaMessages = [
      {
        id: 'm1',
        content: 'hi',
        isRead: false,
        createdAt: new Date('2026-01-02T00:00:00Z'),
        sender: { id: 'u_sender', email: 'sender@example.com' },
        idea: {
          id: 'idea_1',
          title: 't',
          price: 12.34,
          paymentStatus: 'PENDING',
          paidAt: null,
        },
      },
    ]
    prisma.message.findMany.mockResolvedValue(prismaMessages)

    await expect(getInboxMessages()).resolves.toEqual([
      {
        id: 'm1',
        content: 'hi',
        isRead: false,
        createdAt: new Date('2026-01-02T00:00:00Z'),
        sender: { id: 'u_sender', email: 'sender@example.com' },
        idea: {
          id: 'idea_1',
          title: 't',
          price: '12.34',
          paymentStatus: 'PENDING',
          paidAt: null,
        },
      },
    ])

    expect(prisma.message.findMany).toHaveBeenCalledWith({
      where: { receiverId: 'u_receiver' },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: {
        id: true,
        content: true,
        isRead: true,
        createdAt: true,
        sender: { select: { id: true, email: true } },
        idea: {
          select: {
            id: true,
            title: true,
            price: true,
            paymentStatus: true,
            paidAt: true,
          },
        },
      },
    })
  })
})
