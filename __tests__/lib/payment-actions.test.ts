/**
 * @jest-environment node
 */

import { PaymentStatus } from '@prisma/client'

import { updateIdeaPrice, updatePaymentStatus } from '@/lib/payment-actions'

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
}))

jest.mock('@/lib/db', () => ({
  prisma: {
    idea: {
      update: jest.fn(),
    },
  },
}))

function getSessionMock(): jest.Mock {
  return jest.requireMock('@/lib/auth').getSession as jest.Mock
}

function getPrismaIdeaMock() {
  return jest.requireMock('@/lib/db').prisma.idea as {
    update: jest.Mock
  }
}

function getRevalidatePathMock(): jest.Mock {
  return jest.requireMock('next/cache').revalidatePath as jest.Mock
}

describe('lib/payment-actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('rejects when not admin', async () => {
    getSessionMock().mockResolvedValue(null)

    await expect(updateIdeaPrice('idea_1', 99)).rejects.toThrow('Unauthorized')
    await expect(
      updatePaymentStatus('idea_1', PaymentStatus.PAID)
    ).rejects.toThrow('Unauthorized')
  })

  it('updates price and revalidates', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'admin_1',
      email: 'admin@example.com',
      role: 'ADMIN',
    })

    const prismaIdea = getPrismaIdeaMock()
    const idea = { id: 'idea_1', price: '99.00' }
    prismaIdea.update.mockResolvedValue(idea)

    await expect(updateIdeaPrice('idea_1', 99)).resolves.toBe(idea)

    expect(prismaIdea.update).toHaveBeenCalledWith({
      where: { id: 'idea_1' },
      data: { price: 99 },
    })

    expect(getRevalidatePathMock()).toHaveBeenCalledWith('/admin/ideas/idea_1')
  })

  it('sets paidAt when status becomes PAID', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'admin_1',
      email: 'admin@example.com',
      role: 'ADMIN',
    })

    const prismaIdea = getPrismaIdeaMock()
    prismaIdea.update.mockResolvedValue({ id: 'idea_1' })

    await updatePaymentStatus('idea_1', PaymentStatus.PAID)

    expect(prismaIdea.update).toHaveBeenCalledWith({
      where: { id: 'idea_1' },
      data: { paymentStatus: PaymentStatus.PAID, paidAt: expect.any(Date) },
    })

    expect(getRevalidatePathMock()).toHaveBeenCalledWith('/admin/ideas/idea_1')
  })
})

