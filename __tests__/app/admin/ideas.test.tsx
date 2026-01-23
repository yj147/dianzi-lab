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

    expect(screen.getByText('梦境管理员')).toBeInTheDocument()
    expect(screen.getAllByText('Idea 1')[0]).toBeInTheDocument()
    expect(screen.getAllByText('u1@example.com')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Idea 2')[0]).toBeInTheDocument()
    expect(screen.getAllByText('u2@example.com')[0]).toBeInTheDocument()

    // Non-completed statuses share the incubating pill in this table.
    expect(screen.getAllByText('孵化中').length).toBeGreaterThan(0)
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

    fireEvent.click(within(row as HTMLElement).getByRole('button', { name: '批准' }))
    await waitFor(() => expect(updateIdeaStatus).toHaveBeenCalledWith('idea_1', 'APPROVED'))
    await waitFor(() => expect(refreshMock).toHaveBeenCalled())

    fireEvent.click(within(row as HTMLElement).getByRole('button', { name: '确认驳回' }))
    await waitFor(() => expect(moveToTrash).toHaveBeenCalledWith('idea_1'))
    await waitFor(() => expect(refreshMock).toHaveBeenCalled())
  })
})
