import { useState } from 'react'
import type { DailyRefinement } from '../types'
import {
  deleteRefinement,
  saveRefinement,
  updateRefinementChecklist,
} from '../storage/refinements'
import { refineDailyPlan } from '../utils/aiDailyRefinement'
import type { DayPlanEntry } from '../types'

interface DailyRefinementPanelProps {
  date: string
  entries: DayPlanEntry[]
  initialRefinement?: DailyRefinement
  onRefinementChange: (refinement: DailyRefinement | undefined) => void
}

export function DailyRefinementPanel({
  date,
  entries,
  initialRefinement,
  onRefinementChange,
}: DailyRefinementPanelProps) {
  const [refinement, setRefinement] = useState<DailyRefinement | undefined>(
    initialRefinement,
  )
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    const result = refineDailyPlan(date, entries)
    saveRefinement(result)
    setRefinement(result)
    onRefinementChange(result)
    setLoading(false)
  }

  const handleToggleChecklist = (itemId: string, completed: boolean) => {
    const updated = updateRefinementChecklist(date, itemId, completed)
    if (updated) {
      setRefinement(updated)
      onRefinementChange(updated)
    }
  }

  const handleClear = () => {
    deleteRefinement(date)
    setRefinement(undefined)
    onRefinementChange(undefined)
  }

  return (
    <section className="rounded-xl border border-indigo-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-800">AI 每日计划细化</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? '生成中…' : refinement ? '重新生成' : '细化当天计划'}
          </button>
          {refinement && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              清除
            </button>
          )}
        </div>
      </div>

      {!refinement && !loading && (
        <p className="text-sm text-slate-500">
          点击「细化当天计划」，AI 将根据当天所有任务生成学习材料、具体练习和完成标准。
        </p>
      )}

      {loading && (
        <p className="animate-pulse text-sm text-indigo-600">正在分析当天任务并生成详细计划…</p>
      )}

      {refinement && !loading && (
        <div className="space-y-4">
          <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-4 font-sans text-sm leading-relaxed text-slate-700">
            {refinement.markdown}
          </pre>

          {refinement.checklist.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-700">完成标准清单</h3>
              <ul className="space-y-2">
                {refinement.checklist.map((item) => (
                  <li key={item.id} className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={(e) => handleToggleChecklist(item.id, e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600"
                    />
                    <span
                      className={`text-sm ${
                        item.completed ? 'text-slate-400 line-through' : 'text-slate-700'
                      }`}
                    >
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-xs text-slate-400">
            生成于 {new Date(refinement.generatedAt).toLocaleString('zh-CN')}
          </p>
        </div>
      )}
    </section>
  )
}
