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

  it('渲染 Hero 和 tools 区域', async () => {
    findManyMock.mockResolvedValueOnce([])
    findManyMock.mockResolvedValueOnce([])

    const element = await Home({})
    const { container } = render(element)

    expect(
      screen.getByRole('heading', { level: 1, name: /让好点子/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: '实验室出品' }),
    ).toBeInTheDocument()

    expect(
      screen.getByText('暂无已上线作品'),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { level: 2, name: '孵化中' }),
    ).toBeInTheDocument()
    expect(screen.getByText('还没有孵化中的项目')).toBeInTheDocument()

    expect(screen.queryByText('Test')).not.toBeInTheDocument()

    expect(container.querySelector('#tools')).toBeInTheDocument()
  })

  it('有已完成工具时渲染 IdeaCard，且不渲染 EmptyState', async () => {
    findManyMock.mockResolvedValueOnce([
      { id: '1', title: 'Test', description: 'Desc', tags: ['tag'] },
    ])
    findManyMock.mockResolvedValueOnce([])

    const element = await Home({})
    render(element)

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('Desc')).toBeInTheDocument()
    expect(screen.getByText('tag', { selector: 'span' })).toBeInTheDocument()
    expect(
      screen.queryByText('暂无已上线作品'),
    ).not.toBeInTheDocument()
  })
})
