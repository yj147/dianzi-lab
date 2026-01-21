import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { IdeaStatus } from '@prisma/client'

const pushMock = jest.fn()
const refreshMock = jest.fn()
let searchParams = new URLSearchParams()

const updateIdeaStatusMock = jest.fn()
const moveToTrashMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, refresh: refreshMock }),
  useSearchParams: () => searchParams,
}))

jest.mock('@/lib/db', () => ({
  prisma: {
    idea: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
  },
}))

jest.mock('@/app/admin/ideas/actions', () => ({
  updateIdeaStatus: (...args: any[]) => updateIdeaStatusMock(...args),
  moveToTrash: (...args: any[]) => moveToTrashMock(...args),
}))

function getIdeaFindManyMock(): jest.Mock {
  return jest.requireMock('@/lib/db').prisma.idea.findMany as jest.Mock
}

// Helper to create complete mock idea data
function createMockIdea(overrides: {
  id: string
  title: string
  status: IdeaStatus
  createdAt: Date
  email: string
}) {
  return {
    id: overrides.id,
    title: overrides.title,
    status: overrides.status,
    createdAt: overrides.createdAt,
    description: 'Test description',
    tags: [],
    userId: 'user_1',
    isDeleted: false,
    updatedAt: overrides.createdAt,
    user: { email: overrides.email },
  }
}

describe('Admin Ideas Page + Table', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    searchParams = new URLSearchParams()
  })

  it('renders ideas list from prisma (isDeleted=false)', async () => {
    const ideas = [
      createMockIdea({
        id: 'idea_1',
        title: 'Idea 1',
        status: 'PENDING' as IdeaStatus,
        createdAt: new Date('2026-01-01T00:00:00Z'),
        email: 'u1@example.com',
      }),
      createMockIdea({
        id: 'idea_2',
        title: 'Idea 2',
        status: 'APPROVED' as IdeaStatus,
        createdAt: new Date('2026-01-02T00:00:00Z'),
        email: 'u2@example.com',
      }),
    ]
    getIdeaFindManyMock().mockResolvedValue(ideas)

    const AdminIdeasPage = (await import('@/app/admin/ideas/page')).default
    const page = await AdminIdeasPage({ searchParams: {} })
    render(page)

    expect(screen.getByText('点子管理')).toBeInTheDocument()
    // Data appears in both desktop and mobile views
    expect(screen.getAllByText('Idea 1').length).toBeGreaterThan(0)
    expect(screen.getAllByText('u1@example.com').length).toBeGreaterThan(0)
    expect(screen.getAllByText('待审核').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Idea 2').length).toBeGreaterThan(0)
    expect(screen.getAllByText('u2@example.com').length).toBeGreaterThan(0)
    expect(screen.getAllByText('已采纳').length).toBeGreaterThan(0)
  })

  it('applies status filter from URL searchParams', async () => {
    getIdeaFindManyMock().mockResolvedValue([])

    const AdminIdeasPage = (await import('@/app/admin/ideas/page')).default
    await AdminIdeasPage({ searchParams: { status: 'PENDING' } })

    expect(getIdeaFindManyMock()).toHaveBeenCalledWith({
      where: { isDeleted: false, status: 'PENDING' },
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: 'desc' },
    })
  })

  it('status filter dropdown reads URL param and updates URL + refresh', async () => {
    searchParams = new URLSearchParams('status=PENDING')

    const { default: IdeasTable } = await import('@/app/admin/ideas/_components/IdeasTable')
    render(<IdeasTable ideas={[]} />)

    const filterSelect = screen.getByLabelText('状态筛选') as HTMLSelectElement
    expect(filterSelect.value).toBe('PENDING')

    fireEvent.change(filterSelect, { target: { value: 'APPROVED' } })

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/admin/ideas?status=APPROVED')
      expect(refreshMock).toHaveBeenCalled()
    })
  })

  it('row status change dropdown calls updateIdeaStatus + refresh', async () => {
    const { default: IdeasTable } = await import('@/app/admin/ideas/_components/IdeasTable')
    render(
      <IdeasTable
        ideas={[
          createMockIdea({
            id: 'idea_1',
            title: 'Idea 1',
            status: 'PENDING' as IdeaStatus,
            createdAt: new Date('2026-01-01T00:00:00Z'),
            email: 'u1@example.com',
          }),
        ]}
      />,
    )

    // Get all status change selects (desktop + mobile), pick the first one
    const statusSelects = screen.getAllByLabelText('状态变更') as HTMLSelectElement[]
    fireEvent.change(statusSelects[0], { target: { value: 'APPROVED' } })

    await waitFor(() => {
      expect(updateIdeaStatusMock).toHaveBeenCalledWith('idea_1', 'APPROVED')
      expect(refreshMock).toHaveBeenCalled()
    })
  })

  it('moveToTrash button shows confirmation dialog and calls moveToTrash + refresh', async () => {
    const { default: IdeasTable } = await import('@/app/admin/ideas/_components/IdeasTable')
    render(
      <IdeasTable
        ideas={[
          createMockIdea({
            id: 'idea_1',
            title: 'Idea 1',
            status: 'PENDING' as IdeaStatus,
            createdAt: new Date('2026-01-01T00:00:00Z'),
            email: 'u1@example.com',
          }),
        ]}
      />,
    )

    // Click the first delete button (icon button)
    const deleteButtons = screen.getAllByRole('button')
    const trashButton = deleteButtons.find(btn => btn.querySelector('svg'))
    if (trashButton) {
      fireEvent.click(trashButton)
    }

    await waitFor(() => {
      expect(screen.getByText('确认移至垃圾箱？')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: '确认移除' }))

    await waitFor(() => {
      expect(moveToTrashMock).toHaveBeenCalledWith('idea_1')
      expect(refreshMock).toHaveBeenCalled()
    })
  })
})
