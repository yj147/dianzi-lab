import { fireEvent, render, screen, waitFor } from '@testing-library/react'

const refreshMock = jest.fn()

const restoreIdeaMock = jest.fn()
const permanentDeleteIdeaMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: refreshMock }),
}))

jest.mock('@/lib/db', () => ({
  prisma: {
    idea: {
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

jest.mock('@/app/admin/trash/actions', () => ({
  restoreIdea: (...args: any[]) => restoreIdeaMock(...args),
  permanentDeleteIdea: (...args: any[]) => permanentDeleteIdeaMock(...args),
}))

function getIdeaFindManyMock(): jest.Mock {
  return jest.requireMock('@/lib/db').prisma.idea.findMany as jest.Mock
}

describe('Admin Trash Page + Table', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('queries trashed ideas from prisma (isDeleted=true)', async () => {
    getIdeaFindManyMock().mockResolvedValue([])

    const AdminTrashPage = (await import('@/app/admin/trash/page')).default
    await AdminTrashPage()

    expect(getIdeaFindManyMock()).toHaveBeenCalledWith({
      where: { isDeleted: true },
      include: { user: { select: { email: true } } },
      orderBy: { updatedAt: 'desc' },
    })
  })

  it('renders empty state when there are no trashed ideas', async () => {
    getIdeaFindManyMock().mockResolvedValue([])

    const AdminTrashPage = (await import('@/app/admin/trash/page')).default
    const element = await AdminTrashPage()
    render(element)

    expect(screen.getByText('回收站')).toBeInTheDocument()
    expect(screen.getByText('回收站为空')).toBeInTheDocument()
  })

  it('renders trashed ideas list', async () => {
    getIdeaFindManyMock().mockResolvedValue([
      {
        id: 'idea_1',
        title: 'Idea 1',
        updatedAt: new Date('2026-01-02T00:00:00Z'),
        user: { email: 'u1@example.com' },
      },
    ])

    const AdminTrashPage = (await import('@/app/admin/trash/page')).default
    const element = await AdminTrashPage()
    render(element)

    expect(screen.getByText('Idea 1')).toBeInTheDocument()
    expect(screen.getByText('u1@example.com')).toBeInTheDocument()
  })

  it('restore button calls restoreIdea + refresh', async () => {
    const { default: TrashTable } = await import('@/app/admin/trash/_components/TrashTable')

    render(
      <TrashTable
        ideas={[
          {
            id: 'idea_1',
            title: 'Idea 1',
            updatedAt: new Date('2026-01-02T00:00:00Z'),
            user: { email: 'u1@example.com' },
          },
        ]}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: '恢复' }))

    await waitFor(() => {
      expect(restoreIdeaMock).toHaveBeenCalledWith('idea_1')
      expect(refreshMock).toHaveBeenCalled()
    })
  })

  it('permanent delete shows confirmation and calls permanentDeleteIdea + refresh', async () => {
    const { default: TrashTable } = await import('@/app/admin/trash/_components/TrashTable')

    render(
      <TrashTable
        ideas={[
          {
            id: 'idea_1',
            title: 'Idea 1',
            updatedAt: new Date('2026-01-02T00:00:00Z'),
            user: { email: 'u1@example.com' },
          },
        ]}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: '永久删除' }))
    expect(screen.getByText('此操作不可撤销，是否继续？')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '确认删除' }))

    await waitFor(() => {
      expect(permanentDeleteIdeaMock).toHaveBeenCalledWith('idea_1')
      expect(refreshMock).toHaveBeenCalled()
    })
  })
})

