/**
 * @jest-environment node
 */

import { permanentDeleteIdea } from '@/app/admin/trash/actions'

jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
}))

jest.mock('@/lib/db', () => ({
  prisma: {
    idea: {
      delete: jest.fn(),
      update: jest.fn(),
    },
    message: {
      deleteMany: jest.fn(),
    },
    assessment: {
      deleteMany: jest.fn(),
    },
  },
}))

function getSessionMock(): jest.Mock {
  return jest.requireMock('@/lib/auth').getSession as jest.Mock
}

function getPrismaMock() {
  return jest.requireMock('@/lib/db').prisma as {
    idea: { delete: jest.Mock; update: jest.Mock }
    message: { deleteMany: jest.Mock }
    assessment: { deleteMany: jest.Mock }
  }
}

function getRevalidateTagMock(): jest.Mock {
  return jest.requireMock('next/cache').revalidateTag as jest.Mock
}

describe('admin trash actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('throws when not admin', async () => {
    getSessionMock().mockResolvedValue({ role: 'USER' })

    await expect(permanentDeleteIdea('idea_1')).rejects.toThrow('Unauthorized')
  })

  it('deletes related records before deleting idea', async () => {
    getSessionMock().mockResolvedValue({ role: 'ADMIN' })

    const prisma = getPrismaMock()
    prisma.message.deleteMany.mockResolvedValue({ count: 1 })
    prisma.assessment.deleteMany.mockResolvedValue({ count: 1 })
    prisma.idea.delete.mockResolvedValue({ id: 'idea_1' })

    await permanentDeleteIdea('idea_1')

    expect(prisma.message.deleteMany).toHaveBeenCalledWith({
      where: { ideaId: 'idea_1' },
    })
    expect(prisma.assessment.deleteMany).toHaveBeenCalledWith({
      where: { ideaId: 'idea_1' },
    })
    expect(prisma.idea.delete).toHaveBeenCalledWith({ where: { id: 'idea_1' } })

    const messageCallOrder = prisma.message.deleteMany.mock.invocationCallOrder[0]
    const assessmentCallOrder =
      prisma.assessment.deleteMany.mock.invocationCallOrder[0]
    const deleteIdeaCallOrder = prisma.idea.delete.mock.invocationCallOrder[0]

    expect(messageCallOrder).toBeLessThan(deleteIdeaCallOrder)
    expect(assessmentCallOrder).toBeLessThan(deleteIdeaCallOrder)

    expect(getRevalidateTagMock()).toHaveBeenCalledWith('completed-ideas')
  })
})

