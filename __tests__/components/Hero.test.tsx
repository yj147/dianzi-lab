import { render, screen } from '@testing-library/react'

import Hero from '@/components/Hero'

describe('Hero', () => {
  it('显示主标题', () => {
    render(<Hero />)
    expect(
      screen.getByRole('heading', { level: 1, name: /技术合伙人/ }),
    ).toBeInTheDocument()
  })

  it('显示副文案', () => {
    render(<Hero />)
    expect(
      screen.getByText(/您提供商业愿景/),
    ).toBeInTheDocument()
  })

  it('CTA 按钮1 指向 /submit', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: '加入等待名单' })).toHaveAttribute(
      'href',
      '/submit',
    )
  })

  it('CTA 按钮2 指向 /#capabilities', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: '查看服务能力' })).toHaveAttribute(
      'href',
      '/#capabilities',
    )
  })
})
