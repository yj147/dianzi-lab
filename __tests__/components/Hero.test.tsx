import { render, screen } from '@testing-library/react'

import Hero from '@/components/Hero'

jest.mock('lucide-react', () => ({
  ChevronDown: () => <svg data-testid="chevron-down" />,
}))

describe('Hero', () => {
  it('显示标题"点子实验室"', () => {
    render(<Hero />)
    expect(
      screen.getByRole('heading', { level: 1, name: '点子实验室' }),
    ).toBeInTheDocument()
  })

  it('显示副标题"你的创意，我们来实现"', () => {
    render(<Hero />)
    expect(screen.getByText('你的创意，我们来实现')).toBeInTheDocument()
  })

  it('CTA 按钮1 存在且 href="/submit"', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: '提交点子' })).toHaveAttribute(
      'href',
      '/submit',
    )
  })

  it('CTA 按钮2 存在且 href="#tools"', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: '浏览工具' })).toHaveAttribute(
      'href',
      '#tools',
    )
  })

  it('包含背景渐变类', () => {
    render(<Hero />)
    const heading = screen.getByRole('heading', { level: 1, name: '点子实验室' })
    const section = heading.closest('section')
    expect(section).toHaveClass('bg-gradient-to-br')
    expect(section).toHaveClass('from-blue-600')
    expect(section).toHaveClass('via-cyan-500')
    expect(section).toHaveClass('to-blue-400')
  })

  it('显示下滑引导箭头', () => {
    render(<Hero />)
    expect(screen.getByText('向下滚动')).toBeInTheDocument()
    expect(screen.getByTestId('chevron-down')).toBeInTheDocument()
  })

  it('下滑引导箭头链接到工具区域', () => {
    render(<Hero />)
    const scrollLink = screen.getByRole('link', { name: '滚动到工具区域' })
    expect(scrollLink).toHaveAttribute('href', '#tools')
  })
})
