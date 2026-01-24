import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getIdeaWithAssessment } from '@/lib/idea-actions'
import RadarChart from '@/components/validator/RadarChart'
import ResultPanel from '@/components/validator/ResultPanel'
import { Button } from '@/components/ui/button'
import { DIMENSIONS } from '@/components/validator/constants'
import type { DimensionScore, ValidationResult, FeedbackItem } from '@/components/validator/types'

type Props = {
  params: Promise<{ id: string }>
}

export default async function IdeaResultPage({ params }: Props) {
  const { id } = await params
  const idea = await getIdeaWithAssessment(id)

  if (!idea || !idea.assessment) {
    notFound()
  }

  const { assessment } = idea

  // 转换评估数据为组件所需格式
  const scores: DimensionScore[] = DIMENSIONS.map((dim) => ({
    key: dim.key,
    value: assessment[dim.key as keyof typeof assessment] as number,
  }))

  // 将 feedback 转换为 FeedbackItem 格式
  const feedbackItems: FeedbackItem[] = assessment.feedback.map((msg) => ({
    type: assessment.finalScore >= 70 ? 'success' : assessment.finalScore >= 40 ? 'warning' : 'error',
    message: msg,
  }))

  const validationResult: ValidationResult = {
    overallScore: assessment.finalScore,
    feedback: feedbackItems,
    scores,
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="relative overflow-hidden rounded-[3rem] border border-white/80 bg-white/60 p-8 shadow-[0_20px_60px_-15px_rgba(167,139,250,0.25)] backdrop-blur-2xl md:p-12">
        <div
          className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-lavender-300 via-coral-300 to-mint-300"
          aria-hidden="true"
        />

        {/* 标题区域 */}
        <div className="mb-8 pt-4 text-center">
          <h1 className="mb-2 text-3xl font-bold text-slate-800">{idea.title}</h1>
          <p className="text-slate-500">创业点子评估结果</p>
        </div>

        {/* 雷达图和结果面板 */}
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col items-center">
            <h2 className="mb-4 text-lg font-bold text-slate-700">维度分析</h2>
            <RadarChart scores={scores} className="w-full max-w-[350px]" />
          </div>
          <div>
            <h2 className="mb-4 text-lg font-bold text-slate-700">评估结果</h2>
            <ResultPanel result={validationResult} />
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild variant="default" size="lg">
            <Link href="/dashboard">
              <span className="material-symbols-outlined mr-2" aria-hidden="true">
                dashboard
              </span>
              查看我的点子
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/">
              <span className="material-symbols-outlined mr-2" aria-hidden="true">
                home
              </span>
              返回首页
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
