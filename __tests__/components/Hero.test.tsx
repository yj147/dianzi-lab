import { render, screen } from '@testing-library/react'

import Hero from '@/components/Hero'

describe('Hero', () => {
  it('显示主标题', () => {
    render(<Hero />)
    expect(
      screen.getByRole('heading', { level: 1, name: /点亮你的.*奇思妙想/ }),
    ).toBeInTheDocument()
  })

  it('显示副文案', () => {
    render(<Hero />)
    expect(
      screen.getByText(/每一个古怪的念头都能编织成现实/),
    ).toBeInTheDocument()
  })

  it('CTA 按钮1 指向 /submit', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: '编织梦想' })).toHaveAttribute(
      'href',
      '/submit',
    )
  })

  it('CTA 按钮2 指向 /#tools', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: '探索奇迹工坊' })).toHaveAttribute(
      'href',
      '/#tools',
    )
  })
})
