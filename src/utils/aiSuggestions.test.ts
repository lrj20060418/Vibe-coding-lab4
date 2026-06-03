import { describe, expect, it } from 'vitest'
import { generateLearningSuggestions } from './aiSuggestions'
import { createMockPlan, createSecondPlan } from '../test/fixtures'
import { todayString } from './dates'

describe('generateLearningSuggestions', () => {
  it('returns empty array when no plans', () => {
    expect(generateLearningSuggestions([])).toEqual([])
  })

  it('includes weekly summary for existing plans', () => {
    const suggestions = generateLearningSuggestions([createMockPlan()])
    expect(suggestions.some((s) => s.id === 'weekly-summary')).toBe(true)
  })

  it('provides suggestions for multiple plans', () => {
    const suggestions = generateLearningSuggestions([createMockPlan(), createSecondPlan()])
    expect(suggestions.length).toBeGreaterThan(1)
    expect(suggestions.some((s) => s.id === 'weekly-summary')).toBe(true)
  })

  it('warns when a day exceeds overload threshold', () => {
    const today = todayString()
    const heavy = createMockPlan({
      startDate: today,
      dailyPlans: [
        {
          date: today,
          goal: '高强度学习',
          tasks: [
            { id: 'h1', title: '深度学习', description: 'd', estimatedHours: 6, completed: false },
          ],
        },
      ],
    })
    const suggestions = generateLearningSuggestions([heavy])
    expect(suggestions.some((s) => s.id.startsWith('overload-'))).toBe(true)
  })

  it('suggests getting started when no tasks completed', () => {
    const plan = createMockPlan()
    plan.dailyPlans.forEach((d) => d.tasks.forEach((t) => { t.completed = false }))
    const suggestions = generateLearningSuggestions([plan])
    expect(suggestions.some((s) => s.id === 'get-started')).toBe(true)
  })
})
