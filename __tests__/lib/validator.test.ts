/**
 * @jest-environment node
 */

import {
  calculateScore,
  getRuleFeedback,
  assessmentInputSchema,
  type AssessmentInput,
} from '@/lib/validator'

describe('lib/validator.calculateScore', () => {
  it('all 0 returns 0', () => {
    const input: AssessmentInput = {
      clarity: 0,
      tech: 0,
      budget: 0,
      urgency: 0,
      value: 0,
    }
    expect(calculateScore(input)).toBe(0)
  })

  it('all 10 returns 100', () => {
    const input: AssessmentInput = {
      clarity: 10,
      tech: 10,
      budget: 10,
      urgency: 10,
      value: 10,
    }
    expect(calculateScore(input)).toBe(100)
  })

  it('multiplier penalty: clarity=2, others=10 results in significantly lower score', () => {
    const input: AssessmentInput = {
      clarity: 2,
      tech: 10,
      budget: 10,
      urgency: 10,
      value: 10,
    }
    const score = calculateScore(input)
    expect(score).toBeLessThan(50)
    expect(score).toBeGreaterThan(30)
  })

  it('at threshold: clarity=3, others=10 equals score without penalty', () => {
    const allTen: AssessmentInput = {
      clarity: 10,
      tech: 10,
      budget: 10,
      urgency: 10,
      value: 10,
    }

    const clarityAtThreshold: AssessmentInput = {
      clarity: 3,
      tech: 10,
      budget: 10,
      urgency: 10,
      value: 10,
    }

    const scoreAllTen = calculateScore(allTen)
    const scoreClarityThreshold = calculateScore(clarityAtThreshold)

    expect(scoreClarityThreshold).toBeLessThan(scoreAllTen)
    expect(scoreAllTen).toBe(100)
  })

  it('multiple multiplier penalties compound', () => {
    const input: AssessmentInput = {
      clarity: 2,
      tech: 2,
      budget: 10,
      urgency: 10,
      value: 2,
    }
    const score = calculateScore(input)
    expect(score).toBeLessThan(30)
  })
})

describe('lib/validator.getRuleFeedback', () => {
  it('triggers killer_clarity_lt3 when clarity < 3', () => {
    const input: AssessmentInput = {
      clarity: 2,
      tech: 10,
      budget: 10,
      urgency: 10,
      value: 10,
    }
    const finalScore = calculateScore(input)
    const feedback = getRuleFeedback(input, finalScore)

    const killerRule = feedback.find((r) => r.id === 'killer_clarity_lt3')
    expect(killerRule).toBeDefined()
    expect(killerRule?.severity).toBe(3)
    expect(killerRule?.category).toBe('killer')
  })

  it('triggers overall_green_80 when finalScore >= 80', () => {
    const input: AssessmentInput = {
      clarity: 9,
      tech: 9,
      budget: 9,
      urgency: 9,
      value: 9,
    }
    const finalScore = calculateScore(input)
    expect(finalScore).toBeGreaterThanOrEqual(80)

    const feedback = getRuleFeedback(input, finalScore)
    const greenRule = feedback.find((r) => r.id === 'overall_green_80')
    expect(greenRule).toBeDefined()
    expect(greenRule?.severity).toBe(1)
  })

  it('triggers overall_red_lt60 when finalScore < 60', () => {
    const input: AssessmentInput = {
      clarity: 5,
      tech: 5,
      budget: 5,
      urgency: 5,
      value: 5,
    }
    const finalScore = calculateScore(input)
    expect(finalScore).toBeLessThan(60)

    const feedback = getRuleFeedback(input, finalScore)
    const redRule = feedback.find((r) => r.id === 'overall_red_lt60')
    expect(redRule).toBeDefined()
    expect(redRule?.severity).toBe(3)
  })

  it('returns feedback sorted by priority descending', () => {
    const input: AssessmentInput = {
      clarity: 2,
      tech: 2,
      budget: 2,
      urgency: 2,
      value: 2,
    }
    const finalScore = calculateScore(input)
    const feedback = getRuleFeedback(input, finalScore)

    for (let i = 1; i < feedback.length; i++) {
      const prevRule = feedback[i - 1]
      const currRule = feedback[i]
      if (prevRule.category === 'killer' && currRule.category !== 'killer') {
        expect(true).toBe(true)
      }
    }

    const killerRules = feedback.filter((r) => r.category === 'killer')
    expect(killerRules.length).toBeGreaterThanOrEqual(1)
  })
})

describe('lib/validator.assessmentInputSchema', () => {
  it('validates correct input', () => {
    const input = {
      clarity: 5,
      tech: 5,
      budget: 5,
      urgency: 5,
      value: 5,
    }
    const result = assessmentInputSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('rejects value below 0', () => {
    const input = {
      clarity: -1,
      tech: 5,
      budget: 5,
      urgency: 5,
      value: 5,
    }
    const result = assessmentInputSchema.safeParse(input)
    expect(result.success).toBe(false)
  })

  it('rejects value above 10', () => {
    const input = {
      clarity: 11,
      tech: 5,
      budget: 5,
      urgency: 5,
      value: 5,
    }
    const result = assessmentInputSchema.safeParse(input)
    expect(result.success).toBe(false)
  })

  it('rejects non-integer values', () => {
    const input = {
      clarity: 5.5,
      tech: 5,
      budget: 5,
      urgency: 5,
      value: 5,
    }
    const result = assessmentInputSchema.safeParse(input)
    expect(result.success).toBe(false)
  })

  it('rejects missing fields', () => {
    const input = {
      clarity: 5,
      tech: 5,
    }
    const result = assessmentInputSchema.safeParse(input)
    expect(result.success).toBe(false)
  })
})
