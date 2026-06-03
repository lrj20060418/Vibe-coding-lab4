import type { AggregatedDay, DayPlanEntry, LearningPlan } from '../types'

export function aggregateCalendarDays(plans: LearningPlan[]): Map<string, AggregatedDay> {
  const map = new Map<string, AggregatedDay>()

  for (const plan of plans) {
    for (const daily of plan.dailyPlans) {
      const hours = daily.tasks.reduce((s, t) => s + t.estimatedHours, 0)
      const existing = map.get(daily.date)

      if (existing) {
        existing.totalHours = Math.round((existing.totalHours + hours) * 10) / 10
        existing.taskCount += daily.tasks.length
        if (!existing.planIds.includes(plan.id)) {
          existing.planIds.push(plan.id)
          existing.planTitles.push(plan.title)
        }
      } else {
        map.set(daily.date, {
          date: daily.date,
          totalHours: Math.round(hours * 10) / 10,
          taskCount: daily.tasks.length,
          planIds: [plan.id],
          planTitles: [plan.title],
        })
      }
    }
  }

  return map
}

export function getDayPlanEntries(plans: LearningPlan[], date: string): DayPlanEntry[] {
  const entries: DayPlanEntry[] = []

  for (const plan of plans) {
    const dailyPlan = plan.dailyPlans.find((d) => d.date === date)
    if (dailyPlan) {
      entries.push({
        planId: plan.id,
        planTitle: plan.title,
        dailyPlan,
      })
    }
  }

  return entries
}

export function getAllTaskDates(plans: LearningPlan[]): string[] {
  const dates = new Set<string>()
  for (const plan of plans) {
    for (const daily of plan.dailyPlans) {
      dates.add(daily.date)
    }
  }
  return Array.from(dates).sort()
}

export function getAdjacentTaskDate(
  plans: LearningPlan[],
  currentDate: string,
  direction: 'prev' | 'next',
): string | null {
  const dates = getAllTaskDates(plans)
  const index = dates.indexOf(currentDate)
  if (index === -1) return null

  if (direction === 'prev' && index > 0) return dates[index - 1]
  if (direction === 'next' && index < dates.length - 1) return dates[index + 1]
  return null
}

export function getDayTotalHours(entries: DayPlanEntry[]): number {
  return Math.round(
    entries.reduce(
      (sum, e) => sum + e.dailyPlan.tasks.reduce((s, t) => s + t.estimatedHours, 0),
      0,
    ) * 10,
  ) / 10
}
