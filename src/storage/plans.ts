import type { LearningPlan } from '../types'

const STORAGE_KEY = 'learning-plans'

export function loadPlans(): LearningPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as LearningPlan[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function savePlans(plans: LearningPlan[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
}

export function addPlan(plan: LearningPlan): LearningPlan[] {
  const plans = loadPlans()
  plans.push(plan)
  savePlans(plans)
  return plans
}

export function deletePlan(planId: string): LearningPlan[] {
  const plans = loadPlans().filter((p) => p.id !== planId)
  savePlans(plans)
  return plans
}

export function updateTaskCompletion(
  planId: string,
  date: string,
  taskId: string,
  completed: boolean,
): LearningPlan[] {
  const plans = loadPlans()
  const plan = plans.find((p) => p.id === planId)
  if (!plan) return plans

  const dailyPlan = plan.dailyPlans.find((d) => d.date === date)
  if (!dailyPlan) return plans

  const task = dailyPlan.tasks.find((t) => t.id === taskId)
  if (!task) return plans

  task.completed = completed
  savePlans(plans)
  return plans
}

export function getPlanById(planId: string): LearningPlan | undefined {
  return loadPlans().find((p) => p.id === planId)
}
