import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import NavbarClient from '@/components/NavbarClient'
import Navbar from '@/components/Navbar'
import * as authActions from '@/lib/auth-actions'
import * as auth from '@/lib/auth'
import { redirect, usePathname } from 'next/navigation'

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

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', {
    value,
    writable: true,
    configurable: true,
  })
}

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
    expect(screen.getAllByRole('button', { name: '退出', hidden: true })[0]).toBeInTheDocument()
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
  it('滚动阈值边界：scrollY=49/50 无 blur，scrollY=51 有 blur', () => {
    setScrollY(0)
    render(<NavbarClient isLoggedIn={false} />)

    const nav = screen.getByRole('navigation')

    setScrollY(49)
    fireEvent.scroll(window)
    expect(nav).not.toHaveClass('backdrop-blur-lg')

    setScrollY(50)
    fireEvent.scroll(window)
    expect(nav).not.toHaveClass('backdrop-blur-lg')

    setScrollY(51)
    fireEvent.scroll(window)
    expect(nav).toHaveClass('backdrop-blur-lg')

    // 回落到阈值以下，应移除 blur
    setScrollY(0)
    fireEvent.scroll(window)
    expect(nav).not.toHaveClass('backdrop-blur-lg')
  })

  it('当前路由匹配时设置 aria-current 并显示 active 样式', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/submit')
    render(<NavbarClient isLoggedIn={false} />)

    const submitLink = screen.getByRole('link', { name: '提交点子' })
    expect(submitLink).toHaveAttribute('aria-current', 'page')
    expect(submitLink.className).toContain('text-blue-600')

    const homeLink = screen.getByRole('link', { name: '首页' })
    expect(homeLink).not.toHaveAttribute('aria-current')
  })

  it('未登录时显示登录链接', () => {
    render(<NavbarClient isLoggedIn={false} />)
    expect(screen.getByRole('link', { name: '登录' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '退出' })).not.toBeInTheDocument()
  })

  it('已登录时显示退出按钮和用户邮箱', () => {
    const email = 'test@example.com'
    render(<NavbarClient isLoggedIn={true} userEmail={email} />)
    
    expect(screen.queryByRole('link', { name: '登录' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: '退出', hidden: true })[0]).toBeInTheDocument()
    expect(screen.getAllByText(email)[0]).toBeInTheDocument()
  })

  it('点击退出按钮调用 logout action', async () => {
    render(<NavbarClient isLoggedIn={true} userEmail="test@example.com" />)
    
    const logoutButton = screen.getAllByRole('button', { name: '退出', hidden: true })[0]
    fireEvent.click(logoutButton)
    
    expect(authActions.logout).toHaveBeenCalled()
  })

  it('桌面端用户下拉菜单：可打开/关闭，包含仪表板链接，退出触发 logout', async () => {
    render(<NavbarClient isLoggedIn={true} userEmail="test@example.com" />)

    const trigger = screen.getByRole('button', { name: '用户菜单' })

    expect(screen.queryByRole('menuitem', { name: '仪表板' })).not.toBeInTheDocument()

    trigger.focus()
    fireEvent.keyDown(trigger, { key: 'Enter', code: 'Enter' })

    const dashboardItem = await screen.findByRole('menuitem', { name: '仪表板' })
    expect(dashboardItem).toHaveAttribute('href', '/dashboard')
    const menu = dashboardItem.closest('[role="menu"]')
    expect(menu).toBeInTheDocument()
    expect(within(menu as HTMLElement).getByText('test@example.com')).toBeInTheDocument()

    // Escape 关闭菜单
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
    await waitFor(() => {
      expect(screen.queryByRole('menuitem', { name: '仪表板' })).not.toBeInTheDocument()
    })

    // 再次打开并点击退出
    trigger.focus()
    fireEvent.keyDown(trigger, { key: 'Enter', code: 'Enter' })
    fireEvent.click(await screen.findByRole('menuitem', { name: '退出' }))
    expect(authActions.logout).toHaveBeenCalled()
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
    
    fireEvent.click(mobileNav.getByRole('link', { name: '首页' }))
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    
    fireEvent.click(toggle)
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
