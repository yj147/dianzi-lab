'use client'

import { useState, useCallback } from 'react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DIMENSIONS, DEFAULT_SCORE, MIN_SCORE, MAX_SCORE } from './constants'
import type { DimensionScore, ValidatorFormData } from './types'

type ValidatorFormProps = {
  onSubmit: (data: ValidatorFormData) => void
  initialValues?: DimensionScore[]
  isLoading?: boolean
  className?: string
}

export default function ValidatorForm({
  onSubmit,
  initialValues,
  isLoading = false,
  className,
}: ValidatorFormProps) {
  // 初始化分数状态
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    for (const dim of DIMENSIONS) {
      const found = initialValues?.find((v) => v.key === dim.key)
      initial[dim.key] = found?.value ?? DEFAULT_SCORE
    }
    return initial
  })

  // 更新单个维度分数
  const handleScoreChange = useCallback((key: string, value: number[]) => {
    setScores((prev) => ({ ...prev, [key]: value[0] }))
  }, [])

  // 提交表单
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const data: ValidatorFormData = {
        scores: DIMENSIONS.map((dim) => ({
          key: dim.key,
          value: scores[dim.key],
        })),
      }
      onSubmit(data)
    },
    [scores, onSubmit]
  )

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {/* 滑块网格：桌面 3 列，移动端单列 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {DIMENSIONS.map((dim) => (
          <div
            key={dim.key}
            className="space-y-3 rounded-xl border-2 border-brand-dark bg-brand-surface p-4 shadow-solid-sm"
          >
            {/* 标签和当前值 */}
            <div className="flex items-center justify-between">
              <label
                htmlFor={`slider-${dim.key}`}
                className="text-sm font-heading font-bold text-brand-dark"
              >
                {dim.label}
              </label>
              <span className="tabular-nums text-lg font-bold text-primary">
                {scores[dim.key]}
              </span>
            </div>

            {/* 描述 */}
            <p className="text-pretty text-sm text-muted-foreground">
              {dim.description}
            </p>

            {/* 滑块 */}
            <Slider
              id={`slider-${dim.key}`}
              value={[scores[dim.key]]}
              onValueChange={(value) => handleScoreChange(dim.key, value)}
              min={MIN_SCORE}
              max={MAX_SCORE}
              step={1}
              disabled={isLoading}
              aria-label={dim.label}
            />

            {/* 范围标签 */}
            <div className="flex justify-between text-xs tabular-nums text-muted-foreground">
              <span>{MIN_SCORE}</span>
              <span>{MAX_SCORE}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 提交按钮 */}
      <div className="flex justify-center pt-4">
        <Button type="submit" disabled={isLoading} size="lg">
          {isLoading ? '评估中...' : '开始评估'}
        </Button>
      </div>
    </form>
  )
}
