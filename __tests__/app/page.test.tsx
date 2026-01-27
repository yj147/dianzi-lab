import { render, screen } from '@testing-library/react'

import { prisma } from '@/lib/db'
import Home from '@/app/(main)/page'

jest.mock('@/lib/db', () => ({
  prisma: {
    idea: {
      findMany: jest.fn(),
    },
  },
}))

describe('Home Page', () => {
  const findManyMock = prisma.idea.findMany as unknown as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('渲染 Hero 与核心区块', async () => {
    findManyMock.mockResolvedValueOnce([])

    const element = await Home()
    const { container } = render(element)

    expect(
      screen.getByRole('heading', { level: 1, name: /技术合伙人/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: '为什么选择我们？' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { level: 2, name: '客户案例库' }),
    ).toBeInTheDocument()
    expect(screen.getByText('暂无已交付案例')).toBeInTheDocument()

    expect(screen.queryByText('Test')).not.toBeInTheDocument()

    expect(container.querySelector('#capabilities')).toBeInTheDocument()
    expect(container.querySelector('#showcase')).toBeInTheDocument()
  })

  it('有已完成工具时渲染 Showcase 卡片，且不渲染 EmptyState', async () => {
    findManyMock.mockResolvedValueOnce([
      {
        id: '1',
        title: 'Test',
        description: 'Desc',
        tags: ['tag'],
      },
    ])

    const element = await Home()
    render(element)

    expect(screen.getAllByText('Test').length).toBeGreaterThan(0)
    expect(screen.getByText('Desc')).toBeInTheDocument()
    expect(screen.queryByText('暂无已交付案例')).not.toBeInTheDocument()
  })
})
