import { PaymentStatus } from '@prisma/client'

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

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

import { updateIdeaPrice, updatePaymentStatus } from '@/lib/payment-actions'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

const mockGetSession = getSession as jest.MockedFunction<typeof getSession>
const mockPrismaUpdate = prisma.idea.update as jest.MockedFunction<typeof prisma.idea.update>

describe('payment-actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('updateIdeaPrice', () => {
    it('returns error when user is not logged in', async () => {
      mockGetSession.mockResolvedValue(null)

      const result = await updateIdeaPrice('idea-1', '100.00')

      expect(result).toEqual({ success: false, error: '无权限操作' })
      expect(mockPrismaUpdate).not.toHaveBeenCalled()
    })

    it('returns error when user is not admin', async () => {
      mockGetSession.mockResolvedValue({ sub: 'user-1', email: 'user@test.com', role: 'USER' })

      const result = await updateIdeaPrice('idea-1', '100.00')

      expect(result).toEqual({ success: false, error: '无权限操作' })
      expect(mockPrismaUpdate).not.toHaveBeenCalled()
    })

    it('returns error for invalid price format', async () => {
      mockGetSession.mockResolvedValue({ sub: 'admin-1', email: 'admin@test.com', role: 'ADMIN' })

      const result = await updateIdeaPrice('idea-1', 'abc')

      expect(result).toEqual({ success: false, error: '价格格式无效，应为数字且最多两位小数' })
    })

    it('returns error for price with more than 2 decimals', async () => {
      mockGetSession.mockResolvedValue({ sub: 'admin-1', email: 'admin@test.com', role: 'ADMIN' })

      const result = await updateIdeaPrice('idea-1', '100.123')

      expect(result).toEqual({ success: false, error: '价格格式无效，应为数字且最多两位小数' })
    })

    it('returns error for negative price', async () => {
      mockGetSession.mockResolvedValue({ sub: 'admin-1', email: 'admin@test.com', role: 'ADMIN' })

      const result = await updateIdeaPrice('idea-1', '-10')

      expect(result).toEqual({ success: false, error: '价格格式无效，应为数字且最多两位小数' })
    })

    it('returns error for price exceeding max', async () => {
      mockGetSession.mockResolvedValue({ sub: 'admin-1', email: 'admin@test.com', role: 'ADMIN' })

      const result = await updateIdeaPrice('idea-1', '99999999.99')

      expect(result).toEqual({ success: false, error: '价格必须在 0 到 9999999.99 之间' })
    })

    it('successfully updates price', async () => {
      mockGetSession.mockResolvedValue({ sub: 'admin-1', email: 'admin@test.com', role: 'ADMIN' })
      mockPrismaUpdate.mockResolvedValue({ id: 'idea-1', price: { toString: () => '199.99' } } as never)

      const result = await updateIdeaPrice('idea-1', '199.99')

      expect(result).toEqual({ success: true, idea: { id: 'idea-1', price: '199.99' } })
      expect(mockPrismaUpdate).toHaveBeenCalledWith({
        where: { id: 'idea-1' },
        data: { price: 199.99 },
        select: { id: true, price: true },
      })
    })

    it('successfully sets price to null', async () => {
      mockGetSession.mockResolvedValue({ sub: 'admin-1', email: 'admin@test.com', role: 'ADMIN' })
      mockPrismaUpdate.mockResolvedValue({ id: 'idea-1', price: null } as never)

      const result = await updateIdeaPrice('idea-1', null)

      expect(result).toEqual({ success: true, idea: { id: 'idea-1', price: null } })
      expect(mockPrismaUpdate).toHaveBeenCalledWith({
        where: { id: 'idea-1' },
        data: { price: null },
        select: { id: true, price: true },
      })
    })
  })

  describe('updatePaymentStatus', () => {
    it('returns error when user is not admin', async () => {
      mockGetSession.mockResolvedValue({ sub: 'user-1', email: 'user@test.com', role: 'USER' })

      const result = await updatePaymentStatus('idea-1', PaymentStatus.PAID)

      expect(result).toEqual({ success: false, error: '无权限操作' })
    })

    it('sets paidAt when status changes to PAID', async () => {
      mockGetSession.mockResolvedValue({ sub: 'admin-1', email: 'admin@test.com', role: 'ADMIN' })
      const now = new Date()
      jest.useFakeTimers().setSystemTime(now)
      mockPrismaUpdate.mockResolvedValue({
        id: 'idea-1',
        paymentStatus: PaymentStatus.PAID,
        paidAt: now,
      } as never)

      const result = await updatePaymentStatus('idea-1', PaymentStatus.PAID)

      expect(result).toEqual({
        success: true,
        idea: { id: 'idea-1', paymentStatus: PaymentStatus.PAID, paidAt: now },
      })
      expect(mockPrismaUpdate).toHaveBeenCalledWith({
        where: { id: 'idea-1' },
        data: { paymentStatus: PaymentStatus.PAID, paidAt: now },
        select: { id: true, paymentStatus: true, paidAt: true },
      })
      jest.useRealTimers()
    })

    it('clears paidAt when status changes to PENDING', async () => {
      mockGetSession.mockResolvedValue({ sub: 'admin-1', email: 'admin@test.com', role: 'ADMIN' })
      mockPrismaUpdate.mockResolvedValue({
        id: 'idea-1',
        paymentStatus: PaymentStatus.PENDING,
        paidAt: null,
      } as never)

      const result = await updatePaymentStatus('idea-1', PaymentStatus.PENDING)

      expect(result).toEqual({
        success: true,
        idea: { id: 'idea-1', paymentStatus: PaymentStatus.PENDING, paidAt: null },
      })
      expect(mockPrismaUpdate).toHaveBeenCalledWith({
        where: { id: 'idea-1' },
        data: { paymentStatus: PaymentStatus.PENDING, paidAt: null },
        select: { id: true, paymentStatus: true, paidAt: true },
      })
    })

    it('does not change paidAt when status changes to REFUNDED', async () => {
      mockGetSession.mockResolvedValue({ sub: 'admin-1', email: 'admin@test.com', role: 'ADMIN' })
      const existingPaidAt = new Date('2024-01-01')
      mockPrismaUpdate.mockResolvedValue({
        id: 'idea-1',
        paymentStatus: PaymentStatus.REFUNDED,
        paidAt: existingPaidAt,
      } as never)

      const result = await updatePaymentStatus('idea-1', PaymentStatus.REFUNDED)

      expect(result).toEqual({
        success: true,
        idea: { id: 'idea-1', paymentStatus: PaymentStatus.REFUNDED, paidAt: existingPaidAt },
      })
      expect(mockPrismaUpdate).toHaveBeenCalledWith({
        where: { id: 'idea-1' },
        data: { paymentStatus: PaymentStatus.REFUNDED, paidAt: undefined },
        select: { id: true, paymentStatus: true, paidAt: true },
      })
    })
  })
})
