import { render, screen } from '@testing-library/react'
import { redirect, usePathname } from 'next/navigation'

import { getSession } from '@/lib/auth'
import AdminLayout from '@/app/admin/layout'

jest.mock('next/navigation', () => ({
  redirect: jest.fn().mockImplementation((url: string) => {
    const error = new Error('NEXT_REDIRECT')
    ;(error as any).digest = `NEXT_REDIRECT;${url}`
    throw error
  }),
  usePathname: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
}))

// Keep this test focused on admin layout wiring, not global chrome.
jest.mock('@/components/Navbar', () => ({
  __esModule: true,
  default: () => <div data-testid="navbar" />,
}))

jest.mock('@/components/Footer', () => ({
  __esModule: true,
  default: () => <div data-testid="footer" />,
}))

describe('Admin Layout', () => {
  const mockAdminSession = {
    sub: 'admin-1',
    email: 'admin@example.com',
    role: 'ADMIN',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(usePathname as jest.Mock).mockReturnValue('/admin')
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

  it('renders AdminNav links and children for ADMIN session', async () => {
    ;(getSession as jest.Mock).mockResolvedValue(mockAdminSession)

    const LayoutContent = await AdminLayout({ children: <div>Admin Content</div> })
    render(LayoutContent)

    const nav = screen.getByRole('navigation', { name: '管理员导航' })
    expect(nav).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '仪表板' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '梦境管理' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '用户管理' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '回收站' })).toBeInTheDocument()
    expect(screen.getByText('Admin Content')).toBeInTheDocument()

    // Active state on /admin
    expect(screen.getByRole('link', { name: '仪表板' })).toHaveClass('bg-brand-dark')
  })

  it('highlights active link for /admin/ideas', async () => {
    ;(getSession as jest.Mock).mockResolvedValue(mockAdminSession)
    ;(usePathname as jest.Mock).mockReturnValue('/admin/ideas')

    const LayoutContent = await AdminLayout({ children: <div>Ideas Page</div> })
    render(LayoutContent)

    expect(screen.getByRole('link', { name: '梦境管理' })).toHaveClass('bg-brand-dark')
  })
})

