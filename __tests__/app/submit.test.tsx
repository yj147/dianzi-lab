import { render, screen } from '@testing-library/react'

import SubmitPage from '@/app/submit/page'

describe('Submit Page', () => {
  it('渲染标题和返回首页链接', () => {
    render(<SubmitPage />)

    expect(
      screen.getByRole('heading', { level: 1, name: '提交点子' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '返回首页' })).toHaveAttribute(
      'href',
      '/',
    )
  })
})

