import { render, screen } from '@testing-library/react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import DashboardPage from '@/app/dashboard/page'

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

describe('Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('redirects to /login if no session', async () => {
    ;(getSession as jest.Mock).mockResolvedValue(null)
    
    try {
      await DashboardPage()
    } catch (e: any) {
      expect(e.message).toBe('NEXT_REDIRECT')
    }
    
    expect(redirect).toHaveBeenCalledWith('/login')
  })

  it('renders dashboard if session exists', async () => {
    const mockSession = {
      sub: 'user-1',
      email: 'test@example.com',
      role: 'USER',
    }
    ;(getSession as jest.Mock).mockResolvedValue(mockSession)

    const PageContent = await DashboardPage()
    render(PageContent)

    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('USER')).toBeInTheDocument()
    expect(screen.getByText(/控制面板/)).toBeInTheDocument()
    expect(screen.getByText(/欢迎回来/)).toBeInTheDocument()
  })
})
