import { render, screen } from '@testing-library/react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import AdminLayout from '@/app/admin/layout'

jest.mock('next/navigation', () => ({
  redirect: jest.fn().mockImplementation((url: string) => {
    const error = new Error('NEXT_REDIRECT')
    ;(error as any).digest = `NEXT_REDIRECT;${url}`
    throw error
  }),
  usePathname: jest.fn().mockReturnValue('/admin'),
}))

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
}))

jest.mock('@/lib/auth-actions', () => ({
  logout: jest.fn(),
}))

describe('Admin Layout', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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

  it('renders admin layout if user is ADMIN', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({
      sub: 'admin-1',
      email: 'admin@example.com',
      role: 'ADMIN',
    })

    const LayoutContent = await AdminLayout({ children: <div>Admin Content</div> })
    render(LayoutContent)

    expect(screen.getAllByText('点子 Lab 后台')[0]).toBeInTheDocument()
    expect(screen.getAllByText('仪表板')[0]).toBeInTheDocument()
    expect(screen.getAllByText('点子管理')[0]).toBeInTheDocument()
    expect(screen.getAllByText('用户管理')[0]).toBeInTheDocument()
    expect(screen.getAllByText('垃圾箱')[0]).toBeInTheDocument()
    expect(screen.getAllByText('admin@example.com')[0]).toBeInTheDocument()
    expect(screen.getByText('Admin Content')).toBeInTheDocument()
  })
})
