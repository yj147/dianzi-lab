/**
 * @jest-environment node
 */

import { updateIdeaShowcase } from '@/app/admin/ideas/actions'

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
}))

jest.mock('@/lib/db', () => ({
  prisma: {
    idea: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}))

function getSessionMock(): jest.Mock {
  return jest.requireMock('@/lib/auth').getSession as jest.Mock
}

function getPrismaIdeaMock() {
  return jest.requireMock('@/lib/db').prisma.idea as {
    findUnique: jest.Mock
    update: jest.Mock
  }
}

function getRevalidatePathMock(): jest.Mock {
  return jest.requireMock('next/cache').revalidatePath as jest.Mock
}

function getRevalidateTagMock(): jest.Mock {
  return jest.requireMock('next/cache').revalidateTag as jest.Mock
}

describe('app/admin/ideas/actions.updateIdeaShowcase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('rejects when not admin', async () => {
    getSessionMock().mockResolvedValue(null)

    await expect(
      updateIdeaShowcase('idea_1', {
        screenshots: [],
        techStack: [],
        duration: '',
        externalUrl: '',
      })
    ).resolves.toEqual({ success: false, error: '无权限操作' })
  })

  it('validates externalUrl format', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'admin_1',
      email: 'admin@example.com',
      role: 'ADMIN',
    })

    const prisma = getPrismaIdeaMock()

    await expect(
      updateIdeaShowcase('idea_1', {
        screenshots: [],
        techStack: [],
        duration: '',
        externalUrl: 'not-a-url',
      })
    ).resolves.toEqual({ success: false, error: '链接格式不正确' })

    expect(prisma.findUnique).not.toHaveBeenCalled()
    expect(prisma.update).not.toHaveBeenCalled()
  })

  it('rejects when idea not found or deleted', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'admin_1',
      email: 'admin@example.com',
      role: 'ADMIN',
    })

    const prisma = getPrismaIdeaMock()
    prisma.findUnique.mockResolvedValue(null)

    await expect(
      updateIdeaShowcase('idea_1', {
        screenshots: [],
        techStack: [],
        duration: '',
        externalUrl: '',
      })
    ).resolves.toEqual({ success: false, error: '点子不存在或已删除' })

    prisma.findUnique.mockResolvedValue({
      id: 'idea_1',
      isDeleted: true,
      status: 'COMPLETED',
    })

    await expect(
      updateIdeaShowcase('idea_1', {
        screenshots: [],
        techStack: [],
        duration: '',
        externalUrl: '',
      })
    ).resolves.toEqual({ success: false, error: '点子不存在或已删除' })
  })

  it('rejects when idea status is not COMPLETED', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'admin_1',
      email: 'admin@example.com',
      role: 'ADMIN',
    })

    const prisma = getPrismaIdeaMock()
    prisma.findUnique.mockResolvedValue({
      id: 'idea_1',
      isDeleted: false,
      status: 'IN_PROGRESS',
    })

    await expect(
      updateIdeaShowcase('idea_1', {
        screenshots: [],
        techStack: [],
        duration: '',
        externalUrl: '',
      })
    ).resolves.toEqual({ success: false, error: '仅已完成项目可编辑案例信息' })

    expect(prisma.update).not.toHaveBeenCalled()
  })

  it('updates showcase fields and revalidates caches', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'admin_1',
      email: 'admin@example.com',
      role: 'ADMIN',
    })

    const prisma = getPrismaIdeaMock()
    prisma.findUnique.mockResolvedValue({
      id: 'idea_1',
      isDeleted: false,
      status: 'COMPLETED',
    })

    prisma.update.mockResolvedValue(undefined)

    await expect(
      updateIdeaShowcase('idea_1', {
        screenshots: ['https://example.com/a.png'],
        techStack: ['Next.js'],
        duration: '2周',
        externalUrl: '',
      })
    ).resolves.toEqual({ success: true })

    expect(prisma.findUnique).toHaveBeenCalledWith({
      where: { id: 'idea_1' },
      select: { id: true, status: true, isDeleted: true },
    })

    expect(prisma.update).toHaveBeenCalledWith({
      where: { id: 'idea_1' },
      data: {
        screenshots: ['https://example.com/a.png'],
        techStack: ['Next.js'],
        duration: '2周',
        externalUrl: null,
      },
    })

    expect(getRevalidatePathMock()).toHaveBeenCalledWith('/admin/ideas/idea_1')
    expect(getRevalidateTagMock()).toHaveBeenCalledWith('completed-ideas')
  })
})

