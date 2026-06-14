import { useState } from 'react'
import type { DailyRefinement } from '../types'
import {
  deleteRefinement,
  saveRefinement,
  updateRefinementChecklist,
} from '../storage/refinements'
import { fetchDailyRefinement, type AiSource } from '../services/aiApi'
import { MarkdownContent } from './MarkdownContent'
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
  const [source, setSource] = useState<AiSource>(initialRefinement?.source ?? 'local')
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    const result = await fetchDailyRefinement(date, entries)
    saveRefinement(result.data)
    setRefinement(result.data)
    setSource(result.source)
    if (result.error) setError(result.error)
    onRefinementChange(result.data)
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
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-800">AI 每日计划细化</h2>
          {refinement && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                source === 'ai'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {source === 'ai' ? '大模型' : '本地规则'}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? 'AI 生成中…' : refinement ? '重新生成' : '细化当天计划'}
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
          点击「细化当天计划」，系统将调用大模型 API 生成学习材料、具体练习和完成标准（未配置 API 时自动降级为本地模板）。
        </p>
      )}

      {loading && (
        <p className="animate-pulse text-sm text-indigo-600">正在调用 AI 分析当天任务并生成详细计划…</p>
      )}

      {error && source === 'local' && refinement && (
        <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          AI 调用失败，已使用本地模板：{error}
        </p>
      )}

      {refinement && !loading && (
        <div className="space-y-4">
          <MarkdownContent content={refinement.markdown} />

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
            {refinement.source === 'ai' ? ' · 由大模型生成' : ' · 本地模板生成'}
          </p>
        </div>
      )}
    </section>
  )
}
