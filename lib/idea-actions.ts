'use server'

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { submitIdeaSchema, TAGS } from '@/app/(submit)/submit/schema'
import {
  calculateScore,
  getRuleFeedback,
  assessmentInputSchema,
  type AssessmentInput,
} from '@/lib/validator'

export type SubmitIdeaWithAssessmentResult =
  | { success: true; ideaId: string; finalScore: number; feedback: string[] }
  | { success: false; error: string; stage: 'idea' | 'assessment' }

type IdeaInput = {
  title: string
  description: string
  tags: string[]
}

export async function submitIdeaWithAssessment(
  ideaData: IdeaInput,
  assessmentData: AssessmentInput
): Promise<SubmitIdeaWithAssessmentResult> {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  // 验证点子数据
  const filteredTags = ideaData.tags.filter((t): t is (typeof TAGS)[number] =>
    TAGS.includes(t as (typeof TAGS)[number])
  )
  const ideaParsed = submitIdeaSchema.safeParse({
    title: ideaData.title,
    description: ideaData.description,
    tags: filteredTags,
  })
  if (!ideaParsed.success) {
    const firstError = ideaParsed.error.issues[0]
    return {
      success: false,
      error: firstError.message,
      stage: 'idea',
    }
  }

  // 验证评估数据
  const assessmentParsed = assessmentInputSchema.safeParse(assessmentData)
  if (!assessmentParsed.success) {
    const firstError = assessmentParsed.error.issues[0]
    return {
      success: false,
      error: firstError.message,
      stage: 'assessment',
    }
  }

  // 计算评分和反馈
  const finalScore = calculateScore(assessmentParsed.data)
  const ruleFeedback = getRuleFeedback(assessmentParsed.data, finalScore)
  const feedback = ruleFeedback.map((r) => r.advice)

  // 事务：创建 Idea 和 Assessment
  const result = await prisma.$transaction(async (tx) => {
    const idea = await tx.idea.create({
      data: {
        title: ideaParsed.data.title,
        description: ideaParsed.data.description,
        tags: ideaParsed.data.tags,
        userId: session.sub,
        status: 'PENDING',
      },
    })

    await tx.assessment.create({
      data: {
        ...assessmentParsed.data,
        userId: session.sub,
        finalScore,
        feedback,
        ideaId: idea.id,
      },
    })

    return idea
  })

  return {
    success: true,
    ideaId: result.id,
    finalScore,
    feedback,
  }
}

// 根据 ideaId 获取点子和评估数据
export async function getIdeaWithAssessment(ideaId: string) {
  const session = await getSession()
  if (!session) {
    return null
  }

  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
    include: { assessment: true },
  })

  // 只允许查看自己的点子
  if (!idea || idea.userId !== session.sub) {
    return null
  }

  return idea
}
