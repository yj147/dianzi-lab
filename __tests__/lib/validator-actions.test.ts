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
    // next/navigation.redirect 在 Next.js 中会通过抛错终止执行
    getRedirectMock().mockImplementation((url: string) => {
      throw new Error(`REDIRECT:${url}`)
    })
  })

  it('未登录时 redirect("/login")', async () => {
    getSessionMock().mockResolvedValue(null)

    await expect(submitAssessment({})).rejects.toThrow('REDIRECT:/login')
    expect(getRedirectMock()).toHaveBeenCalledWith('/login')
  })

  it('无效输入返回校验错误', async () => {
    getSessionMock().mockResolvedValue({
      sub: 'u1',
      email: 'a@example.com',
      role: 'USER',
    })

    const result = await submitAssessment({ targetUser: 'invalid' })

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
      targetUser: 5,
      channel: 5,
      // 缺少其他字段
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
      targetUser: 15,
      channel: 5,
      market: 5,
      tech: 5,
      budget: 5,
      businessModel: 5,
      team: 5,
      risk: 5,
      traffic: 5,
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.field).toBe('targetUser')
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
      targetUser: 5,
      channel: 5,
      market: 5,
      tech: 5,
      budget: 5,
      businessModel: 5,
      team: 5,
      risk: 5,
      traffic: 5,
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
      targetUser: 10,
      channel: 10,
      market: 10,
      tech: 10,
      budget: 10,
      businessModel: 10,
      team: 10,
      risk: 10,
      traffic: 10,
    }

    const result = await submitAssessment(highInput)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.finalScore).toBe(100)
      // 高分应该触发 overall_green_80 规则
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

    const lowMarketInput = {
      targetUser: 10,
      channel: 10,
      market: 2,
      tech: 10,
      budget: 10,
      businessModel: 10,
      team: 10,
      risk: 10,
      traffic: 10,
    }

    const result = await submitAssessment(lowMarketInput)

    expect(result.success).toBe(true)
    if (result.success) {
      // market < 3 应该触发 Killer Flag 反馈
      expect(result.feedback.some((f) => f.includes('Killer Flag'))).toBe(true)
    }
  })
})
