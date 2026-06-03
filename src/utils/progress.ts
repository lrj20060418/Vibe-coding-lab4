import type { LearningPlan } from '../types'

export interface ProgressStats {
  planCount: number
  totalDays: number
  totalHours: number
  totalTasks: number
  completedTasks: number
  completionRate: number
}

export function calculateProgress(plans: LearningPlan[]): ProgressStats {
  let totalDays = 0
  let totalHours = 0
  let totalTasks = 0
  let completedTasks = 0

  const uniqueDates = new Set<string>()

  for (const plan of plans) {
    totalDays += plan.days
    for (const daily of plan.dailyPlans) {
      uniqueDates.add(daily.date)
      for (const task of daily.tasks) {
        totalTasks++
        totalHours += task.estimatedHours
        if (task.completed) completedTasks++
      }
    }
  }

  return {
    planCount: plans.length,
    totalDays: uniqueDates.size,
    totalHours: Math.round(totalHours * 10) / 10,
    totalTasks,
    completedTasks,
    completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
  }
}

export function getPlanProgress(plan: LearningPlan): {
  completed: number
  total: number
  rate: number
} {
  let completed = 0
  let total = 0
  for (const daily of plan.dailyPlans) {
    for (const task of daily.tasks) {
      total++
      if (task.completed) completed++
    }
  }
  return {
    completed,
    total,
    rate: total > 0 ? Math.round((completed / total) * 100) : 0,
  }
}
