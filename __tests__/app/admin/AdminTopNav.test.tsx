import { fireEvent, render, screen } from '@testing-library/react'
import { usePathname } from 'next/navigation'

import AdminTopNav from '@/app/admin/_components/AdminTopNav'
import { logout } from '@/lib/auth-actions'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

jest.mock('@/lib/auth-actions', () => ({
  logout: jest.fn(),
}))

describe('AdminTopNav', () => {
  const userEmail = 'admin@example.com'

  beforeEach(() => {
    jest.clearAllMocks()
    ;(usePathname as jest.Mock).mockReturnValue('/admin/ideas')
  })

  it('renders brand, nav items, and user info', () => {
    render(<AdminTopNav userEmail={userEmail} />)

    expect(screen.getByText('奇迹工坊')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '仪表板' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '点子管理' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '用户管理' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '垃圾箱' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '通知' })).toBeInTheDocument()
    expect(screen.getByText(userEmail)).toBeInTheDocument()
  })

  it('highlights active nav item', () => {
    render(<AdminTopNav userEmail={userEmail} />)

    const activeLink = screen.getByRole('link', { name: '点子管理' })
    expect(activeLink).toHaveClass('bg-white')
  })

  it('calls logout when clicking logout button', () => {
    render(<AdminTopNav userEmail={userEmail} />)

    fireEvent.click(screen.getByRole('button', { name: '退出登录' }))
    expect(logout).toHaveBeenCalledTimes(1)
  })
})

