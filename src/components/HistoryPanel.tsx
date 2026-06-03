import { useNavigate } from 'react-router-dom'
import type { LearningPlan } from '../types'
import { getPlanTotalHours } from '../utils/planGenerator'
import { getPlanProgress } from '../utils/progress'
import { downloadMarkdown, exportPlanMarkdown } from '../utils/exportMarkdown'

interface HistoryPanelProps {
  plans: LearningPlan[]
  onDelete: (planId: string) => void
}

export function HistoryPanel({ plans, onDelete }: HistoryPanelProps) {
  const navigate = useNavigate()

  if (plans.length === 0) return null

  const handleDelete = (plan: LearningPlan) => {
    if (window.confirm(`确定删除计划「${plan.title}」吗？此操作不可恢复。`)) {
      onDelete(plan.id)
    }
  }

  const handleExport = (plan: LearningPlan) => {
    const md = exportPlanMarkdown(plan)
    downloadMarkdown(md, `${plan.title}-学习计划.md`)
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-slate-800">历史计划</h2>
      <div className="space-y-3">
        {plans.map((plan) => {
          const progress = getPlanProgress(plan)
          return (
            <div
              key={plan.id}
              className="rounded-lg border border-slate-100 bg-slate-50 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-medium text-slate-800">{plan.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {plan.startDate} · {plan.days} 天 · {getPlanTotalHours(plan)} 小时
                  </p>
                  <p className="text-xs text-slate-400">
                    创建于 {new Date(plan.createdAt).toLocaleString('zh-CN')}
                  </p>
                  <p className="mt-1 text-xs text-indigo-600">
                    进度 {progress.completed}/{progress.total} ({progress.rate}%)
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => navigate(`/day/${plan.startDate}`)}
                    className="rounded px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
                    title="查看计划"
                  >
                    查看
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport(plan)}
                    className="rounded px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50"
                    title="导出 Markdown"
                  >
                    导出
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(plan)}
                    className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
