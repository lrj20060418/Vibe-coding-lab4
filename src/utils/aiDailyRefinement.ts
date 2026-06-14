import type { DayPlanEntry, DailyRefinement, RefinementChecklistItem } from '../types'
import { formatDisplayDate } from './dates'
import { getDayTotalHours } from './calendarAggregate'

function generateId(): string {
  return crypto.randomUUID()
}

const MATERIAL_HINTS: Record<string, string> = {
  React: 'React 官方文档（react.dev）与对应章节教程',
  线性代数: '线性代数教材对应章节与 Khan Academy 视频',
  英语: '精选英文文章或原版书籍章节',
  机器学习: '吴恩达课程笔记与 scikit-learn 文档',
}

function guessMaterial(planTitle: string, taskTitle: string): string {
  for (const [key, hint] of Object.entries(MATERIAL_HINTS)) {
    if (planTitle.includes(key) || taskTitle.includes(key)) {
      return hint
    }
  }
  return `与「${planTitle}」相关的官方文档、教程或教材章节`
}

export function refineDailyPlanLocal(date: string, entries: DayPlanEntry[]): DailyRefinement {
  const totalHours = getDayTotalHours(entries)
  const lines: string[] = [
    `## ${formatDisplayDate(date)} 详细计划`,
    '',
    `> 当天共 ${entries.length} 个计划，预计 ${totalHours} 小时`,
    '',
  ]

  const checklist: RefinementChecklistItem[] = []

  for (const entry of entries) {
    lines.push(`### ${entry.planTitle}`)
    lines.push('')
    lines.push(`**学习目标：** ${entry.dailyPlan.goal}`)
    lines.push('')

    lines.push('#### 学习材料')
    entry.dailyPlan.tasks.forEach((task, i) => {
      lines.push(`${i + 1}. ${guessMaterial(entry.planTitle, task.title)} — 用于「${task.title}」`)
    })
    lines.push('')

    lines.push('#### 具体练习')
    entry.dailyPlan.tasks.forEach((task, i) => {
      const practice = task.practiceSuggestion ?? `完成与「${task.title}」相关的动手练习`
      lines.push(`${i + 1}. ${practice}（预计 ${task.estimatedHours}h）`)
    })
    lines.push('')

    lines.push('#### 完成标准')
    for (const task of entry.dailyPlan.tasks) {
      const criterion = `能独立说明并完成「${task.title}」相关练习`
      lines.push(`- ${criterion}`)
      checklist.push({
        id: generateId(),
        text: `[${entry.planTitle}] ${criterion}`,
        completed: false,
      })
    }
    lines.push('')
  }

  lines.push('---')
  lines.push('*由 AI 学习助手根据当天任务自动生成，可按实际情况调整。*')

  return {
    date,
    markdown: lines.join('\n'),
    checklist,
    generatedAt: new Date().toISOString(),
    source: 'local',
  }
}

/** @deprecated 使用 fetchDailyRefinement */
export const refineDailyPlan = refineDailyPlanLocal
