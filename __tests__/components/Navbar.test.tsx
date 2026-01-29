import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import NavbarClient from '@/components/NavbarClient'
import Navbar from '@/components/Navbar'
import * as authActions from '@/lib/auth-actions'
import * as auth from '@/lib/auth'
import { redirect, usePathname } from 'next/navigation'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock logout action
jest.mock('@/lib/auth-actions', () => ({
  logout: jest.fn(),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
  usePathname: jest.fn(() => '/'),
}))

// Mock auth
jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
  clearSessionCookie: jest.fn(),
}))

beforeEach(() => {
  jest.clearAllMocks()
  ;(usePathname as jest.Mock).mockReturnValue('/')
})

describe('Navbar (Server Component)', () => {
  it('正确传递未登录状态给 NavbarClient', async () => {
    ;(auth.getSession as jest.Mock).mockResolvedValue(null)

    const NavbarResolved = await Navbar()
    render(NavbarResolved)

    expect(screen.getByRole('link', { name: '登录' })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: '用户菜单' })
    ).not.toBeInTheDocument()
  })

  it('正确传递已登录状态给 NavbarClient', async () => {
    ;(auth.getSession as jest.Mock).mockResolvedValue({
      email: 'test@example.com',
      sub: '123',
      role: 'USER',
    })

    const NavbarResolved = await Navbar()
    render(NavbarResolved)

    expect(screen.getByRole('button', { name: '用户菜单' })).toBeInTheDocument()
  })
})

describe('auth-actions', () => {
  it('logout action 清除 cookie 并重定向', async () => {
    const { logout } = jest.requireActual('@/lib/auth-actions')

    await logout()

    expect(auth.clearSessionCookie).toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith('/login')
  })
})

describe('NavbarClient', () => {
  it('登录状态：渲染主导航与 CTA', () => {
    render(<NavbarClient isLoggedIn={true} userEmail="test@example.com" />)

    expect(screen.getByRole('link', { name: '探索' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '提交点子' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '我的点子' })).toBeInTheDocument()
  })

  it('未登录时显示登录链接', () => {
    render(<NavbarClient isLoggedIn={false} />)
    expect(screen.getByRole('link', { name: '登录' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '加入实验室' })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: '用户菜单' })
    ).not.toBeInTheDocument()
  })

  it('已登录时显示退出按钮和用户邮箱', () => {
    const email = 'test@example.com'
    render(<NavbarClient isLoggedIn={true} userEmail={email} />)

    expect(screen.queryByRole('link', { name: '登录' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '用户菜单' })).toBeInTheDocument()
  })

  it('桌面端用户下拉菜单：可打开/关闭，包含链接，退出触发 logout', async () => {
    render(<NavbarClient isLoggedIn={true} userEmail="test@example.com" />)

    const trigger = screen.getByRole('button', { name: '用户菜单' })

    expect(
      screen.queryByRole('menuitem', { name: '我的点子' })
    ).not.toBeInTheDocument()

    trigger.focus()
    fireEvent.keyDown(trigger, { key: 'Enter', code: 'Enter' })

    const dashboardItem = await screen.findByRole('menuitem', {
      name: '我的点子',
    })
    expect(dashboardItem).toHaveAttribute('href', '/dashboard')

    const menu = dashboardItem.closest('[role="menu"]')
    expect(menu).toBeInTheDocument()

    // Escape 关闭菜单
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
    await waitFor(() => {
      expect(
        screen.queryByRole('menuitem', { name: '我的点子' })
      ).not.toBeInTheDocument()
    })

    // 再次打开并点击退出
    trigger.focus()
    fireEvent.keyDown(trigger, { key: 'Enter', code: 'Enter' })
    fireEvent.click(await screen.findByRole('menuitem', { name: '退出登录' }))
    expect(authActions.logout).toHaveBeenCalled()
  })
})
