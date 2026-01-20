import { render, screen } from '@testing-library/react'

import LoginPage from '@/app/login/page'

describe('Login Page', () => {
  it('渲染标题和注册链接', () => {
    render(<LoginPage />)

    expect(
      screen.getByRole('heading', { level: 1, name: '登录' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '没有账号？立即注册' })).toHaveAttribute(
      'href',
      '/register',
    )
  })
})

