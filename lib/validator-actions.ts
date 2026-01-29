'use server'

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import {
  calculateScore,
  getRuleFeedback,
  assessmentInputSchema,
} from './validator'

export type SubmitAssessmentResult =
  | {
      success: true
      assessmentId: string
      finalScore: number
      feedback: string[]
    }
  | { success: false; error: string; field?: string }

export async function submitAssessment(
  input: unknown
): Promise<SubmitAssessmentResult> {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const parsed = assessmentInputSchema.safeParse(input)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return {
      success: false,
      error: firstError.message,
      field:
        firstError.path[0] === undefined
          ? undefined
          : String(firstError.path[0]),
    }
  }

  const finalScore = calculateScore(parsed.data)
  const ruleFeedback = getRuleFeedback(parsed.data, finalScore)
  const feedback = ruleFeedback.map((r) => r.advice)

  const assessment = await prisma.assessment.create({
    data: {
      ...parsed.data,
      userId: session.sub,
      finalScore,
      feedback,
    },
  })

  return { success: true, assessmentId: assessment.id, finalScore, feedback }
}
