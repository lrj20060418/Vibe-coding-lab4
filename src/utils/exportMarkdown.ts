import type { LearningPlan } from '../types'
import { formatDisplayDate } from './dates'
import { getPlanTotalHours } from './planGenerator'

export function exportPlanMarkdown(plan: LearningPlan): string {
  const lines: string[] = [
    `# ${plan.title}`,
    '',
    `- 开始日期：${plan.startDate}`,
    `- 计划天数：${plan.days} 天`,
    `- 每日时长：${plan.dailyHours} 小时`,
    `- 总学习时长：${getPlanTotalHours(plan)} 小时`,
    `- 创建时间：${new Date(plan.createdAt).toLocaleString('zh-CN')}`,
  ]

  if (plan.notes) {
    lines.push(`- 补充说明：${plan.notes}`)
  }

  lines.push('', '---', '')

  for (const daily of plan.dailyPlans) {
    lines.push(`## ${formatDisplayDate(daily.date)}`)
    lines.push('')
    lines.push(`**学习目标：** ${daily.goal}`)
    lines.push('')

    for (const task of daily.tasks) {
      const status = task.completed ? '[x]' : '[ ]'
      lines.push(`- ${status} **${task.title}** (${task.estimatedHours}h)`)
      lines.push(`  - ${task.description}`)
      if (task.practiceSuggestion) {
        lines.push(`  - 练习建议：${task.practiceSuggestion}`)
      }
    }
    lines.push('')
  }

  return lines.join('\n')
}

export function downloadMarkdown(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
