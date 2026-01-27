import { render, screen } from '@testing-library/react'
import { redirect } from 'next/navigation'

import { prisma } from '@/lib/db'
import AdminDashboardPage from '@/app/admin/page'

jest.mock('next/navigation', () => ({
  redirect: jest.fn().mockImplementation((url: string) => {
    const error = new Error('NEXT_REDIRECT')
    ;(error as any).digest = `NEXT_REDIRECT;${url}`
    throw error
  }),
}))

jest.mock('@/lib/db', () => ({
  prisma: {
    idea: { count: jest.fn() },
    user: { findMany: jest.fn() },
  },
}))

describe('Admin: Dashboard + Users', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('redirects /admin to /admin/ideas', async () => {
    try {
      await AdminDashboardPage()
    } catch (e: any) {
      expect(e.message).toBe('NEXT_REDIRECT')
    }

    expect(redirect).toHaveBeenCalledWith('/admin/ideas')
  })

  it('渲染用户列表，并查询点子数量', async () => {
    ;(prisma.user.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'user-1',
        email: 'admin@example.com',
        role: 'ADMIN',
        createdAt: new Date('2025-01-20T12:00:00Z'),
        _count: { ideas: 3 },
      },
      {
        id: 'user-2',
        email: 'user@example.com',
        role: 'USER',
        createdAt: new Date('2025-01-19T12:00:00Z'),
        _count: { ideas: 0 },
      },
    ])
    ;(prisma.idea.count as jest.Mock).mockResolvedValue(2)

    const { default: AdminUsersPage } = await import('@/app/admin/users/page')
    const element = await AdminUsersPage()
    render(element)

    expect(screen.getByRole('heading', { level: 1, name: '主控制台' })).toBeInTheDocument()
    expect(screen.getByText('管理实验室成员及其权限。')).toBeInTheDocument()

    // Header tabs
    expect(screen.getByRole('link', { name: '项目管理' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '用户管理' })).toHaveClass('bg-brand-dark')
    expect(screen.getByRole('link', { name: /回收站/ })).toBeInTheDocument()

    // Table headers
    expect(screen.getByText('用户')).toBeInTheDocument()
    expect(screen.getByText('角色')).toBeInTheDocument()
    expect(screen.getByText('状态')).toBeInTheDocument()
    expect(screen.getByText('管理')).toBeInTheDocument()

    // User data (display names are local-part of email)
    expect(screen.getByText('admin')).toBeInTheDocument()
    expect(screen.getByText('user')).toBeInTheDocument()
    expect(screen.getAllByText('ADMIN').length).toBeGreaterThan(0)
    expect(screen.getAllByText('USER').length).toBeGreaterThan(0)
    expect(screen.getByText(/3 个项目/)).toBeInTheDocument()
    expect(screen.getByText(/0 个项目/)).toBeInTheDocument()

    expect(prisma.user.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { ideas: true } },
      },
    })
    expect(prisma.idea.count).toHaveBeenCalledWith({ where: { isDeleted: true } })
  })
})
