/**
 * @jest-environment node
 */

import { submitIdea } from '@/app/submit/actions'
import { submitIdeaSchema } from '@/app/submit/schema'

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
}))

jest.mock('@/lib/db', () => ({
  prisma: {
    idea: {
      create: jest.fn(),
    },
  },
}))

function getRedirectMock(): jest.Mock {
  return jest.requireMock('next/navigation').redirect as jest.Mock
}

function getSessionMock(): jest.Mock {
  return jest.requireMock('@/lib/auth').getSession as jest.Mock
}

function getIdeaCreateMock(): jest.Mock {
  return jest.requireMock('@/lib/db').prisma.idea.create as jest.Mock
}

describe('app/submit/actions.submitIdea', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // next/navigation.redirect 在 Next.js 中会通过抛错终止执行
    getRedirectMock().mockImplementation((url: string) => {
      throw new Error(`REDIRECT:${url}`)
    })
  })

  it('未登录时 redirect("/login")', async () => {
    getSessionMock().mockResolvedValue(null)

    await expect(submitIdea(new FormData())).rejects.toThrow('REDIRECT:/login')
    expect(getRedirectMock()).toHaveBeenCalledWith('/login')
  })

  it('title 缺失时返回结构化校验错误', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'u1',
      email: 'a@example.com',
      role: 'USER',
    })

    const formData = new FormData()
    formData.set('description', 'd')

    await expect(submitIdea(formData)).resolves.toEqual({
      success: false,
      error: '标题不能为空',
      field: 'title',
    })

    expect(getIdeaCreateMock()).not.toHaveBeenCalled()
  })

  it('description 缺失时返回结构化校验错误', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'u1',
      email: 'a@example.com',
      role: 'USER',
    })

    const formData = new FormData()
    formData.set('title', 't')

    await expect(submitIdea(formData)).resolves.toEqual({
      success: false,
      error: '描述不能为空',
      field: 'description',
    })

    expect(getIdeaCreateMock()).not.toHaveBeenCalled()
  })

  it('description 超长时返回结构化校验错误', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'u1',
      email: 'a@example.com',
      role: 'USER',
    })

    const formData = new FormData()
    formData.set('title', 't')
    formData.set('description', 'a'.repeat(1001))

    await expect(submitIdea(formData)).resolves.toEqual({
      success: false,
      error: '描述不能超过1000个字符',
      field: 'description',
    })

    expect(getIdeaCreateMock()).not.toHaveBeenCalled()
  })

  it('非法数据格式：非字符串 FormData 值按空字符串处理并返回校验错误', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'u1',
      email: 'a@example.com',
      role: 'USER',
    })

    const formData = new FormData()
    formData.set('title', new Blob([''], { type: 'text/plain' }) as any)
    formData.set('description', 'd')

    await expect(submitIdea(formData)).resolves.toEqual({
      success: false,
      error: '标题不能为空',
      field: 'title',
    })

    expect(getIdeaCreateMock()).not.toHaveBeenCalled()
  })

  it('校验错误 path 为空时，field 应为 undefined', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'u1',
      email: 'a@example.com',
      role: 'USER',
    })

    const safeParseSpy = jest
      .spyOn(submitIdeaSchema, 'safeParse')
      .mockReturnValue({
        success: false,
        error: {
          issues: [{ message: 'root error', path: [] }],
        },
      } as any)

    const result = await submitIdea(new FormData())

    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.error).toBe('root error')
    expect(result.field).toBeUndefined()

    expect(getIdeaCreateMock()).not.toHaveBeenCalled()

    safeParseSpy.mockRestore()
  })

  it('成功创建后返回 {success:true, ideaId}，且 status 默认为 PENDING', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'u1',
      email: 'a@example.com',
      role: 'USER',
    })
    getIdeaCreateMock().mockResolvedValue({ id: 'idea_1' })

    const formData = new FormData()
    formData.set('title', 't')
    formData.set('description', 'd')
    formData.append('tags', '工具')
    formData.append('tags', new Blob([''], { type: 'text/plain' }) as any)
    formData.append('tags', 'INVALID')

    await expect(submitIdea(formData)).resolves.toEqual({
      success: true,
      ideaId: 'idea_1',
    })

    expect(getIdeaCreateMock()).toHaveBeenCalledWith({
      data: {
        title: 't',
        description: 'd',
        tags: ['工具'],
        userId: 'u1',
        status: 'PENDING',
      },
    })
  })
})
