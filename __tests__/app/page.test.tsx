import { render, screen } from '@testing-library/react'

import { prisma } from '@/lib/db'
import Home from '@/app/(main)/page'

jest.mock('lucide-react', () => ({
  Sparkles: () => null,
  ChevronDown: () => <svg data-testid="chevron-down" />,
}))

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
    findManyMock.mockResolvedValue([])

    const element = await Home({})
    const { container } = render(element)

    expect(
      screen.getByRole('heading', { level: 1, name: /点亮你的.*奇思妙想/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: '梦境仓库' }),
    ).toBeInTheDocument()

    expect(
      screen.getByText('梦境还在孵化中...'),
    ).toBeInTheDocument()

    expect(screen.queryByText('Test')).not.toBeInTheDocument()

    expect(container.querySelector('#tools')).toBeInTheDocument()
  })

  it('有已完成工具时渲染 IdeaCard，且不渲染 EmptyState', async () => {
    findManyMock.mockResolvedValue([
      { id: '1', title: 'Test', description: 'Desc', tags: ['tag'] },
    ])

    const element = await Home({})
    render(element)

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('Desc')).toBeInTheDocument()
    expect(screen.getByText('tag', { selector: 'span' })).toBeInTheDocument()
    expect(
      screen.queryByText('梦境还在孵化中...'),
    ).not.toBeInTheDocument()
  })

  it('工具区域应用 organic-overlap 布局类', async () => {
    findManyMock.mockResolvedValue([])

    const element = await Home({})
    const { container } = render(element)

    const toolsSection = container.querySelector('#tools')
    expect(toolsSection).toHaveClass('organic-overlap')
  })
})
