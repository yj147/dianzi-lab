'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import type { ValidationResult, FeedbackItem } from './types'

type ResultPanelProps = {
  result: ValidationResult | null
  onReset?: () => void
  isLoading?: boolean
  className?: string
}

// 反馈类型到 Alert variant 的映射
const feedbackVariantMap: Record<
  FeedbackItem['type'],
  'success' | 'warning' | 'destructive'
> = {
  success: 'success',
  warning: 'warning',
  error: 'destructive',
}

const feedbackIconMap = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
} as const

export default function ResultPanel({
  result,
  onReset,
  isLoading = false,
  className,
}: ResultPanelProps) {
  // 加载状态
  if (isLoading) {
    return (
      <div
        className={cn(
          'space-y-4 rounded-xl border-2 border-brand-dark bg-brand-surface p-6 shadow-solid-sm',
          className
        )}
      >
        <div className="h-16 rounded-lg bg-muted" />
        <div className="space-y-2">
          <div className="h-12 rounded-lg bg-muted" />
          <div className="h-12 rounded-lg bg-muted" />
        </div>
      </div>
    )
  }

  // 无结果状态
  if (!result) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-xl border-2 border-brand-dark bg-brand-surface p-8 text-center shadow-solid-sm',
          className
        )}
      >
        <p className="text-pretty text-sm text-muted-foreground">
          完成评估后，结果将在此展示
        </p>
      </div>
    )
  }

  const scoreClassName =
    result.overallScore >= 70
      ? 'text-brand-success'
      : result.overallScore >= 40
        ? 'text-amber-700'
        : 'text-red-700'

  return (
    <div
      className={cn(
        'space-y-6 rounded-xl border-2 border-brand-dark bg-brand-surface p-6 shadow-solid-sm',
        className
      )}
    >
      {/* 总分展示 */}
      <div className="text-center">
        <p className="mb-2 text-sm font-bold text-muted-foreground">综合评分</p>
        <div
          className={cn(
            'text-6xl font-heading font-bold tabular-nums',
            scoreClassName
          )}
        >
          {result.overallScore}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">满分 100</p>
      </div>

      {/* 反馈列表 */}
      {result.feedback.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-brand-dark">评估反馈</h3>
          <div className="space-y-2">
            {result.feedback.map((item, index) => {
              const Icon = feedbackIconMap[item.type]
              return (
                <Alert key={index} variant={feedbackVariantMap[item.type]}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <AlertDescription>{item.message}</AlertDescription>
                </Alert>
              )
            })}
          </div>
        </div>
      )}

      {/* 重新评估按钮 */}
      {onReset && (
        <div className="flex justify-center pt-2">
          <Button variant="secondary" onClick={onReset}>
            重新评估
          </Button>
        </div>
      )}
    </div>
  )
}
