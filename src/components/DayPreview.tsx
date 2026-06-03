import { useNavigate } from 'react-router-dom'
import type { DayPlanEntry } from '../types'
import { getDayTotalHours } from '../utils/calendarAggregate'
import { formatDisplayDate } from '../utils/dates'

interface DayPreviewProps {
  date: string
  entries: DayPlanEntry[]
  onClose: () => void
}

export function DayPreview({ date, entries, onClose }: DayPreviewProps) {
  const navigate = useNavigate()
  const totalHours = getDayTotalHours(entries)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <div>
            <h3 className="font-semibold text-slate-800">{formatDisplayDate(date)}</h3>
            <p className="text-sm text-slate-500">当天总时长 {totalHours} 小时</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 p-5">
          {entries.map((entry) => (
            <div key={entry.planId} className="rounded-lg border border-slate-100 p-3">
              <h4 className="mb-2 text-sm font-semibold text-indigo-700">
                {entry.planTitle}
              </h4>
              <p className="mb-2 text-xs text-slate-500">{entry.dailyPlan.goal}</p>
              <ul className="space-y-2">
                {entry.dailyPlan.tasks.map((task) => (
                  <li key={task.id} className="text-sm">
                    <span className="font-medium text-slate-700">{task.title}</span>
                    <span className="ml-2 text-xs text-slate-400">
                      {task.estimatedHours}h
                    </span>
                    <p className="text-xs text-slate-500">{task.description}</p>
                    {task.practiceSuggestion && (
                      <p className="text-xs text-amber-600">
                        练习：{task.practiceSuggestion}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={() => {
              onClose()
              navigate(`/day/${date}`)
            }}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            进入完整详情
          </button>
        </div>
      </div>
    </div>
  )
}
