import type { DailyRefinement } from '../types'

const STORAGE_KEY = 'daily-refinements'

export function loadRefinements(): Record<string, DailyRefinement> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, DailyRefinement>
  } catch {
    return {}
  }
}

export function saveRefinement(refinement: DailyRefinement): void {
  const all = loadRefinements()
  all[refinement.date] = refinement
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

export function getRefinement(date: string): DailyRefinement | undefined {
  return loadRefinements()[date]
}

export function updateRefinementChecklist(
  date: string,
  itemId: string,
  completed: boolean,
): DailyRefinement | undefined {
  const all = loadRefinements()
  const refinement = all[date]
  if (!refinement) return undefined

  const item = refinement.checklist.find((c) => c.id === itemId)
  if (!item) return refinement

  item.completed = completed
  all[date] = refinement
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  return refinement
}

export function deleteRefinement(date: string): void {
  const all = loadRefinements()
  delete all[date]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}
