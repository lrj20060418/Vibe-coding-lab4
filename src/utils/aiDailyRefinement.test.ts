import { describe, expect, it } from 'vitest'
import { refineDailyPlanLocal } from './aiDailyRefinement'
import { createMockPlan, createSecondPlan } from '../test/fixtures'
import { getDayPlanEntries } from './calendarAggregate'

describe('refineDailyPlan', () => {
  it('generates markdown with materials, exercises and criteria', () => {
    const entries = getDayPlanEntries([createMockPlan()], '2026-06-01')
    const result = refineDailyPlanLocal('2026-06-01', entries)

    expect(result.date).toBe('2026-06-01')
    expect(result.markdown).toContain('详细计划')
    expect(result.markdown).toContain('学习材料')
    expect(result.markdown).toContain('具体练习')
    expect(result.markdown).toContain('完成标准')
    expect(result.checklist.length).toBeGreaterThan(0)
  })

  it('includes all plans for a multi-plan day', () => {
    const entries = getDayPlanEntries([createMockPlan(), createSecondPlan()], '2026-06-02')
    const result = refineDailyPlanLocal('2026-06-02', entries)

    expect(result.markdown).toContain('React 基础')
    expect(result.markdown).toContain('线性代数复习')
  })
})
