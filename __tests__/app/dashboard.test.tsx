import { render, screen } from '@testing-library/react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import DashboardPage from '@/app/(dashboard)/dashboard/page'

jest.mock('next/navigation', () => ({
  redirect: jest.fn().mockImplementation((url: string) => {
    const error = new Error('NEXT_REDIRECT')
    ;(error as any).digest = `NEXT_REDIRECT;${url}`
    throw error
  }),
}))

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
}))

jest.mock('@/lib/db', () => ({
  prisma: {
    idea: {
      findMany: jest.fn(),
    },
  },
}))

describe('Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('redirects to /login if no session', async () => {
    ;(getSession as jest.Mock).mockResolvedValue(null)

    try {
      await DashboardPage({})
    } catch (e: any) {
      expect(e.message).toBe('NEXT_REDIRECT')
    }

    expect(redirect).toHaveBeenCalledWith('/login')
  })

  it('renders dashboard with empty state if no ideas', async () => {
    const mockSession = {
      sub: 'user-1',
      email: 'test@example.com',
      role: 'USER',
    }
    ;(getSession as jest.Mock).mockResolvedValue(mockSession)
    ;(prisma.idea.findMany as jest.Mock).mockResolvedValue([])

    const PageContent = await DashboardPage({})
    render(PageContent)

    expect(screen.getByText('造梦者·test')).toBeInTheDocument()
    expect(screen.getByText('我的梦境记录')).toBeInTheDocument()
    expect(screen.getByText('梦境还在孵化中...')).toBeInTheDocument()
    expect(screen.getByText('播撒第一颗种子')).toBeInTheDocument()
    expect(screen.getByText('退出登录')).toBeInTheDocument()
  })

  it('renders dashboard with ideas list', async () => {
    const mockSession = {
      sub: 'user-1',
      email: 'test@example.com',
      role: 'USER',
    }
    const mockIdeas = [
      {
        id: 'idea-1',
        title: '测试点子',
        description: '这是一个测试点子的描述',
        status: 'PENDING',
        createdAt: new Date('2025-01-20'),
      },
    ]
    ;(getSession as jest.Mock).mockResolvedValue(mockSession)
    ;(prisma.idea.findMany as jest.Mock).mockResolvedValue(mockIdeas)

    const PageContent = await DashboardPage({})
    render(PageContent)

    expect(screen.getByText('测试点子')).toBeInTheDocument()
    expect(screen.getByText('这是一个测试点子的描述')).toBeInTheDocument()
    expect(screen.getByText('等待星光')).toBeInTheDocument()
  })

  it('truncates long descriptions', async () => {
    const mockSession = {
      sub: 'user-1',
      email: 'test@example.com',
      role: 'USER',
    }
    const longDescription = 'A'.repeat(200)
    const mockIdeas = [
      {
        id: 'idea-2',
        title: '长描述点子',
        description: longDescription,
        status: 'PENDING',
        createdAt: new Date('2025-01-20'),
      },
    ]
    ;(getSession as jest.Mock).mockResolvedValue(mockSession)
    ;(prisma.idea.findMany as jest.Mock).mockResolvedValue(mockIdeas)

    const PageContent = await DashboardPage({})
    render(PageContent)

    const truncatedText = 'A'.repeat(80) + '…'
    expect(screen.getByText(truncatedText)).toBeInTheDocument()
  })
})
