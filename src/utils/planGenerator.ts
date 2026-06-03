import type { LearningPlan, PlanFormData, Task, DailyPlan } from '../types'
import { addDays } from './dates'

function generateId(): string {
  return crypto.randomUUID()
}

export function validatePlanForm(data: PlanFormData): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!data.title.trim()) {
    errors.title = '学习主题不能为空'
  }

  if (!data.startDate) {
    errors.startDate = '开始日期不能为空'
  }

  if (data.days < 1) {
    errors.days = '计划天数不能小于 1'
  } else if (data.days > 90) {
    errors.days = '计划天数不能超过 90 天'
  }

  if (data.dailyHours < 0.5) {
    errors.dailyHours = '每日可用时长不能小于 0.5 小时'
  } else if (data.dailyHours > 6) {
    errors.dailyHours = '每日可用时长不能超过 6 小时'
  }

  return errors
}

function createTask(
  title: string,
  description: string,
  hours: number,
  practiceSuggestion: string,
): Task {
  return {
    id: generateId(),
    title,
    description,
    estimatedHours: hours,
    completed: false,
    practiceSuggestion,
  }
}

function generateDailyTasks(
  title: string,
  dayIndex: number,
  totalDays: number,
  dailyHours: number,
  customContent: string,
  notes?: string,
): { goal: string; tasks: Task[] } {
  const phase =
    dayIndex <= totalDays * 0.3
      ? '入门'
      : dayIndex <= totalDays * 0.7
        ? '进阶'
        : '巩固'

  const goal = `第 ${dayIndex} 天：${title} — ${phase}阶段学习`

  if (customContent.trim()) {
    const taskHours = Math.round((dailyHours / 2) * 10) / 10
    return {
      goal,
      tasks: [
        createTask(
          customContent.trim(),
          notes ? `补充说明：${notes}` : `按计划学习 ${title} 相关内容`,
          dailyHours,
          `完成今日学习任务并记录学习笔记`,
        ),
        createTask(
          '复习与练习',
          `回顾今日所学，完成相关练习`,
          taskHours,
          `能独立复述今日核心知识点`,
        ),
      ],
    }
  }

  const mainHours = Math.round((dailyHours * 0.6) * 10) / 10
  const practiceHours = Math.round((dailyHours * 0.4) * 10) / 10

  const topics = [
    '基础概念与核心原理',
    '关键语法与常用模式',
    '实战练习与代码编写',
    '深入理解与源码阅读',
    '项目实践与综合应用',
    '查漏补缺与知识串联',
    '模拟测试与总结复盘',
  ]

  const topicIndex = (dayIndex - 1) % topics.length

  return {
    goal,
    tasks: [
      createTask(
        `${title}：${topics[topicIndex]}`,
        `学习 ${title} 的${topics[topicIndex]}，${notes ? `重点：${notes}` : '按进度推进'}`,
        mainHours,
        `阅读文档或教程，整理学习笔记`,
      ),
      createTask(
        `${title}：动手练习`,
        `通过练习巩固 ${topics[topicIndex]} 相关内容`,
        practiceHours,
        `完成至少一个练习并验证结果`,
      ),
    ],
  }
}

export function generatePlan(data: PlanFormData): LearningPlan {
  const dailyPlans: DailyPlan[] = []

  for (let i = 0; i < data.days; i++) {
    const date = addDays(data.startDate, i)
    const { goal, tasks } = generateDailyTasks(
      data.title,
      i + 1,
      data.days,
      data.dailyHours,
      data.customDailyContent,
      data.notes,
    )
    dailyPlans.push({ date, goal, tasks })
  }

  return {
    id: generateId(),
    title: data.title.trim(),
    startDate: data.startDate,
    days: data.days,
    dailyHours: data.dailyHours,
    notes: data.notes.trim() || undefined,
    dailyPlans,
    createdAt: new Date().toISOString(),
  }
}

export function getPlanTotalHours(plan: LearningPlan): number {
  return plan.dailyPlans.reduce(
    (sum, day) => sum + day.tasks.reduce((s, t) => s + t.estimatedHours, 0),
    0,
  )
}
