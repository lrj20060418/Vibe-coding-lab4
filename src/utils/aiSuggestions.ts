import type { LearningPlan, LearningSuggestion } from '../types'
import { aggregateCalendarDays } from './calendarAggregate'
import { calculateProgress } from './progress'
import { formatDisplayDate } from './dates'

const OVERLOAD_HOURS = 5
const WEEKLY_HOURS_WARNING = 16

function getWeekDates(from: string): string[] {
  const dates: string[] = []
  const start = new Date(from)
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    dates.push(`${y}-${m}-${day}`)
  }
  return dates
}

function getUpcomingWeekStart(): string {
  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, '0')
  const d = String(today.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function generateLearningSuggestions(plans: LearningPlan[]): LearningSuggestion[] {
  if (plans.length === 0) return []

  const suggestions: LearningSuggestion[] = []
  const stats = calculateProgress(plans)
  const aggregated = aggregateCalendarDays(plans)
  const weekStart = getUpcomingWeekStart()
  const weekDates = getWeekDates(weekStart)

  let weeklyHours = 0
  const overloadedDays: { date: string; hours: number }[] = []

  for (const date of weekDates) {
    const day = aggregated.get(date)
    if (day) {
      weeklyHours += day.totalHours
      if (day.totalHours > OVERLOAD_HOURS) {
        overloadedDays.push({ date, hours: day.totalHours })
      }
    }
  }

  suggestions.push({
    id: 'weekly-summary',
    type: 'info',
    title: '本周学习概览',
    content: `你当前有 ${stats.planCount} 个学习计划，本周（从 ${weekStart} 起）预计学习 ${Math.round(weeklyHours * 10) / 10} 小时，共 ${stats.totalTasks} 项任务，已完成 ${stats.completedTasks} 项（${stats.completionRate}%）。`,
  })

  for (const { date, hours } of overloadedDays) {
    suggestions.push({
      id: `overload-${date}`,
      type: 'warning',
      title: '学习负载偏高',
      content: `${formatDisplayDate(date)} 安排了 ${hours} 小时任务，超过建议的 ${OVERLOAD_HOURS} 小时。建议将部分练习移动到相邻日期，或降低单日任务密度。`,
    })
  }

  if (weeklyHours > WEEKLY_HOURS_WARNING) {
    suggestions.push({
      id: 'weekly-overload',
      type: 'warning',
      title: '本周总时长较高',
      content: `本周预计学习 ${Math.round(weeklyHours * 10) / 10} 小时，超过 ${WEEKLY_HOURS_WARNING} 小时。建议适当调整计划节奏，留出复习与休息时间。`,
    })
  }

  for (const plan of plans) {
    const total = plan.dailyPlans.reduce((s, d) => s + d.tasks.length, 0)
    const done = plan.dailyPlans.reduce(
      (s, d) => s + d.tasks.filter((t) => t.completed).length,
      0,
    )
    const pending = total - done
    if (pending > 0 && done > 0 && done / total < 0.5) {
      suggestions.push({
        id: `lag-${plan.id}`,
        type: 'info',
        title: `「${plan.title}」进度提醒`,
        content: `该计划完成 ${done}/${total} 项任务。建议优先完成近期日期的任务，避免学习进度滞后。`,
      })
    }
  }

  if (stats.completionRate >= 80 && stats.totalTasks > 0) {
    suggestions.push({
      id: 'good-progress',
      type: 'success',
      title: '学习进展良好',
      content: `整体完成率已达 ${stats.completionRate}%，继续保持！可适当增加练习深度或开始下一个学习主题。`,
    })
  }

  if (stats.completionRate === 0 && stats.totalTasks > 0) {
    suggestions.push({
      id: 'get-started',
      type: 'info',
      title: '开始你的学习',
      content: '尚未完成任何任务。建议从最近一天的任务开始，勾选完成项以跟踪进度。',
    })
  }

  return suggestions
}
