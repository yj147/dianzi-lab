/**
 * @jest-environment node
 */

import { submitAssessment } from '@/lib/validator-actions'

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
}))

jest.mock('@/lib/db', () => ({
  prisma: {
    assessment: {
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

function getAssessmentCreateMock(): jest.Mock {
  return jest.requireMock('@/lib/db').prisma.assessment.create as jest.Mock
}

describe('lib/validator-actions.submitAssessment', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getRedirectMock().mockImplementation((url: string) => {
      const error = new Error('NEXT_REDIRECT')
      ;(error as any).digest = `NEXT_REDIRECT;${url}`
      throw error
    })
  })

  it('未登录时 redirect("/login")', async () => {
    getSessionMock().mockResolvedValue(null)

    await expect(submitAssessment({})).rejects.toThrow('NEXT_REDIRECT')
    expect(getRedirectMock()).toHaveBeenCalledWith('/login')
  })

  it('无效输入返回校验错误', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'u1',
      email: 'a@example.com',
      role: 'USER',
    })

    const result = await submitAssessment({ clarity: 'invalid' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeDefined()
    }
    expect(getAssessmentCreateMock()).not.toHaveBeenCalled()
  })

  it('缺少字段返回校验错误', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'u1',
      email: 'a@example.com',
      role: 'USER',
    })

    const result = await submitAssessment({
      clarity: 5,
      tech: 5,
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.field).toBeDefined()
    }
    expect(getAssessmentCreateMock()).not.toHaveBeenCalled()
  })

  it('超出范围的值返回校验错误', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'u1',
      email: 'a@example.com',
      role: 'USER',
    })

    const result = await submitAssessment({
      clarity: 15,
      tech: 5,
      budget: 5,
      urgency: 5,
      value: 5,
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.field).toBe('clarity')
    }
    expect(getAssessmentCreateMock()).not.toHaveBeenCalled()
  })

  it('有效输入创建 assessment 并返回成功', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'u1',
      email: 'a@example.com',
      role: 'USER',
    })
    getAssessmentCreateMock().mockResolvedValue({ id: 'assessment_1' })

    const validInput = {
      clarity: 5,
      tech: 5,
      budget: 5,
      urgency: 5,
      value: 5,
    }

    const result = await submitAssessment(validInput)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.assessmentId).toBe('assessment_1')
      expect(typeof result.finalScore).toBe('number')
      expect(Array.isArray(result.feedback)).toBe(true)
    }

    expect(getAssessmentCreateMock()).toHaveBeenCalledWith({
      data: expect.objectContaining({
        ...validInput,
        userId: 'u1',
        finalScore: expect.any(Number),
        feedback: expect.any(Array),
      }),
    })
  })

  it('高分输入返回正确的 finalScore 和 feedback', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'u1',
      email: 'a@example.com',
      role: 'USER',
    })
    getAssessmentCreateMock().mockResolvedValue({ id: 'assessment_2' })

    const highInput = {
      clarity: 10,
      tech: 10,
      budget: 10,
      urgency: 10,
      value: 10,
    }

    const result = await submitAssessment(highInput)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.finalScore).toBe(100)
      expect(result.feedback.some((f) => f.includes('整体评分很强'))).toBe(true)
    }
  })

  it('低分输入触发 killer flag 反馈', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'u1',
      email: 'a@example.com',
      role: 'USER',
    })
    getAssessmentCreateMock().mockResolvedValue({ id: 'assessment_3' })

    const lowClarityInput = {
      clarity: 2,
      tech: 10,
      budget: 10,
      urgency: 10,
      value: 10,
    }

    const result = await submitAssessment(lowClarityInput)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.feedback.some((f) => f.includes('关键问题'))).toBe(true)
    }
  })
})
