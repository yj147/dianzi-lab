import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, User } from 'lucide-react'

import { prisma } from '@/lib/db'
import RadarChart from '@/components/validator/RadarChart'
import ResultPanel from '@/components/validator/ResultPanel'
import StatusBadge from '@/components/StatusBadge'
import type { DimensionScore, FeedbackItem } from '@/components/validator/types'
import { DIMENSIONS } from '@/components/validator/constants'

async function getIdeaWithAssessment(id: string) {
  return prisma.idea.findUnique({
    where: { id },
    include: {
      user: { select: { email: true } },
      assessment: true,
    },
  })
}

function parseFeedback(feedbackStrings: string[]): FeedbackItem[] {
  return feedbackStrings.map((msg) => {
    if (msg.includes('亮点') || msg.includes('优势') || msg.includes('强')) {
      return { type: 'success', message: msg }
    }
    if (msg.includes('风险') || msg.includes('薄弱') || msg.includes('注意') || msg.includes('建议')) {
      return { type: 'warning', message: msg }
    }
    if (msg.includes('缺失') || msg.includes('严重') || msg.includes('问题')) {
      return { type: 'error', message: msg }
    }
    return { type: 'warning', message: msg }
  })
}

export default async function AdminIdeaDetailPage({ params }: { params: { id: string } }) {
  const idea = await getIdeaWithAssessment(params.id)

  if (!idea) {
    notFound()
  }

  const scores: DimensionScore[] = idea.assessment
    ? DIMENSIONS.map((dim) => ({
        key: dim.key,
        value: idea.assessment?.[dim.key as keyof typeof idea.assessment] as number,
      }))
    : []

  const validationResult = idea.assessment
    ? {
        overallScore: idea.assessment.finalScore,
        feedback: parseFeedback(idea.assessment.feedback),
        scores,
      }
    : null

  return (
    <div className="space-y-8">
      <Link
        href="/admin/ideas"
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 underline-offset-4 hover:text-brand-dark hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        返回梦境列表
      </Link>

      <section className="rounded-xl border-2 border-brand-dark bg-brand-surface p-8 shadow-solid-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 space-y-3">
            <h1 className="text-balance font-heading text-3xl font-bold text-brand-dark md:text-4xl">
              {idea.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <User className="size-4 text-gray-400" aria-hidden="true" />
                <span className="font-mono text-xs text-gray-500">用户</span>
                <span className="max-w-[360px] truncate font-bold text-brand-dark">{idea.user.email}</span>
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="size-4 text-gray-400" aria-hidden="true" />
                <span className="font-mono text-xs text-gray-500">提交</span>
                <span className="font-mono text-xs text-gray-500">
                  {new Date(idea.createdAt).toLocaleDateString('zh-CN')}
                </span>
              </span>
            </div>
          </div>
          <div className="shrink-0">
            <StatusBadge status={idea.status} />
          </div>
        </div>

        <p className="text-pretty mt-6 leading-relaxed text-gray-700">{idea.description}</p>

        {idea.tags.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {idea.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-3 py-1 font-mono text-xs font-medium text-gray-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      {idea.assessment ? (
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border-2 border-brand-dark bg-brand-surface p-6 shadow-solid-sm">
            <h2 className="font-heading text-lg font-bold text-brand-dark">维度分析</h2>
            <RadarChart scores={scores} className="mt-4" />
          </div>
          <div>
            <h2 className="mb-4 font-heading text-lg font-bold text-brand-dark">评估反馈</h2>
            <ResultPanel result={validationResult} />
          </div>
        </section>
      ) : (
        <section className="rounded-xl border-2 border-dashed border-brand-dark/40 bg-brand-surface p-12 text-center shadow-solid-sm">
          <h2 className="text-balance font-heading text-2xl font-bold text-brand-dark">暂无评估数据</h2>
          <p className="text-pretty mx-auto mt-3 max-w-xl text-sm text-gray-600">
            该点子尚未进行创业可行性评估。
          </p>
        </section>
      )}
    </div>
  )
}

