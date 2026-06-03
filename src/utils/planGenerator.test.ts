import { describe, expect, it } from 'vitest'
import { generatePlan, validatePlanForm } from './planGenerator'
import type { PlanFormData } from '../types'

const validForm: PlanFormData = {
  title: 'React 基础',
  notes: '有 JS 基础',
  startDate: '2026-06-01',
  days: 7,
  dailyHours: 2,
  customDailyContent: '',
}

describe('validatePlanForm', () => {
  it('returns no errors for valid form', () => {
    expect(validatePlanForm(validForm)).toEqual({})
  })

  it('rejects empty title', () => {
    const errors = validatePlanForm({ ...validForm, title: '  ' })
    expect(errors.title).toBe('学习主题不能为空')
  })

  it('rejects days less than 1', () => {
    const errors = validatePlanForm({ ...validForm, days: 0 })
    expect(errors.days).toBe('计划天数不能小于 1')
  })

  it('rejects days greater than 90', () => {
    const errors = validatePlanForm({ ...validForm, days: 91 })
    expect(errors.days).toBe('计划天数不能超过 90 天')
  })

  it('rejects daily hours below 0.5', () => {
    const errors = validatePlanForm({ ...validForm, dailyHours: 0.3 })
    expect(errors.dailyHours).toBe('每日可用时长不能小于 0.5 小时')
  })

  it('rejects daily hours above 6', () => {
    const errors = validatePlanForm({ ...validForm, dailyHours: 7 })
    expect(errors.dailyHours).toBe('每日可用时长不能超过 6 小时')
  })
})

describe('generatePlan', () => {
  it('generates structured daily plans with correct dates', () => {
    const plan = generatePlan(validForm)
    expect(plan.title).toBe('React 基础')
    expect(plan.dailyPlans).toHaveLength(7)
    expect(plan.dailyPlans[0].date).toBe('2026-06-01')
    expect(plan.dailyPlans[6].date).toBe('2026-06-07')
  })

  it('each day has goal and tasks with required fields', () => {
    const plan = generatePlan(validForm)
    for (const daily of plan.dailyPlans) {
      expect(daily.goal).toBeTruthy()
      expect(daily.tasks.length).toBeGreaterThan(0)
      for (const task of daily.tasks) {
        expect(task.id).toBeTruthy()
        expect(task.title).toBeTruthy()
        expect(task.description).toBeTruthy()
        expect(task.estimatedHours).toBeGreaterThan(0)
        expect(task.completed).toBe(false)
      }
    }
  })

  it('uses custom daily content when provided', () => {
    const plan = generatePlan({ ...validForm, customDailyContent: '阅读官方文档' })
    expect(plan.dailyPlans[0].tasks[0].title).toBe('阅读官方文档')
  })
})
