import { render, screen } from '@testing-library/react'

import { prisma } from '@/lib/db'
import AdminDashboardPage from '@/app/admin/page'

jest.mock('@/lib/db', () => ({
  prisma: {
    $transaction: jest.fn(),
    idea: {
      count: jest.fn(),
    },
    user: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
  },
}))

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn().mockResolvedValue({
    sub: 'user-1',
    email: 'admin@example.com',
    role: 'ADMIN',
  }),
}))

describe('Admin: Dashboard + Users', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('渲染统计卡片，并使用 prisma.$transaction 聚合查询', async () => {
    ;(prisma.$transaction as jest.Mock).mockResolvedValue([10, 2, 3, 4, 1, 5])

    const element = await AdminDashboardPage()
    render(element)

    expect(screen.getByRole('heading', { level: 1, name: '仪表板' })).toBeInTheDocument()
    expect(screen.getByText('总点子数')).toBeInTheDocument()
    expect(screen.getByText('待审核')).toBeInTheDocument()
    expect(screen.getByText('已采纳')).toBeInTheDocument()
    expect(screen.getByText('开发中')).toBeInTheDocument()
    expect(screen.getByText('已完成')).toBeInTheDocument()
    expect(screen.getByText('总用户数')).toBeInTheDocument()

    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()

    // Verify welcome section shows admin email
    expect(screen.getByText('欢迎回来')).toBeInTheDocument()
    expect(screen.getByText('admin@example.com')).toBeInTheDocument()

    // Verify quick actions
    expect(screen.getByText('点子管理')).toBeInTheDocument()
    expect(screen.getByText('用户管理')).toBeInTheDocument()
    expect(screen.getByText('垃圾箱')).toBeInTheDocument()

    expect(prisma.$transaction).toHaveBeenCalledTimes(1)
    expect(prisma.idea.count).toHaveBeenCalledWith({ where: { isDeleted: false } })
    expect(prisma.idea.count).toHaveBeenCalledWith({
      where: { status: 'PENDING', isDeleted: false },
    })
    expect(prisma.idea.count).toHaveBeenCalledWith({
      where: { status: 'APPROVED', isDeleted: false },
    })
    expect(prisma.idea.count).toHaveBeenCalledWith({
      where: { status: 'IN_PROGRESS', isDeleted: false },
    })
    expect(prisma.idea.count).toHaveBeenCalledWith({
      where: { status: 'COMPLETED', isDeleted: false },
    })
    expect(prisma.user.count).toHaveBeenCalledTimes(1)
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

    const { default: AdminUsersPage } = await import('@/app/admin/users/page')
    const element = await AdminUsersPage()
    render(element)

    expect(screen.getByRole('heading', { level: 1, name: '用户管理' })).toBeInTheDocument()

    expect(screen.getByText('邮箱')).toBeInTheDocument()
    expect(screen.getByText('角色')).toBeInTheDocument()
    expect(screen.getByText('注册时间')).toBeInTheDocument()
    expect(screen.getByText('提交点子数')).toBeInTheDocument()

    expect(screen.getByText('admin@example.com')).toBeInTheDocument()
    expect(screen.getByText('user@example.com')).toBeInTheDocument()
    expect(screen.getByText('管理员')).toBeInTheDocument()
    expect(screen.getByText('用户')).toBeInTheDocument()
    expect(screen.getByText('2025-01-20')).toBeInTheDocument()
    expect(screen.getByText('2025-01-19')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()

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
  })
})

