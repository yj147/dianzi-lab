import { render, screen } from '@testing-library/react'

import Hero from '@/components/Hero'

describe('Hero', () => {
  it('显示主标题', () => {
    render(<Hero />)
    expect(
      screen.getByRole('heading', { level: 1, name: /让好点子.*想法/ }),
    ).toBeInTheDocument()
  })

  it('显示副文案', () => {
    render(<Hero />)
    expect(
      screen.getByText(/点子 Lab 是一个创意孵化器/),
    ).toBeInTheDocument()
  })

  it('CTA 按钮1 指向 /submit', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: '提交我的点子' })).toHaveAttribute(
      'href',
      '/submit',
    )
  })

  it('CTA 按钮2 指向 /#tools', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: '看看大家的作品' })).toHaveAttribute(
      'href',
      '/#tools',
    )
  })
})
