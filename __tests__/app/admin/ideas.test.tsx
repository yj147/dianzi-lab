import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import type { IdeaStatus } from '@prisma/client'

import AdminIdeasPage from '@/app/admin/ideas/page'
import IdeasTable from '@/app/admin/ideas/_components/IdeasTable'
import { prisma } from '@/lib/db'
import { moveToTrash, updateIdeaStatus } from '@/app/admin/ideas/actions'

const refreshMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: refreshMock }),
}))

jest.mock('@/lib/db', () => ({
  prisma: {
    idea: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}))

jest.mock('@/app/admin/ideas/actions', () => ({
  moveToTrash: jest.fn(),
  updateIdeaStatus: jest.fn(),
}))

// Mock Radix-based dialogs to keep tests focused on our behavior.
jest.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: ({ children }: { children: any }) => <div>{children}</div>,
  AlertDialogTrigger: ({ children }: { children: any }) => <>{children}</>,
  AlertDialogContent: ({ children }: { children: any }) => <div>{children}</div>,
  AlertDialogDescription: ({ children }: { children: any }) => <div>{children}</div>,
  AlertDialogFooter: ({ children }: { children: any }) => <div>{children}</div>,
  AlertDialogHeader: ({ children }: { children: any }) => <div>{children}</div>,
  AlertDialogTitle: ({ children }: { children: any }) => <div>{children}</div>,
  AlertDialogCancel: ({ children }: { children: any }) => <button type="button">{children}</button>,
  AlertDialogAction: ({
    children,
    onClick,
  }: {
    children: any
    onClick?: () => void
  }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}))

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
    ;(prisma.idea.count as jest.Mock).mockResolvedValue(0)
  })

  it('renders ideas list from prisma (isDeleted=false)', async () => {
    ;(prisma.idea.findMany as jest.Mock).mockResolvedValue([
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
    ])

    render(await AdminIdeasPage({ searchParams: {} }))

    expect(screen.getByText('项目管理')).toBeInTheDocument()
    expect(screen.getAllByText('Idea 1')[0]).toBeInTheDocument()
    expect(screen.getAllByText('u1')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Idea 2')[0]).toBeInTheDocument()
    expect(screen.getAllByText('u2')[0]).toBeInTheDocument()

    const row1 = screen.getAllByRole('row').find((r) => within(r).queryByText('Idea 1'))
    expect(row1).toBeTruthy()
    expect(within(row1 as HTMLElement).getByText('审核中')).toBeInTheDocument()

    const row2 = screen.getAllByRole('row').find((r) => within(r).queryByText('Idea 2'))
    expect(row2).toBeTruthy()
    expect(within(row2 as HTMLElement).getByText('已立项')).toBeInTheDocument()
  })

  it('applies status filter from URL searchParams', async () => {
    ;(prisma.idea.findMany as jest.Mock).mockResolvedValue([])
    await AdminIdeasPage({ searchParams: { status: 'PENDING' } })

    expect(prisma.idea.findMany).toHaveBeenCalledWith({
      where: { isDeleted: false, status: 'PENDING' },
      select: {
        id: true,
        title: true,
        description: true,
        tags: true,
        status: true,
        isDeleted: true,
        createdAt: true,
        user: { select: { email: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  })

  it('supports approve and reject actions', async () => {
    ;(updateIdeaStatus as jest.Mock).mockResolvedValue(undefined)
    ;(moveToTrash as jest.Mock).mockResolvedValue(undefined)
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
      />
    )

    const row = screen.getAllByRole('row').find((r) => within(r).queryByText('Idea 1'))
    expect(row).toBeTruthy()

    fireEvent.click(within(row as HTMLElement).getByRole('button', { name: '通过审核' }))
    await waitFor(() => expect(updateIdeaStatus).toHaveBeenCalledWith('idea_1', 'APPROVED'))
    await waitFor(() => expect(refreshMock).toHaveBeenCalled())

    fireEvent.click(within(row as HTMLElement).getByRole('button', { name: '确认移至回收站' }))
    await waitFor(() => expect(moveToTrash).toHaveBeenCalledWith('idea_1'))
    await waitFor(() => expect(refreshMock).toHaveBeenCalled())
  })

  it('renders an empty-state row when there are no ideas', () => {
    render(<IdeasTable ideas={[]} />)
    expect(screen.getByText('没有找到符合条件的项目')).toBeInTheDocument()
  })

  it('supports status transitions beyond approval', async () => {
    ;(updateIdeaStatus as jest.Mock).mockResolvedValue(undefined)

    render(
      <IdeasTable
        ideas={[
          createMockIdea({
            id: 'idea_approved',
            title: 'Idea Approved',
            status: 'APPROVED' as IdeaStatus,
            createdAt: new Date('2026-01-01T00:00:00Z'),
            email: 'u1@example.com',
          }),
          createMockIdea({
            id: 'idea_in_progress',
            title: 'Idea In Progress',
            status: 'IN_PROGRESS' as IdeaStatus,
            createdAt: new Date('2026-01-01T00:00:00Z'),
            email: 'u2@example.com',
          }),
          createMockIdea({
            id: 'idea_completed',
            title: 'Idea Completed',
            status: 'COMPLETED' as IdeaStatus,
            createdAt: new Date('2026-01-01T00:00:00Z'),
            email: 'u3@example.com',
          }),
        ]}
      />,
    )

    const approvedRow = screen.getAllByRole('row').find((r) => within(r).queryByText('Idea Approved'))
    expect(approvedRow).toBeTruthy()
    fireEvent.click(within(approvedRow as HTMLElement).getByRole('button', { name: '启动开发' }))
    await waitFor(() => expect(updateIdeaStatus).toHaveBeenCalledWith('idea_approved', 'IN_PROGRESS'))

    const inProgressRow = screen.getAllByRole('row').find((r) => within(r).queryByText('Idea In Progress'))
    expect(inProgressRow).toBeTruthy()
    fireEvent.click(within(inProgressRow as HTMLElement).getByRole('button', { name: '发布上线' }))
    await waitFor(() =>
      expect(updateIdeaStatus).toHaveBeenCalledWith('idea_in_progress', 'COMPLETED'),
    )
  })
})
