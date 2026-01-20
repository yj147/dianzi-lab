import { fireEvent, render, screen, within } from '@testing-library/react'
import NavbarClient from '@/components/NavbarClient'
import Navbar from '@/components/Navbar'
import * as authActions from '@/lib/auth-actions'
import * as auth from '@/lib/auth'
import { redirect } from 'next/navigation'

// Mock logout action
jest.mock('@/lib/auth-actions', () => ({
  logout: jest.fn(),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

// Mock auth
jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
  clearSessionCookie: jest.fn(),
}))

describe('Navbar (Server Component)', () => {
  it('正确传递未登录状态给 NavbarClient', async () => {
    ;(auth.getSession as jest.Mock).mockResolvedValue(null)
    
    const NavbarResolved = await Navbar()
    render(NavbarResolved)
    
    expect(screen.getByRole('link', { name: '登录' })).toBeInTheDocument()
  })

  it('正确传递已登录状态给 NavbarClient', async () => {
    ;(auth.getSession as jest.Mock).mockResolvedValue({
      email: 'test@example.com',
      sub: '123',
      role: 'user'
    })
    
    const NavbarResolved = await Navbar()
    render(NavbarResolved)
    
    expect(screen.getAllByText('test@example.com')[0]).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: '退出' })[0]).toBeInTheDocument()
  })
})

describe('auth-actions', () => {
  it('logout action 清除 cookie 并重定向', async () => {
    // We need to use the actual implementation for this test or mock it correctly
    const { logout } = jest.requireActual('@/lib/auth-actions')
    
    await logout()
    
    expect(auth.clearSessionCookie).toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith('/login')
  })
})

describe('NavbarClient', () => {
  it('未登录时显示登录链接', () => {
    render(<NavbarClient isLoggedIn={false} />)
    expect(screen.getByRole('link', { name: '登录' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '退出' })).not.toBeInTheDocument()
  })

  it('已登录时显示退出按钮和用户邮箱', () => {
    const email = 'test@example.com'
    render(<NavbarClient isLoggedIn={true} userEmail={email} />)
    
    expect(screen.queryByRole('link', { name: '登录' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: '退出' })[0]).toBeInTheDocument()
    expect(screen.getAllByText(email)[0]).toBeInTheDocument()
  })

  it('点击退出按钮调用 logout action', async () => {
    const logoutSpy = jest.spyOn(authActions, 'logout')
    render(<NavbarClient isLoggedIn={true} userEmail="test@example.com" />)
    
    const logoutButton = screen.getByRole('button', { name: '退出' })
    fireEvent.click(logoutButton)
    
    expect(logoutSpy).toHaveBeenCalled()
  })

  it('可切换移动端菜单（未登录状态）', () => {
    const { container } = render(<NavbarClient isLoggedIn={false} />)
    const toggle = screen.getByRole('button', { name: '打开主菜单' })

    const mobileMenu = container.querySelector('#mobile-menu')
    expect(mobileMenu).toHaveAttribute('hidden')

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(mobileMenu).not.toHaveAttribute('hidden')

    const mobileNav = within(mobileMenu as HTMLElement)
    
    // Test clicking home link
    fireEvent.click(mobileNav.getByRole('link', { name: '首页' }))
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    
    fireEvent.click(toggle)
    // Test clicking submit link
    fireEvent.click(mobileNav.getByRole('link', { name: '提交点子' }))
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    
    fireEvent.click(toggle)
    fireEvent.click(mobileNav.getByRole('link', { name: '登录' }))

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(mobileMenu).toHaveAttribute('hidden')
  })

  it('可切换移动端菜单（已登录状态）', () => {
    const { container } = render(<NavbarClient isLoggedIn={true} userEmail="test@example.com" />)
    const toggle = screen.getByRole('button', { name: '打开主菜单' })

    fireEvent.click(toggle)
    const mobileMenu = container.querySelector('#mobile-menu')
    const mobileNav = within(mobileMenu as HTMLElement)
    
    expect(mobileNav.getByText('test@example.com')).toBeInTheDocument()
    const logoutButton = mobileNav.getByRole('button', { name: '退出' })
    
    fireEvent.click(logoutButton)
    expect(authActions.logout).toHaveBeenCalled()
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
})