import { render } from '@testing-library/react'
import type { IdeaStatus } from '@prisma/client'

import AdminIdeaDetailPage from '@/app/admin/ideas/[id]/page'

const showcaseProps: any[] = []

jest.mock('@/app/admin/ideas/[id]/ShowcaseEditForm', () => ({
  __esModule: true,
  default: (props: any) => {
    showcaseProps.push(props)
    return <div data-testid="showcase-form" />
  },
}))

jest.mock('@/app/admin/ideas/[id]/MessageSection', () => ({
  __esModule: true,
  default: () => <div data-testid="message-section" />,
}))

jest.mock('@/lib/db', () => ({
  prisma: {
    idea: { findUnique: jest.fn() },
    message: { findMany: jest.fn() },
  },
}))

function getPrismaMock() {
  return jest.requireMock('@/lib/db').prisma as {
    idea: { findUnique: jest.Mock }
    message: { findMany: jest.Mock }
  }
}

function createIdea(overrides: { id: string; status: IdeaStatus }) {
  return {
    id: overrides.id,
    title: 'Idea Title',
    description: 'Idea Description',
    status: overrides.status,
    tags: ['工具'],
    createdAt: new Date('2026-01-01T00:00:00Z'),
    userId: 'user_1',
    user: { email: 'user@example.com' },
    assessment: null,
    screenshots: [],
    techStack: [],
    duration: null,
    externalUrl: null,
  }
}

describe('/admin/ideas/[id] showcase integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    showcaseProps.length = 0
  })

  it('queries idea with showcase fields', async () => {
    const prisma = getPrismaMock()
    prisma.idea.findUnique.mockResolvedValue(createIdea({ id: 'idea_1', status: 'COMPLETED' }))
    prisma.message.findMany.mockResolvedValue([])

    render(await AdminIdeaDetailPage({ params: { id: 'idea_1' } }))

    expect(prisma.idea.findUnique).toHaveBeenCalledWith({
      where: { id: 'idea_1' },
      select: expect.objectContaining({
        id: true,
        title: true,
        status: true,
        screenshots: true,
        techStack: true,
        duration: true,
        externalUrl: true,
      }),
    })
  })

  it('passes canEdit=true only when status is COMPLETED', async () => {
    const prisma = getPrismaMock()
    prisma.idea.findUnique.mockResolvedValue(createIdea({ id: 'idea_1', status: 'COMPLETED' }))
    prisma.message.findMany.mockResolvedValue([])

    render(await AdminIdeaDetailPage({ params: { id: 'idea_1' } }))

    expect(showcaseProps[0]).toEqual(
      expect.objectContaining({ ideaId: 'idea_1', canEdit: true })
    )

    prisma.idea.findUnique.mockResolvedValue(createIdea({ id: 'idea_2', status: 'IN_PROGRESS' }))
    render(await AdminIdeaDetailPage({ params: { id: 'idea_2' } }))

    expect(showcaseProps[1]).toEqual(
      expect.objectContaining({ ideaId: 'idea_2', canEdit: false })
    )
  })
})

