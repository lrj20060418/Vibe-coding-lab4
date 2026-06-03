export interface Task {
  id: string
  title: string
  description: string
  estimatedHours: number
  completed: boolean
  practiceSuggestion?: string
}

export interface DailyPlan {
  date: string
  goal: string
  tasks: Task[]
}

export interface LearningPlan {
  id: string
  title: string
  startDate: string
  days: number
  dailyHours: number
  notes?: string
  dailyPlans: DailyPlan[]
  createdAt: string
}

export interface PlanFormData {
  title: string
  notes: string
  startDate: string
  days: number
  dailyHours: number
  customDailyContent: string
}

export interface AggregatedDay {
  date: string
  totalHours: number
  taskCount: number
  planIds: string[]
  planTitles: string[]
}

export interface DayPlanEntry {
  planId: string
  planTitle: string
  dailyPlan: DailyPlan
}

export interface FormErrors {
  title?: string
  startDate?: string
  days?: string
  dailyHours?: string
}
