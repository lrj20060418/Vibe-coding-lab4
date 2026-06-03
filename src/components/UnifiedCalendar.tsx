import { useMemo, useState } from 'react'
import type { LearningPlan } from '../types'
import { aggregateCalendarDays } from '../utils/calendarAggregate'
import { formatDate, getMonthDays, isSameDay } from '../utils/dates'

interface UnifiedCalendarProps {
  plans: LearningPlan[]
  onDayClick: (date: string) => void
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

export function UnifiedCalendar({ plans, onDayClick }: UnifiedCalendarProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const aggregated = useMemo(() => aggregateCalendarDays(plans), [plans])
  const weeks = useMemo(
    () => getMonthDays(viewYear, viewMonth),
    [viewYear, viewMonth],
  )

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1)
      setViewMonth(11)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1)
      setViewMonth(0)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const goToday = () => {
    setViewYear(today.getFullYear())
    setViewMonth(today.getMonth())
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">统一日历</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevMonth}
            className="rounded-lg border border-slate-200 px-3 py-1 text-sm hover:bg-slate-50"
          >
            ←
          </button>
          <span className="min-w-[120px] text-center text-sm font-medium text-slate-700">
            {viewYear} 年 {viewMonth + 1} 月
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="rounded-lg border border-slate-200 px-3 py-1 text-sm hover:bg-slate-50"
          >
            →
          </button>
          <button
            type="button"
            onClick={goToday}
            className="rounded-lg border border-slate-200 px-3 py-1 text-xs text-slate-500 hover:bg-slate-50"
          >
            今天
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-xs font-medium text-slate-400"
          >
            {d}
          </div>
        ))}

        {weeks.flat().map((date, i) => {
          if (!date) {
            return <div key={`empty-${i}`} className="aspect-square" />
          }

          const dateStr = formatDate(date)
          const dayData = aggregated.get(dateStr)
          const hasTasks = !!dayData
          const isToday = isSameDay(date, today)

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => hasTasks && onDayClick(dateStr)}
              disabled={!hasTasks}
              className={`aspect-square rounded-lg border p-1 text-left transition ${
                hasTasks
                  ? 'cursor-pointer border-indigo-200 bg-indigo-50 hover:bg-indigo-100'
                  : 'cursor-default border-transparent hover:bg-slate-50'
              } ${isToday ? 'ring-2 ring-indigo-400 ring-offset-1' : ''}`}
            >
              <span
                className={`text-xs font-medium ${isToday ? 'text-indigo-700' : 'text-slate-700'}`}
              >
                {date.getDate()}
              </span>
              {hasTasks && (
                <div className="mt-0.5">
                  <p className="text-[10px] font-medium text-indigo-600">
                    {dayData.totalHours}h
                  </p>
                  <p className="text-[10px] text-slate-400">{dayData.taskCount} 项</p>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
