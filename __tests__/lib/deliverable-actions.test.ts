/**
 * @jest-environment node
 */

import {
  uploadDeliverable,
  deleteDeliverable,
  getDeliverables,
  getSignedUrl,
} from '@/lib/deliverable-actions'

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
}))

jest.mock('@/lib/db', () => ({
  prisma: {
    idea: { findUnique: jest.fn() },
    deliverable: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

const mockUpload = jest.fn()
const mockRemove = jest.fn()
const mockCreateSignedUrl = jest.fn()

jest.mock('@/lib/supabase', () => ({
  getSupabaseAdmin: jest.fn(() => ({
    storage: {
      from: jest.fn(() => ({
        upload: mockUpload,
        remove: mockRemove,
        createSignedUrl: mockCreateSignedUrl,
      })),
    },
  })),
  DELIVERABLES_BUCKET: 'deliverables',
}))

function getSessionMock(): jest.Mock {
  return jest.requireMock('@/lib/auth').getSession as jest.Mock
}

function getPrismaMock() {
  return jest.requireMock('@/lib/db').prisma as {
    idea: { findUnique: jest.Mock }
    deliverable: {
      create: jest.Mock
      findUnique: jest.Mock
      findMany: jest.Mock
      delete: jest.Mock
    }
  }
}


describe('lib/deliverable-actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('uploadDeliverable', () => {
    it('rejects when not admin', async () => {
      getSessionMock().mockResolvedValue({ role: 'USER' })

      const formData = new FormData()
      formData.append('file', new File(['test'], 'test.txt'))

      const result = await uploadDeliverable('idea_1', formData)
      expect(result).toEqual({ success: false, error: '无权限' })
    })

    it('rejects when file not provided', async () => {
      getSessionMock().mockResolvedValue({ role: 'ADMIN' })

      const result = await uploadDeliverable('idea_1', new FormData())
      expect(result).toEqual({ success: false, error: '未提供文件' })
    })

    it('rejects when file exceeds 50MB', async () => {
      getSessionMock().mockResolvedValue({ role: 'ADMIN' })

      const largeFile = new File(['x'.repeat(100)], 'large.txt')
      Object.defineProperty(largeFile, 'size', { value: 60 * 1024 * 1024 })

      const formData = new FormData()
      formData.append('file', largeFile)

      const result = await uploadDeliverable('idea_1', formData)
      expect(result).toEqual({ success: false, error: '文件大小超过 50MB 限制' })
    })

    it('rejects when idea not found', async () => {
      getSessionMock().mockResolvedValue({ role: 'ADMIN' })
      getPrismaMock().idea.findUnique.mockResolvedValue(null)

      const formData = new FormData()
      formData.append('file', new File(['test'], 'test.txt'))

      const result = await uploadDeliverable('idea_1', formData)
      expect(result).toEqual({ success: false, error: '点子不存在' })
    })

    it('sanitizes dangerous filename characters', async () => {
      getSessionMock().mockResolvedValue({ role: 'ADMIN' })
      getPrismaMock().idea.findUnique.mockResolvedValue({ id: 'idea_1' })

      mockUpload.mockResolvedValue({ error: null })

      getPrismaMock().deliverable.create.mockResolvedValue({
        id: 'del_1',
        name: 'test.txt',
        storagePath: 'idea_1/123-test.txt',
        size: 4,
      })

      const formData = new FormData()
      formData.append('file', new File(['test'], '../../../etc/passwd'))

      await uploadDeliverable('idea_1', formData)

      const createCall = getPrismaMock().deliverable.create.mock.calls[0][0]
      const fileName = createCall.data.storagePath.split('/').pop()
      expect(fileName).not.toContain('..')
      expect(fileName).not.toContain('/')
      expect(fileName).not.toContain('\\')
    })
  })

  describe('deleteDeliverable', () => {
    it('rejects when not admin', async () => {
      getSessionMock().mockResolvedValue({ role: 'USER' })

      const result = await deleteDeliverable('del_1')
      expect(result).toEqual({ success: false, error: '无权限' })
    })

    it('rejects when deliverable not found', async () => {
      getSessionMock().mockResolvedValue({ role: 'ADMIN' })
      getPrismaMock().deliverable.findUnique.mockResolvedValue(null)

      const result = await deleteDeliverable('del_1')
      expect(result).toEqual({ success: false, error: '文件不存在' })
    })
  })

  describe('getDeliverables', () => {
    it('rejects when not logged in', async () => {
      getSessionMock().mockResolvedValue(null)

      const result = await getDeliverables('idea_1')
      expect(result).toEqual({ success: false, error: '未登录' })
    })

    it('returns deliverables with ISO date strings', async () => {
      getSessionMock().mockResolvedValue({ sub: 'user_1', role: 'USER' })
      getPrismaMock().idea.findUnique.mockResolvedValue({ id: 'idea_1', userId: 'user_1' })

      const mockDate = new Date('2026-01-30T10:00:00Z')
      getPrismaMock().deliverable.findMany.mockResolvedValue([
        { id: 'del_1', name: 'file.txt', storagePath: 'path', size: 100, createdAt: mockDate },
      ])

      const result = await getDeliverables('idea_1')

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.deliverables[0].createdAt).toBe('2026-01-30T10:00:00.000Z')
        expect(typeof result.deliverables[0].createdAt).toBe('string')
      }
    })
  })

  describe('getSignedUrl', () => {
    it('rejects when not logged in', async () => {
      getSessionMock().mockResolvedValue(null)

      const result = await getSignedUrl('del_1')
      expect(result).toEqual({ success: false, error: '未登录' })
    })

    it('rejects when not idea owner', async () => {
      getSessionMock().mockResolvedValue({ sub: 'user_2' })
      getPrismaMock().deliverable.findUnique.mockResolvedValue({
        storagePath: 'path',
        idea: { userId: 'user_1' },
      })

      const result = await getSignedUrl('del_1')
      expect(result).toEqual({ success: false, error: '无权限' })
    })
  })
})
