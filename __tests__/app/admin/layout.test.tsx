import { fireEvent, render, screen, within, waitFor } from '@testing-library/react'
import { redirect, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { logout } from '@/lib/auth-actions'
import { prisma } from '@/lib/db'
import AdminLayout from '@/app/admin/layout'
import AdminDashboardPage from '@/app/admin/page'
import AdminIdeasPage from '@/app/admin/ideas/page'
import AdminUsersPage from '@/app/admin/users/page'
import AdminTrashPage from '@/app/admin/trash/page'
import IdeasTable from '@/app/admin/ideas/_components/IdeasTable'
import TrashTable from '@/app/admin/trash/_components/TrashTable'
import { getUsers } from '@/app/admin/users/_queries'
import { moveToTrash, updateIdeaStatus } from '@/app/admin/ideas/actions'
import { permanentDeleteIdea, restoreIdea } from '@/app/admin/trash/actions'

jest.mock('next/navigation', () => ({
  redirect: jest.fn().mockImplementation((url: string) => {
    const error = new Error('NEXT_REDIRECT')
    ;(error as any).digest = `NEXT_REDIRECT;${url}`
    throw error
  }),
  usePathname: jest.fn(),
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
}))

jest.mock('@/lib/auth-actions', () => ({
  logout: jest.fn(),
}))

jest.mock('@/lib/db', () => ({
  prisma: {
    $transaction: jest.fn(),
    idea: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    user: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
  },
}))

jest.mock('@/app/admin/users/_queries', () => ({
  getUsers: jest.fn(),
}))

jest.mock('@/app/admin/ideas/actions', () => ({
  moveToTrash: jest.fn(),
  updateIdeaStatus: jest.fn(),
}))

jest.mock('@/app/admin/trash/actions', () => ({
  permanentDeleteIdea: jest.fn(),
  restoreIdea: jest.fn(),
}))

// Mock Radix-based dialogs to keep tests focused on our behavior.
jest.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: ({ children }: { children: any }) => <div>{children}</div>,
  AlertDialogTrigger: ({ children }: { children: any }) => <>{children}</>,
  AlertDialogContent: ({ children }: { children: any }) => <div>{children}</div>,
  AlertDialogDescription: ({ children }: { children: any }) => <div>{children}</div>,
  AlertDialogFooter: ({ children }: { children: any }) => <div>{children}</div>,
  AlertDialogHeader: ({ children }: { children: any }) => <div>{children}</div>,
  AlertDialogTitle: ({ children }: { children: any }) => <div>{children}</div>,
  AlertDialogCancel: ({ children }: { children: any }) => <button type="button">{children}</button>,
  AlertDialogAction: ({
    children,
    onClick,
  }: {
    children: any
    onClick?: () => void
  }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}))

