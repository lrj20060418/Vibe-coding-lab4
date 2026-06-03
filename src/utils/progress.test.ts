import { describe, expect, it } from 'vitest'
import { calculateProgress, getPlanProgress } from './progress'
import { createMockPlan, createSecondPlan } from '../test/fixtures'

describe('progress', () => {
  it('calculates global completion rate', () => {
    const stats = calculateProgress([createMockPlan(), createSecondPlan()])
    expect(stats.planCount).toBe(2)
    expect(stats.totalTasks).toBe(5)
    expect(stats.completedTasks).toBe(1)
    expect(stats.completionRate).toBe(20)
  })

  it('uses unique dates for totalDays', () => {
    const stats = calculateProgress([createMockPlan(), createSecondPlan()])
    expect(stats.totalDays).toBe(2)
  })

  it('calculates per-plan progress', () => {
    const progress = getPlanProgress(createMockPlan())
    expect(progress.completed).toBe(1)
    expect(progress.total).toBe(4)
    expect(progress.rate).toBe(25)
  })
})
