import type { LearningPlan } from '../types'

export function createMockPlan(overrides: Partial<LearningPlan> = {}): LearningPlan {
  return {
    id: overrides.id ?? 'plan-1',
    title: overrides.title ?? 'React 基础',
    startDate: overrides.startDate ?? '2026-06-01',
    days: overrides.days ?? 2,
    dailyHours: overrides.dailyHours ?? 2,
    notes: overrides.notes,
    createdAt: overrides.createdAt ?? '2026-06-01T08:00:00.000Z',
    dailyPlans: overrides.dailyPlans ?? [
      {
        date: '2026-06-01',
        goal: '第 1 天：React 基础 — 入门阶段学习',
        tasks: [
          {
            id: 't1',
            title: 'React 基础概念',
            description: '学习核心概念',
            estimatedHours: 1.2,
            completed: false,
            practiceSuggestion: '整理笔记',
          },
          {
            id: 't2',
            title: '动手练习',
            description: '完成练习',
            estimatedHours: 0.8,
            completed: true,
            practiceSuggestion: '完成一个练习',
          },
        ],
      },
      {
        date: '2026-06-02',
        goal: '第 2 天：React 基础 — 入门阶段学习',
        tasks: [
          {
            id: 't3',
            title: 'React 语法',
            description: '学习语法',
            estimatedHours: 1.2,
            completed: false,
          },
          {
            id: 't4',
            title: '项目实践',
            description: '小项目',
            estimatedHours: 0.8,
            completed: false,
          },
        ],
      },
    ],
  }
}

export function createSecondPlan(): LearningPlan {
  return {
    id: 'plan-2',
    title: '线性代数复习',
    startDate: '2026-06-02',
    days: 1,
    dailyHours: 1.5,
    createdAt: '2026-06-01T09:00:00.000Z',
    dailyPlans: [
      {
        date: '2026-06-02',
        goal: '第 1 天：线性代数复习',
        tasks: [
          {
            id: 't5',
            title: '矩阵运算',
            description: '复习矩阵',
            estimatedHours: 1.5,
            completed: false,
          },
        ],
      },
    ],
  }
}
