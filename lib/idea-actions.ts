'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
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

  // 服务端强制分数阈值校验（防止绕过客户端直接调用 Server Action）
  const MIN_SCORE_TO_SUBMIT = 50
  if (finalScore < MIN_SCORE_TO_SUBMIT) {
    return {
      success: false,
      error: `评分未达标（${finalScore}分），需达到 ${MIN_SCORE_TO_SUBMIT} 分才能提交`,
      stage: 'assessment',
    }
  }

  // 用单次 SQL 往返写入（相比 interactive transaction 显著减少延迟）。
  // 注意：Postgres 侧没有 cuid() 默认值，因此这里手动生成 id。
  const ideaId = randomUUID()
  const assessmentId = randomUUID()

  await prisma.$queryRaw(
    Prisma.sql`
      WITH new_idea AS (
        INSERT INTO "Idea" (
          "id", "title", "description", "status", "tags", "userId", "updatedAt"
        ) VALUES (
          ${ideaId},
          ${ideaParsed.data.title},
          ${ideaParsed.data.description},
          ${'PENDING'}::"IdeaStatus",
          ${ideaParsed.data.tags}::text[],
          ${session.sub},
          NOW()
        )
        RETURNING "id"
      )
      INSERT INTO "Assessment" (
        "id",
        "userId",
        "targetUser",
        "channel",
        "market",
        "tech",
        "budget",
        "businessModel",
        "team",
        "risk",
        "traffic",
        "finalScore",
        "feedback",
        "ideaId"
      )
      SELECT
        ${assessmentId},
        ${session.sub},
        ${assessmentParsed.data.targetUser},
        ${assessmentParsed.data.channel},
        ${assessmentParsed.data.market},
        ${assessmentParsed.data.tech},
        ${assessmentParsed.data.budget},
        ${assessmentParsed.data.businessModel},
        ${assessmentParsed.data.team},
        ${assessmentParsed.data.risk},
        ${assessmentParsed.data.traffic},
        ${finalScore},
        ${feedback}::text[],
        new_idea."id"
      FROM new_idea;
    `
  )

  // 提交点子后，用户中心列表需要刷新（Next Router Cache 可能复用旧的 RSC 结果）
  revalidatePath('/dashboard')

  return {
    success: true,
    ideaId,
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
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      price: true,
      paymentStatus: true,
      paidAt: true,
      tags: true,
      userId: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
      assessment: true,
    },
  })

  // 只允许查看自己的点子
  if (!idea || idea.userId !== session.sub) {
    return null
  }

  return {
    ...idea,
    price: idea.price?.toString() ?? null,
    paidAt: idea.paidAt ?? null,
  }
}