describe('Admin Layout', () => {
  const mockAdminSession = {
    sub: 'admin-1',
    email: 'admin@example.com',
    role: 'ADMIN',
  }

  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  }

  const mockSearchParams = {
    get: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(usePathname as jest.Mock).mockReturnValue('/admin')
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
  })

  it('redirects to /dashboard if no session', async () => {
    ;(getSession as jest.Mock).mockResolvedValue(null)

    try {
      await AdminLayout({ children: <div>Content</div> })
    } catch (e: any) {
      expect(e.message).toBe('NEXT_REDIRECT')
    }

    expect(redirect).toHaveBeenCalledWith('/dashboard')
  })

  it('redirects to /dashboard if user is not ADMIN', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({
      sub: 'user-1',
      email: 'user@example.com',
      role: 'USER',
    })

    try {
      await AdminLayout({ children: <div>Content</div> })
    } catch (e: any) {
      expect(e.message).toBe('NEXT_REDIRECT')
    }

    expect(redirect).toHaveBeenCalledWith('/dashboard')
  })

  it('renders desktop header + sidebar enhancements on /admin', async () => {
    ;(getSession as jest.Mock).mockResolvedValue(mockAdminSession)
    ;(usePathname as jest.Mock).mockReturnValue('/admin')

    const LayoutContent = await AdminLayout({ children: <div>Admin Content</div> })
    render(LayoutContent)

    // Desktop header breadcrumb shows correct Chinese page name.
    const desktopHeader = screen.getByText('后台管理').closest('header')
    expect(desktopHeader).toBeTruthy()
    expect(within(desktopHeader as HTMLElement).getByText('仪表板')).toBeInTheDocument()

    // Admin email is rendered in desktop header.
    expect(within(desktopHeader as HTMLElement).getByText(mockAdminSession.email)).toBeInTheDocument()

    // Logout button exists and has correct aria-label.
    const headerLogoutButton = within(desktopHeader as HTMLElement).getByRole('button', { name: '退出登录' })
    expect(headerLogoutButton).toHaveAttribute('aria-label', '退出登录')
    fireEvent.click(headerLogoutButton)
    expect(logout).toHaveBeenCalledTimes(1)

    // Sidebar enhancements.
    const desktopSidebar = screen
      .getAllByRole('complementary')
      .find((sidebar) => sidebar.className.includes('fixed'))
    expect(desktopSidebar).toBeTruthy()

    expect(within(desktopSidebar as HTMLElement).getByText('© 2026 点子 Lab')).toBeInTheDocument()

    const accountSection = within(desktopSidebar as HTMLElement).getByText('登录账号').closest('div')?.parentElement
    expect(accountSection).toHaveClass('md:hidden')

    const sidebarLogoutButton = within(desktopSidebar as HTMLElement).getByRole('button', { name: '退出登录' })
    fireEvent.click(sidebarLogoutButton)
    expect(logout).toHaveBeenCalledTimes(2)

    expect(screen.getByText('Admin Content')).toBeInTheDocument()
  })

  it('renders desktop breadcrumb for /admin/ideas', async () => {
    ;(getSession as jest.Mock).mockResolvedValue(mockAdminSession)
    ;(usePathname as jest.Mock).mockReturnValue('/admin/ideas')

    const LayoutContent = await AdminLayout({ children: <div>Ideas Page</div> })
    render(LayoutContent)

    const desktopHeader = screen.getByText('后台管理').closest('header')
    expect(desktopHeader).toBeTruthy()
    expect(within(desktopHeader as HTMLElement).getByText('点子管理')).toBeInTheDocument()
  })

  it('toggles mobile menu (covers overlay branch)', async () => {
    ;(getSession as jest.Mock).mockResolvedValue(mockAdminSession)

    const LayoutContent = await AdminLayout({ children: <div>Admin Content</div> })
    render(LayoutContent)

    expect(screen.queryByTestId('sidebar-overlay')).not.toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Open menu'))
    expect(screen.getByText('管理菜单')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-overlay')).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Close menu'))
    expect(screen.queryByTestId('sidebar-overlay')).not.toBeInTheDocument()
  })

  describe('Admin Pages (coverage)', () => {
    it('renders dashboard page with mocked stats', async () => {
      ;(prisma.idea.count as jest.Mock).mockResolvedValue(0)
      ;(prisma.user.count as jest.Mock).mockResolvedValue(0)
      ;(prisma.$transaction as jest.Mock).mockResolvedValue([10, 2, 3, 4, 1, 5])

      render(await AdminDashboardPage())
      expect(screen.getByText('仪表板')).toBeInTheDocument()
      expect(screen.getByText('欢迎回来')).toBeInTheDocument()
    })

    it('renders ideas page without status filter when search param is invalid', async () => {
      ;(prisma.idea.findMany as jest.Mock).mockResolvedValue([])

      render(await AdminIdeasPage({ searchParams: { status: 'INVALID' } }))
      expect(prisma.idea.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isDeleted: false },
        })
      )
      expect(screen.getByText('点子管理')).toBeInTheDocument()
      expect(screen.getByText('暂无点子')).toBeInTheDocument()
    })

    it('renders ideas page with status filter when search param is valid', async () => {
      ;(prisma.idea.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'idea-1',
          title: 'Test Idea',
          status: 'PENDING',
          createdAt: new Date('2026-01-01T00:00:00Z'),
          user: { email: 'user@example.com' },
        },
      ])

      render(await AdminIdeasPage({ searchParams: { status: 'PENDING' } }))
      expect(prisma.idea.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isDeleted: false, status: 'PENDING' },
        })
      )
      expect(screen.getAllByText('Test Idea')[0]).toBeInTheDocument()
    })

    it('renders users page with empty state', async () => {
      ;(getUsers as jest.Mock).mockResolvedValue([])
      render(await AdminUsersPage())
      expect(screen.getByText('用户管理')).toBeInTheDocument()
      expect(screen.getByText('暂无用户')).toBeInTheDocument()
    })

    it('renders users page with role formatting', async () => {
      ;(getUsers as jest.Mock).mockResolvedValue([
        {
          id: 'u1',
          email: 'admin@example.com',
          role: 'ADMIN',
          createdAt: new Date('2026-01-01T00:00:00Z'),
          _count: { ideas: 1 },
        },
        {
          id: 'u2',
          email: 'user@example.com',
          role: 'USER',
          createdAt: new Date('2026-01-02T00:00:00Z'),
          _count: { ideas: 0 },
        },
        {
          id: 'u3',
          email: 'mod@example.com',
          role: 'MOD',
          createdAt: new Date('2026-01-03T00:00:00Z'),
          _count: { ideas: 0 },
        },
      ])

      render(await AdminUsersPage())
      expect(screen.getAllByText('管理员')[0]).toBeInTheDocument()
      expect(screen.getAllByText('用户').length).toBeGreaterThanOrEqual(2)
    })

    it('renders trash page with empty state', async () => {
      ;(prisma.idea.findMany as jest.Mock).mockResolvedValue([])
      render(await AdminTrashPage())
      expect(screen.getByText('回收站')).toBeInTheDocument()
      expect(screen.getByText('回收站为空')).toBeInTheDocument()
    })

    it('renders trash page with ideas', async () => {
      ;(prisma.idea.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'trash-1',
          title: 'Trashed Idea',
          updatedAt: new Date('2026-01-01T00:00:00Z'),
          user: { email: 'user@example.com' },
        },
      ])

      render(await AdminTrashPage())
      expect(screen.getAllByText('Trashed Idea')[0]).toBeInTheDocument()
    })
  })

  describe('IdeasTable', () => {
    const ideas = [
      {
        id: 'idea-1',
        title: 'Idea A',
        status: 'PENDING',
        createdAt: new Date('2026-01-01T00:00:00Z'),
        user: { email: 'user@example.com' },
      },
    ]

    it('shows empty state when there are no ideas', () => {
      ;(mockSearchParams.get as jest.Mock).mockReturnValue(null)
      render(<IdeasTable ideas={[]} />)
      expect(screen.getByText('暂无点子')).toBeInTheDocument()
    })

    it('supports filtering and actions', async () => {
      ;(mockSearchParams.get as jest.Mock).mockReturnValue('PENDING')
      render(<IdeasTable ideas={ideas as any} />)

      // Filter select reads from search params.
      const filterSelect = screen.getByRole('combobox', { name: '状态筛选' })
      expect(filterSelect).toHaveValue('PENDING')

      // Change filter (value branch).
      fireEvent.change(filterSelect, { target: { value: 'APPROVED' } })
      expect(mockRouter.push).toHaveBeenCalledWith('/admin/ideas?status=APPROVED')
      expect(mockRouter.refresh).toHaveBeenCalledTimes(1)

      // Change filter back to empty (else branch).
      fireEvent.change(filterSelect, { target: { value: '' } })
      expect(mockRouter.push).toHaveBeenCalledWith('/admin/ideas')
      expect(mockRouter.refresh).toHaveBeenCalledTimes(2)

      // Status change action.
      const ideaRow = screen
        .getAllByRole('row')
        .find((row) => within(row).queryByText('Idea A'))
      expect(ideaRow).toBeTruthy()
      fireEvent.change(within(ideaRow as HTMLElement).getByRole('combobox', { name: '状态变更' }), {
        target: { value: 'COMPLETED' },
      })
      await waitFor(() =>
        expect(updateIdeaStatus).toHaveBeenCalledWith('idea-1', 'COMPLETED')
      )

      // Move to trash confirm action.
      fireEvent.click(within(ideaRow as HTMLElement).getByRole('button', { name: '确认移除' }))
      await waitFor(() => expect(moveToTrash).toHaveBeenCalledWith('idea-1'))
    })

    it('renders "-" when createdAt is invalid', () => {
      ;(mockSearchParams.get as jest.Mock).mockReturnValue(null)
      render(
        <IdeasTable
          ideas={
            [
              {
                ...ideas[0],
                createdAt: 'invalid-date',
              },
            ] as any
          }
        />
      )

      expect(screen.getAllByText('-')[0]).toBeInTheDocument()
    })
  })

  describe('TrashTable', () => {
    const trashedIdeas = [
      {
        id: 'trash-1',
        title: 'Trashed Idea',
        updatedAt: new Date('2026-01-01T00:00:00Z'),
        user: { email: 'user@example.com' },
      },
    ]

    it('supports restore and permanent delete actions', async () => {
      render(<TrashTable ideas={trashedIdeas as any} />)

      const trashedRow = screen
        .getAllByRole('row')
        .find((row) => within(row).queryByText('Trashed Idea'))
      expect(trashedRow).toBeTruthy()
      fireEvent.click(within(trashedRow as HTMLElement).getByRole('button', { name: '恢复' }))
      await waitFor(() => expect(restoreIdea).toHaveBeenCalledWith('trash-1'))

      fireEvent.click(within(trashedRow as HTMLElement).getByRole('button', { name: '确认删除' }))
      await waitFor(() => expect(permanentDeleteIdea).toHaveBeenCalledWith('trash-1'))
    })

    it('renders "-" when updatedAt is invalid', () => {
      render(
        <TrashTable
          ideas={
            [
              {
                ...trashedIdeas[0],
                updatedAt: 'invalid-date',
              },
            ] as any
          }
        />
      )

      expect(screen.getByText('-')).toBeInTheDocument()
    })
  })
})
