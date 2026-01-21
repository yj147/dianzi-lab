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

describe('Admin Ideas Page + Table', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    searchParams = new URLSearchParams()
  })

  it('renders ideas list from prisma (isDeleted=false)', async () => {
    const ideas = [
      {
        id: 'idea_1',
        title: 'Idea 1',
        status: 'PENDING' as IdeaStatus,
        createdAt: new Date('2026-01-01T00:00:00Z'),
        user: { email: 'u1@example.com' },
      },
      {
        id: 'idea_2',
        title: 'Idea 2',
        status: 'APPROVED' as IdeaStatus,
        createdAt: new Date('2026-01-02T00:00:00Z'),
        user: { email: 'u2@example.com' },
      },
    ]
    getIdeaFindManyMock().mockResolvedValue(ideas)

    const AdminIdeasPage = (await import('@/app/admin/ideas/page')).default
    const page = await AdminIdeasPage({ searchParams: {} })
    render(page)

    expect(screen.getByText('点子管理')).toBeInTheDocument()
    expect(screen.getByText('Idea 1')).toBeInTheDocument()
    expect(screen.getByText('u1@example.com')).toBeInTheDocument()
    expect(screen.getAllByText('待审核').length).toBeGreaterThan(0)
    expect(screen.getByText('Idea 2')).toBeInTheDocument()
    expect(screen.getByText('u2@example.com')).toBeInTheDocument()
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
          {
            id: 'idea_1',
            title: 'Idea 1',
            status: 'PENDING' as IdeaStatus,
            createdAt: new Date('2026-01-01T00:00:00Z'),
            user: { email: 'u1@example.com' },
          },
        ]}
      />,
    )

    const statusSelect = screen.getByLabelText('状态变更') as HTMLSelectElement
    fireEvent.change(statusSelect, { target: { value: 'APPROVED' } })

    await waitFor(() => {
      expect(updateIdeaStatusMock).toHaveBeenCalledWith('idea_1', 'APPROVED')
      expect(refreshMock).toHaveBeenCalled()
    })
  })

  it('moveToTrash button calls moveToTrash + refresh', async () => {
    const { default: IdeasTable } = await import('@/app/admin/ideas/_components/IdeasTable')
    render(
      <IdeasTable
        ideas={[
          {
            id: 'idea_1',
            title: 'Idea 1',
            status: 'PENDING' as IdeaStatus,
            createdAt: new Date('2026-01-01T00:00:00Z'),
            user: { email: 'u1@example.com' },
          },
        ]}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: '移至垃圾箱' }))

    await waitFor(() => {
      expect(moveToTrashMock).toHaveBeenCalledWith('idea_1')
      expect(refreshMock).toHaveBeenCalled()
    })
  })
})
