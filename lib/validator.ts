import { z } from 'zod'
import rules from '@/rules/validator_v1.rules.json'

// Types
export type AssessmentInput = {
  clarity: number
  tech: number
  budget: number
  urgency: number
  value: number
}

export type RuleFeedback = {
  id: string
  severity: 1 | 2 | 3
  category: string
  advice: string
  actions: string[]
  tags: string[]
}

// Zod Schema
const dimSchema = z.number().int().min(0).max(10)
export const assessmentInputSchema = z.object({
  clarity: dimSchema,
  tech: dimSchema,
  budget: dimSchema,
  urgency: dimSchema,
  value: dimSchema,
})

// Scoring constants
const WEIGHTS: Record<keyof AssessmentInput, number> = {
  clarity: 0.25,
  tech: 0.2,
  budget: 0.2,
  urgency: 0.15,
  value: 0.2,
}

const MULTIPLIERS: (keyof AssessmentInput)[] = ['clarity', 'tech', 'budget']
const KILL_THRESHOLD = 3
const KILL_POWER = 2

/**
 * 计算评分
 * 1. 线性底分 L = sum(weight * score/10)
 * 2. 乘数惩罚 M = product(score/threshold)^power for scores < threshold
 * 3. 最终分数 = round(100 * L * M), clamped to [0, 100]
 */
export function calculateScore(input: AssessmentInput): number {
  // 线性底分
  const L = (Object.entries(WEIGHTS) as [keyof AssessmentInput, number][]).reduce(
    (sum, [key, w]) => sum + w * (input[key] / 10),
    0
  )

  // 乘数惩罚
  let M = 1
  for (const key of MULTIPLIERS) {
    const score = input[key]
    if (score < KILL_THRESHOLD) {
      M *= Math.pow(score / KILL_THRESHOLD, KILL_POWER)
    }
  }

  // 最终分数
  return Math.round(Math.max(0, Math.min(100, 100 * L * M)))
}

// Rule condition types
type DimCondition = {
  dim: keyof AssessmentInput
  op: '<' | '>' | '<=' | '>='
  value: number
}

type MetricCondition = {
  metric: 'finalScore'
  op: '<' | '>' | '<=' | '>='
  value: number
}

type Condition = DimCondition | MetricCondition

type RuleWhen = {
  all: Condition[]
}

type RuleDefinition = {
  id: string
  priority: number
  severity: 1 | 2 | 3
  category: string
  when: RuleWhen
  advice: string
  actions: string[]
  tags: string[]
}

function isDimCondition(cond: Condition): cond is DimCondition {
  return 'dim' in cond
}

function evaluateCondition(
  cond: Condition,
  input: AssessmentInput,
  finalScore: number
): boolean {
  const value = isDimCondition(cond) ? input[cond.dim] : finalScore
  const target = cond.value

  switch (cond.op) {
    case '<':
      return value < target
    case '>':
      return value > target
    case '<=':
      return value <= target
    case '>=':
      return value >= target
    default:
      return false
  }
}

function evaluateRule(
  rule: RuleDefinition,
  input: AssessmentInput,
  finalScore: number
): boolean {
  return rule.when.all.every((cond) => evaluateCondition(cond, input, finalScore))
}

/**
 * 获取匹配的规则反馈
 * 按 priority 降序排序返回
 */
export function getRuleFeedback(
  input: AssessmentInput,
  finalScore: number
): RuleFeedback[] {
  const typedRules = rules as RuleDefinition[]

  return typedRules
    .filter((rule) => evaluateRule(rule, input, finalScore))
    .sort((a, b) => b.priority - a.priority)
    .map((rule) => ({
      id: rule.id,
      severity: rule.severity,
      category: rule.category,
      advice: rule.advice,
      actions: rule.actions,
      tags: rule.tags,
    }))
}
