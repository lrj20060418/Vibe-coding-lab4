import { describe, expect, it } from 'vitest'
import {
  aggregateCalendarDays,
  getAdjacentTaskDate,
  getDayPlanEntries,
  getDayTotalHours,
} from './calendarAggregate'
import { createMockPlan, createSecondPlan } from '../test/fixtures'

describe('calendarAggregate', () => {
  const plan1 = createMockPlan()
  const plan2 = createSecondPlan()
  const plans = [plan1, plan2]

  it('merges multiple plans on the same date', () => {
    const map = aggregateCalendarDays(plans)
    const june2 = map.get('2026-06-02')
    expect(june2).toBeDefined()
    expect(june2!.planIds).toHaveLength(2)
    expect(june2!.taskCount).toBe(3)
    expect(june2!.totalHours).toBe(3.5)
  })

  it('returns all plan entries for a date', () => {
    const entries = getDayPlanEntries(plans, '2026-06-02')
    expect(entries).toHaveLength(2)
    expect(entries.map((e) => e.planTitle)).toEqual(['React 基础', '线性代数复习'])
  })

  it('calculates total hours for a day', () => {
    const entries = getDayPlanEntries(plans, '2026-06-02')
    expect(getDayTotalHours(entries)).toBe(3.5)
  })

  it('navigates to adjacent dates with tasks', () => {
    expect(getAdjacentTaskDate(plans, '2026-06-02', 'prev')).toBe('2026-06-01')
    expect(getAdjacentTaskDate(plans, '2026-06-01', 'next')).toBe('2026-06-02')
    expect(getAdjacentTaskDate(plans, '2026-06-02', 'next')).toBeNull()
  })
})
