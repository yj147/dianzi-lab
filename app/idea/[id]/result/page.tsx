import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Home, LayoutDashboard } from 'lucide-react'
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
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-balance font-heading text-3xl font-bold text-brand-dark md:text-4xl">
          {idea.title}
        </h1>
        <p className="text-pretty mt-2 text-sm text-gray-600">创业点子评估结果</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border-2 border-brand-dark bg-brand-surface p-6 shadow-solid-sm">
          <h2 className="font-heading text-lg font-bold text-brand-dark">维度分析</h2>
          <RadarChart scores={scores} className="mx-auto mt-4 w-full max-w-[380px]" />
        </section>
        <section>
          <h2 className="mb-4 font-heading text-lg font-bold text-brand-dark">评估结果</h2>
          <ResultPanel result={validationResult} />
        </section>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/dashboard" className="inline-flex items-center gap-2">
            <LayoutDashboard className="size-5" aria-hidden="true" />
            查看我的点子
          </Link>
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link href="/" className="inline-flex items-center gap-2">
            <Home className="size-5" aria-hidden="true" />
            返回首页
          </Link>
        </Button>
      </div>
    </div>
  )
}
