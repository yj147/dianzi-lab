import { fireEvent, render, screen } from '@testing-library/react'

import PublicIdeaDetailPage from '@/app/idea/[id]/page'
import { prisma } from '@/lib/db'

const notFoundMock = jest.fn()

jest.mock('next/navigation', () => ({
  notFound: () => {
    notFoundMock()
    const error = new Error('NEXT_NOT_FOUND')
    ;(error as any).digest = 'NEXT_NOT_FOUND'
    throw error
  },
}))

jest.mock('@/lib/db', () => ({
  prisma: {
    idea: {
      findFirst: jest.fn(),
    },
  },
}))

describe('/idea/[id] Public Detail Page', () => {
  const findFirstMock = prisma.idea.findFirst as unknown as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('渲染已完成案例的字段与截图交互', async () => {
    findFirstMock.mockResolvedValueOnce({
      id: 'idea_1',
      title: '测试案例',
      description: '这是一个已完成案例的公开详情页描述。',
      status: 'COMPLETED',
      tags: ['工具', '效率'],
      screenshots: [
        'https://example.com/screenshot-1.png',
        'https://example.com/screenshot-2.png',
      ],
      techStack: ['Next.js', 'Prisma'],
      duration: '2周',
      externalUrl: 'https://example.com',
    })

    render(await PublicIdeaDetailPage({ params: { id: 'idea_1' } }))

    expect(
      screen.getByRole('heading', { level: 1, name: '测试案例' })
    ).toBeInTheDocument()
    expect(
      screen.getByText('这是一个已完成案例的公开详情页描述。')
    ).toBeInTheDocument()

    expect(screen.getByText('#工具')).toBeInTheDocument()
    expect(screen.getByText('#效率')).toBeInTheDocument()

    expect(screen.getByText('技术栈')).toBeInTheDocument()
    expect(screen.getByText('Next.js')).toBeInTheDocument()
    expect(screen.getByText('Prisma')).toBeInTheDocument()

    expect(screen.getByText('开发周期')).toBeInTheDocument()
    expect(screen.getByText('2周')).toBeInTheDocument()

    expect(screen.getByRole('link', { name: '访问项目' })).toHaveAttribute(
      'href',
      'https://example.com'
    )

    fireEvent.click(
      screen.getByRole('button', { name: '测试案例 截图 1' })
    )

    expect(
      screen.getByRole('dialog', { name: '截图预览' })
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '关闭预览' }))

    expect(
      screen.queryByRole('dialog', { name: '截图预览' })
    ).not.toBeInTheDocument()
  })

  it('非 COMPLETED（或不存在）返回 404', async () => {
    findFirstMock.mockResolvedValueOnce(null)

    try {
      await PublicIdeaDetailPage({ params: { id: 'idea_missing' } })
    } catch (error: any) {
      expect(error.message).toBe('NEXT_NOT_FOUND')
    }

    expect(notFoundMock).toHaveBeenCalled()
    expect(findFirstMock).toHaveBeenCalledWith({
      where: {
        id: 'idea_missing',
        status: 'COMPLETED',
        isDeleted: false,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        tags: true,
        screenshots: true,
        techStack: true,
        duration: true,
        externalUrl: true,
      },
    })
  })

  it('空字段不渲染对应区块', async () => {
    findFirstMock.mockResolvedValueOnce({
      id: 'idea_2',
      title: '空字段案例',
      description: '无截图/无技术栈/无外链。',
      status: 'COMPLETED',
      tags: [],
      screenshots: [],
      techStack: [],
      duration: null,
      externalUrl: null,
    })

    render(await PublicIdeaDetailPage({ params: { id: 'idea_2' } }))

    expect(
      screen.getByRole('heading', { level: 1, name: '空字段案例' })
    ).toBeInTheDocument()
    expect(screen.getByText('无截图/无技术栈/无外链。')).toBeInTheDocument()

    expect(screen.queryByText('项目截图')).not.toBeInTheDocument()
    expect(screen.queryByText('技术栈')).not.toBeInTheDocument()
    expect(screen.queryByText('开发周期')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: '访问项目' })
    ).not.toBeInTheDocument()
    expect(screen.queryByText(/^#/)).not.toBeInTheDocument()
  })
})
