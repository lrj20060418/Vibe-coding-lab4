import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { DailyRefinementPanel } from '../components/DailyRefinementPanel'
import { usePlans } from '../hooks/usePlans'
import { getRefinement } from '../storage/refinements'
import type { DailyRefinement } from '../types'
import {
  getAdjacentTaskDate,
  getDayPlanEntries,
  getDayTotalHours,
} from '../utils/calendarAggregate'
import { formatDisplayDate } from '../utils/dates'

export function DayDetailPage() {
  const { date } = useParams<{ date: string }>()
  const navigate = useNavigate()
  const { plans, loading, updateTaskCompletion } = usePlans()
  const [refinement, setRefinement] = useState<DailyRefinement | undefined>(() =>
    date ? getRefinement(date) : undefined,
  )

  useEffect(() => {
    setRefinement(date ? getRefinement(date) : undefined)
  }, [date])

  const entries = useMemo(
    () => (date ? getDayPlanEntries(plans, date) : []),
    [plans, date],
  )

  const totalHours = useMemo(() => getDayTotalHours(entries), [entries])
  const prevDate = date ? getAdjacentTaskDate(plans, date, 'prev') : null
  const nextDate = date ? getAdjacentTaskDate(plans, date, 'next') : null

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">加载中...</p>
      </div>
    )
  }

  if (!date || entries.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-12 text-center">
          <p className="text-slate-500">该日期没有学习任务</p>
          <Link
            to="/"
            className="mt-4 inline-block text-indigo-600 hover:underline"
          >
            返回首页
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-sm text-indigo-600 hover:underline">
            ← 返回首页
          </Link>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!prevDate}
              onClick={() => prevDate && navigate(`/day/${prevDate}`)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40 hover:bg-white"
            >
              前一天
            </button>
            <button
              type="button"
              disabled={!nextDate}
              onClick={() => nextDate && navigate(`/day/${nextDate}`)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40 hover:bg-white"
            >
              后一天
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold text-slate-800">
            {formatDisplayDate(date)}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            当天总学习时长 {totalHours} 小时 · 涉及 {entries.length} 个计划
          </p>
        </div>

        <div className="space-y-4">
          {entries.map((entry) => (
            <section
              key={entry.planId}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h2 className="mb-1 text-lg font-semibold text-indigo-700">
                {entry.planTitle}
              </h2>
              <p className="mb-4 text-sm text-slate-500">{entry.dailyPlan.goal}</p>

              <ul className="space-y-3">
                {entry.dailyPlan.tasks.map((task) => (
                  <li
                    key={task.id}
                    className={`flex items-start gap-3 rounded-lg border border-slate-100 p-3 ${
                      task.completed ? 'bg-green-50/50' : 'bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) =>
                        updateTaskCompletion(
                          entry.planId,
                          date,
                          task.id,
                          e.target.checked,
                        )
                      }
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          task.completed
                            ? 'text-slate-400 line-through'
                            : 'text-slate-800'
                        }`}
                      >
                        {task.title}
                        <span className="ml-2 text-xs font-normal text-slate-400">
                          {task.estimatedHours}h
                        </span>
                      </p>
                      <p
                        className={`mt-1 text-sm ${
                          task.completed ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {task.description}
                      </p>
                      {task.practiceSuggestion && (
                        <p className="mt-1 text-xs text-amber-600">
                          练习建议：{task.practiceSuggestion}
                        </p>
                      )}
                    </div>
                    {task.completed && (
                      <span className="text-green-500" title="已完成">
                        ✓
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <DailyRefinementPanel
          date={date}
          entries={entries}
          initialRefinement={refinement}
          onRefinementChange={setRefinement}
        />
      </main>
    </div>
  )
}
