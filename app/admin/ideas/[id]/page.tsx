import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { STATUS_CONFIG } from '@/lib/constants'
import RadarChart from '@/components/validator/RadarChart'
import ResultPanel from '@/components/validator/ResultPanel'
import type { DimensionScore, FeedbackItem } from '@/components/validator/types'

async function getIdeaWithAssessment(id: string) {
  return prisma.idea.findUnique({
    where: { id },
    include: {
      user: { select: { email: true } },
      assessment: true,
    },
  })
}

// 解析 feedback 字符串为 FeedbackItem[]
function parseFeedback(feedbackStrings: string[]): FeedbackItem[] {
  return feedbackStrings.map((msg) => {
    // 根据消息内容推断类型
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

export default async function AdminIdeaDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getSession()

  if (!session) {
    redirect('/login?callbackUrl=/admin/ideas')
  }

  if (session.role !== 'ADMIN') {
    redirect('/')
  }

  const idea = await getIdeaWithAssessment(params.id)

  if (!idea) {
    notFound()
  }

  const statusConfig = STATUS_CONFIG[idea.status]

  // 状态样式映射
  const statusClassName = (() => {
    switch (idea.status) {
      case 'PENDING':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'APPROVED':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'IN_PROGRESS':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'COMPLETED':
        return 'bg-green-100 text-green-700 border-green-200'
    }
  })()

  // 转换 assessment 为组件所需格式
  const scores: DimensionScore[] = idea.assessment
    ? [
        { key: 'targetUser', value: idea.assessment.targetUser },
        { key: 'channel', value: idea.assessment.channel },
        { key: 'market', value: idea.assessment.market },
        { key: 'tech', value: idea.assessment.tech },
        { key: 'budget', value: idea.assessment.budget },
        { key: 'businessModel', value: idea.assessment.businessModel },
        { key: 'team', value: idea.assessment.team },
        { key: 'risk', value: idea.assessment.risk },
        { key: 'traffic', value: idea.assessment.traffic },
      ]
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
      {/* 返回链接 */}
      <Link
        href="/admin/ideas"
        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-white/50 hover:text-slate-700"
      >
        <span className="material-symbols-outlined text-lg" aria-hidden="true">
          arrow_back
        </span>
        返回梦境列表
      </Link>

      {/* 点子信息卡片 */}
      <div className="glass-panel rounded-[2.5rem] p-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="font-script text-4xl text-slate-800">{idea.title}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-lg" aria-hidden="true">
                  person
                </span>
                {idea.user.email}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-lg" aria-hidden="true">
                  schedule
                </span>
                {new Date(idea.createdAt).toLocaleDateString('zh-CN')}
              </span>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-bold ${statusClassName}`}
          >
            {statusConfig.label}
          </span>
        </div>

        <p className="text-pretty leading-relaxed text-slate-600">{idea.description}</p>

        {idea.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {idea.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-lavender-50 px-3 py-1 text-xs font-medium text-lavender-500"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 评估结果 */}
      {idea.assessment ? (
        <div className="grid gap-8 lg:grid-cols-2">
          {/* 雷达图 */}
          <div className="glass-panel rounded-[2.5rem] p-8">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-700">
              <span className="material-symbols-outlined text-lavender-400" aria-hidden="true">
                radar
              </span>
              维度分析
            </h2>
            <RadarChart scores={scores} />
          </div>

          {/* 评估反馈 */}
          <div className="glass-panel rounded-[2.5rem] p-8">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-700">
              <span className="material-symbols-outlined text-lavender-400" aria-hidden="true">
                assessment
              </span>
              评估反馈
            </h2>
            <ResultPanel result={validationResult} />
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-[2.5rem] p-12 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-slate-100">
            <span className="material-symbols-outlined text-3xl text-slate-400" aria-hidden="true">
              analytics
            </span>
          </div>
          <h3 className="mb-2 text-xl font-bold text-slate-700">暂无评估数据</h3>
          <p className="text-slate-500">该点子尚未进行创业可行性评估。</p>
        </div>
      )}
    </div>
  )
}
