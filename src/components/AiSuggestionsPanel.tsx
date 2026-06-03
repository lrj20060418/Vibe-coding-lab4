import { useMemo } from 'react'
import type { LearningPlan } from '../types'
import { generateLearningSuggestions } from '../utils/aiSuggestions'

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
  const suggestions = useMemo(() => generateLearningSuggestions(plans), [plans])

  if (plans.length === 0) return null

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg">🤖</span>
        <h2 className="text-lg font-semibold text-slate-800">AI 学习建议</h2>
      </div>
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
    </section>
  )
}
