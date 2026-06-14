import { describe, expect, it } from 'vitest'
import { saveRefinement, loadRefinements, updateRefinementChecklist, deleteRefinement } from './refinements'
import { refineDailyPlanLocal } from '../utils/aiDailyRefinement'
import { getDayPlanEntries } from '../utils/calendarAggregate'
import { createMockPlan } from '../test/fixtures'

describe('refinements storage 方向D checklist 持久化', () => {
  it('细化结果保存后刷新可读', () => {
    const entries = getDayPlanEntries([createMockPlan()], '2026-06-01')
    const refinement = refineDailyPlanLocal('2026-06-01', entries)
    saveRefinement(refinement)

    const loaded = loadRefinements()['2026-06-01']
    expect(loaded.markdown).toContain('学习材料')
    expect(loaded.checklist.length).toBeGreaterThan(0)
  })

  it('勾选完成标准后持久化', () => {
    const entries = getDayPlanEntries([createMockPlan()], '2026-06-01')
    saveRefinement(refineDailyPlanLocal('2026-06-01', entries))
    const itemId = loadRefinements()['2026-06-01'].checklist[0].id

    updateRefinementChecklist('2026-06-01', itemId, true)
    expect(loadRefinements()['2026-06-01'].checklist[0].completed).toBe(true)

    updateRefinementChecklist('2026-06-01', itemId, false)
    expect(loadRefinements()['2026-06-01'].checklist[0].completed).toBe(false)
  })

  it('删除细化结果', () => {
    const entries = getDayPlanEntries([createMockPlan()], '2026-06-01')
    saveRefinement(refineDailyPlanLocal('2026-06-01', entries))
    deleteRefinement('2026-06-01')
    expect(loadRefinements()['2026-06-01']).toBeUndefined()
  })
})
