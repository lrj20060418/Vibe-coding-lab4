import { describe, expect, it } from 'vitest'
import {
  addPlan,
  deletePlan,
  loadPlans,
  savePlans,
  updateTaskCompletion,
} from './plans'
import { createMockPlan, createSecondPlan } from '../test/fixtures'

describe('plans storage', () => {
  it('returns empty array when no data saved', () => {
    expect(loadPlans()).toEqual([])
  })

  it('persists multiple plans without overwriting', () => {
    const plan1 = createMockPlan()
    const plan2 = createSecondPlan()
    addPlan(plan1)
    addPlan(plan2)
    const loaded = loadPlans()
    expect(loaded).toHaveLength(2)
    expect(loaded.map((p) => p.id)).toEqual(['plan-1', 'plan-2'])
  })

  it('persists completion state after update', () => {
    const plan = createMockPlan()
    savePlans([plan])
    updateTaskCompletion('plan-1', '2026-06-01', 't1', true)
    const reloaded = loadPlans()
    const task = reloaded[0].dailyPlans[0].tasks.find((t) => t.id === 't1')
    expect(task?.completed).toBe(true)
  })

  it('removes plan on delete and updates storage', () => {
    savePlans([createMockPlan(), createSecondPlan()])
    deletePlan('plan-1')
    expect(loadPlans()).toHaveLength(1)
    expect(loadPlans()[0].id).toBe('plan-2')
  })
})
