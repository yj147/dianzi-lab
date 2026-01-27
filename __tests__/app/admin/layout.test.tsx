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
  usePathname: jest.fn(() => '/admin'),
}))

// Mock motion/react to avoid issues with useReducedMotion and AnimatePresence
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: jest.fn(() => false),
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

  it('renders navbar/footer and children for ADMIN session', async () => {
    ;(getSession as jest.Mock).mockResolvedValue(mockAdminSession)

    const LayoutContent = await AdminLayout({ children: <div>Admin Content</div> })
    render(LayoutContent)

    expect(screen.getByTestId('navbar')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
    expect(screen.getByText('Admin Content')).toBeInTheDocument()
  })
})
