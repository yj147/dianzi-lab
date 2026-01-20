import { render, screen } from '@testing-library/react'

import Home from '@/app/page'

describe('Home Page', () => {
  it('渲染 Hero 和 tools 区域', () => {
    const { container } = render(<Home />)

    expect(
      screen.getByRole('heading', { level: 1, name: '点子实验室' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: '浏览工具' }),
    ).toBeInTheDocument()

    expect(container.querySelector('#tools')).toBeInTheDocument()
  })
})

