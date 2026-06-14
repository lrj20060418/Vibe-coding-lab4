import { useCallback, useEffect, useState } from 'react'
import type { LearningPlan, LearningSuggestion } from '../types'
import { fetchLearningSuggestions, checkAiStatus, type AiSource } from '../services/aiApi'

interface AiSuggestionsPanelProps {
  plans: LearningPlan[]
}

const typeStyles = {
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  info: 'border-blue-200 bg-blue-50 text-blue-900',
  success: 'border-green-200 bg-green-50 text-green-900',
}

const typeIcons = {
  warning: '⚠️',
  info: '💡',
  success: '✅',
}

export function AiSuggestionsPanel({ plans }: AiSuggestionsPanelProps) {
  const [suggestions, setSuggestions] = useState<LearningSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [source, setSource] = useState<AiSource>('local')
  const [error, setError] = useState<string | null>(null)
  const [aiConfigured, setAiConfigured] = useState(false)

  const loadSuggestions = useCallback(async () => {
    if (plans.length === 0) return
    setLoading(true)
    setError(null)
    const result = await fetchLearningSuggestions(plans)
    setSuggestions(result.data)
    setSource(result.source)
    if (result.error) setError(result.error)
    setLoading(false)
  }, [plans])

  useEffect(() => {
    checkAiStatus().then((s) => setAiConfigured(s.configured))
  }, [])

  useEffect(() => {
    loadSuggestions()
  }, [loadSuggestions])

  if (plans.length === 0) return null

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <h2 className="text-lg font-semibold text-slate-800">AI 学习建议</h2>
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              source === 'ai'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {source === 'ai' ? '大模型' : '本地规则'}
          </span>
        </div>
        <button
          type="button"
          onClick={loadSuggestions}
          disabled={loading}
          className="rounded-lg border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          {loading ? '生成中…' : '刷新建议'}
        </button>
      </div>

      {!aiConfigured && (
        <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          未检测到 AI API 配置。请在项目根目录创建 <code className="font-mono">.env</code> 并设置{' '}
          <code className="font-mono">AI_API_KEY</code>，然后运行 <code className="font-mono">npm run dev:all</code>
          。当前使用本地规则降级。
        </p>
      )}

      {error && source === 'local' && aiConfigured && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          AI 调用失败，已降级为本地规则：{error}
        </p>
      )}

      {loading && suggestions.length === 0 ? (
        <p className="animate-pulse text-sm text-indigo-600">正在调用 AI 分析学习计划…</p>
      ) : (
        <div className="space-y-3">
          {suggestions.map((s) => (
            <article
              key={s.id}
              className={`rounded-lg border p-3 ${typeStyles[s.type]}`}
            >
              <h3 className="text-sm font-semibold">
                {typeIcons[s.type]} {s.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed opacity-90">{s.content}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
