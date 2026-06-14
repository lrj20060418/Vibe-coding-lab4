import type { DayPlanEntry, DailyRefinement, LearningPlan, LearningSuggestion } from '../types'
import {
  buildDayContextForAi,
  buildPlanSummaryForAi,
  generateLearningSuggestionsLocal,
} from '../utils/aiSuggestions'
import { refineDailyPlanLocal } from '../utils/aiDailyRefinement'

export type AiSource = 'ai' | 'local'

export interface AiResult<T> {
  data: T
  source: AiSource
  error?: string
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const payload = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(payload.error || `请求失败 (${res.status})`)
  }
  return payload as T
}

export async function checkAiStatus(): Promise<{ configured: boolean }> {
  try {
    const res = await fetch('/api/ai/status')
    if (!res.ok) return { configured: false }
    return res.json()
  } catch {
    return { configured: false }
  }
}

export async function fetchLearningSuggestions(
  plans: LearningPlan[],
): Promise<AiResult<LearningSuggestion[]>> {
  const planSummary = buildPlanSummaryForAi(plans)
  try {
    const result = await postJson<{ suggestions: LearningSuggestion[]; source: AiSource }>(
      '/api/ai/suggestions',
      { planSummary },
    )
    return { data: result.suggestions, source: result.source || 'ai' }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI 服务不可用'
    return {
      data: generateLearningSuggestionsLocal(plans),
      source: 'local',
      error: message,
    }
  }
}

export async function fetchDailyRefinement(
  date: string,
  entries: DayPlanEntry[],
): Promise<AiResult<DailyRefinement>> {
  const dayContext = buildDayContextForAi(date, entries)
  try {
    const result = await postJson<{ refinement: DailyRefinement }>('/api/ai/refine-daily', {
      date,
      dayContext,
    })
    return { data: result.refinement, source: result.refinement.source || 'ai' }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI 服务不可用'
    return {
      data: refineDailyPlanLocal(date, entries),
      source: 'local',
      error: message,
    }
  }
}
