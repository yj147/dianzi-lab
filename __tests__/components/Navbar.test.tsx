import { fireEvent, render, screen, within } from '@testing-library/react'

import Navbar from '@/components/Navbar'

describe('Navbar', () => {
  it('显示 Logo', () => {
    render(<Navbar />)
    const logo = screen.getByRole('link', { name: '点子实验室' })
    expect(logo).toHaveAttribute('href', '/')
  })

  it('显示导航链接（首页、提交点子）', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: '首页' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: '提交点子' })).toHaveAttribute(
      'href',
      '/submit',
    )
  })

  it('显示登录按钮', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: '登录' })).toHaveAttribute(
      'href',
      '/login',
    )
  })

  it('可切换移动端菜单（并可通过点击链接关闭）', () => {
    const { container } = render(<Navbar />)
    const toggle = screen.getByRole('button', { name: '打开主菜单' })

    const mobileMenu = container.querySelector('#mobile-menu')
    expect(mobileMenu).not.toBeNull()
    expect(mobileMenu).toHaveAttribute('hidden')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(mobileMenu).not.toHaveAttribute('hidden')

    const mobileNav = () => within(mobileMenu as HTMLElement)
    fireEvent.click(mobileNav().getByRole('link', { name: '提交点子' }))

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(mobileMenu).toHaveAttribute('hidden')

    fireEvent.click(toggle)
    fireEvent.click(mobileNav().getByRole('link', { name: '首页' }))
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(mobileMenu).toHaveAttribute('hidden')

    fireEvent.click(toggle)
    fireEvent.click(mobileNav().getByRole('link', { name: '登录' }))
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(mobileMenu).toHaveAttribute('hidden')
  })
})
