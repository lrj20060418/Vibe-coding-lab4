import { describe, expect, it } from 'vitest'
import { generatePlan, validatePlanForm } from '../utils/planGenerator'
import {
  addPlan,
  deletePlan,
  loadPlans,
  updateTaskCompletion,
} from '../storage/plans'
import {
  aggregateCalendarDays,
  getDayPlanEntries,
  getAdjacentTaskDate,
} from '../utils/calendarAggregate'
import { calculateProgress } from '../utils/progress'
import { refineDailyPlanLocal } from '../utils/aiDailyRefinement'
import { saveRefinement, loadRefinements, updateRefinementChecklist } from '../storage/refinements'
import type { PlanFormData } from '../types'

const form: PlanFormData = {
  title: 'React 基础',
  notes: '有 JS 基础',
  startDate: '2026-06-01',
  days: 3,
  dailyHours: 2,
  customDailyContent: '',
}

describe('端到端流程', () => {
  it('创建计划 → 保存 → 日历聚合 → 详情 → 勾选 → 进度 → 细化 → 删除', () => {
    // 1. 表单校验 + 创建
    expect(validatePlanForm(form)).toEqual({})
    const plan1 = generatePlan(form)
    const plan2 = generatePlan({ ...form, title: '线性代数复习', startDate: '2026-06-02', days: 1 })

    // 2. 保存多计划
    addPlan(plan1)
    addPlan(plan2)
    expect(loadPlans()).toHaveLength(2)

    const plans = loadPlans()

    // 3. 统一日历聚合（Spec2: 6月2日两计划合并）
    const cal = aggregateCalendarDays(plans)
    expect(cal.get('2026-06-02')?.planIds).toHaveLength(2)

    // 4. 每日详情（Spec3: 以日期为中心）
    const entries = getDayPlanEntries(plans, '2026-06-02')
    expect(entries.length).toBeGreaterThanOrEqual(1)

    // 5. 勾选完成 + 持久化
    const taskId = plans[0].dailyPlans[0].tasks[0].id
    const taskDate = plans[0].dailyPlans[0].date
    updateTaskCompletion(plans[0].id, taskDate, taskId, true)
    const reloaded = loadPlans()
    expect(
      reloaded[0].dailyPlans[0].tasks.find((t) => t.id === taskId)?.completed,
    ).toBe(true)

    // 6. 进度更新
    const stats = calculateProgress(reloaded)
    expect(stats.completedTasks).toBeGreaterThan(0)

    // 7. 每日细化 + checklist 持久化（Spec4 / 方向D）
    const refinement = refineDailyPlanLocal('2026-06-01', getDayPlanEntries(reloaded, '2026-06-01'))
    saveRefinement(refinement)
    const itemId = refinement.checklist[0].id
    updateRefinementChecklist('2026-06-01', itemId, true)
    expect(loadRefinements()['2026-06-01'].checklist[0].completed).toBe(true)

    // 8. 前后天导航
    expect(getAdjacentTaskDate(reloaded, '2026-06-01', 'next')).toBeTruthy()

    // 9. 删除计划后日历更新
    deletePlan(plan2.id)
    const afterDelete = aggregateCalendarDays(loadPlans())
    expect(afterDelete.get('2026-06-02')?.planIds).toHaveLength(1)
  })
})
