import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { IdeaStatus } from '@prisma/client'

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

// Helper to create complete mock idea data for trash
function createMockTrashedIdea(overrides: {
  id: string
  title: string
  updatedAt: Date
  email: string
}) {
  return {
    id: overrides.id,
    title: overrides.title,
    status: 'PENDING' as IdeaStatus,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    description: 'Test description',
    tags: [],
    userId: 'user_1',
    isDeleted: true,
    updatedAt: overrides.updatedAt,
    user: { email: overrides.email },
  }
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
      select: {
        id: true,
        title: true,
        description: true,
        updatedAt: true,
        user: { select: { email: true } },
      },
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
      createMockTrashedIdea({
        id: 'idea_1',
        title: 'Idea 1',
        updatedAt: new Date('2026-01-02T00:00:00Z'),
        email: 'u1@example.com',
      }),
    ])

    const AdminTrashPage = (await import('@/app/admin/trash/page')).default
    const element = await AdminTrashPage()
    render(element)

    // Data appears in both desktop and mobile views
    expect(screen.getAllByText('Idea 1').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Test description').length).toBeGreaterThan(0)
  })

  it('restore button calls restoreIdea + refresh', async () => {
    const { default: TrashTable } =
      await import('@/app/admin/trash/_components/TrashTable')

    render(
      <TrashTable
        ideas={[
          createMockTrashedIdea({
            id: 'idea_1',
            title: 'Idea 1',
            updatedAt: new Date('2026-01-02T00:00:00Z'),
            email: 'u1@example.com',
          }),
        ]}
      />
    )

    // Find restore button by aria-label
    const restoreButtons = screen.getAllByRole('button', { name: '恢复' })
    fireEvent.click(restoreButtons[0])

    await waitFor(() => {
      expect(restoreIdeaMock).toHaveBeenCalledWith('idea_1')
      expect(refreshMock).toHaveBeenCalled()
    })
  })

  it('permanent delete shows confirmation and calls permanentDeleteIdea + refresh', async () => {
    const { default: TrashTable } =
      await import('@/app/admin/trash/_components/TrashTable')

    render(
      <TrashTable
        ideas={[
          createMockTrashedIdea({
            id: 'idea_1',
            title: 'Idea 1',
            updatedAt: new Date('2026-01-02T00:00:00Z'),
            email: 'u1@example.com',
          }),
        ]}
      />
    )

    // Find permanent delete button by aria-label
    const deleteButtons = screen.getAllByRole('button', { name: '永久删除' })
    fireEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(screen.getByText('此操作不可撤销，是否继续？')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: '确认删除' }))

    await waitFor(() => {
      expect(permanentDeleteIdeaMock).toHaveBeenCalledWith('idea_1')
      expect(refreshMock).toHaveBeenCalled()
    })
  })
})
