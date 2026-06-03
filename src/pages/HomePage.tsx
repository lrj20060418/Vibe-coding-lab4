import { useMemo, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { PlanForm } from '../components/PlanForm'
import { ProgressOverview } from '../components/ProgressOverview'
import { UnifiedCalendar } from '../components/UnifiedCalendar'
import { HistoryPanel } from '../components/HistoryPanel'
import { DayPreview } from '../components/DayPreview'
import { usePlans } from '../hooks/usePlans'
import { calculateProgress } from '../utils/progress'
import { getDayPlanEntries } from '../utils/calendarAggregate'

export function HomePage() {
  const { plans, loading, addPlan, deletePlan } = usePlans()
  const [previewDate, setPreviewDate] = useState<string | null>(null)

  const stats = useMemo(() => calculateProgress(plans), [plans])
  const previewEntries = previewDate ? getDayPlanEntries(plans, previewDate) : []

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">加载中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <ProgressOverview stats={stats} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <PlanForm onSubmit={addPlan} />
            </div>
            <HistoryPanel plans={plans} onDelete={deletePlan} />
          </div>

          <div className="lg:col-span-2">
            {plans.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
                <span className="text-5xl">📅</span>
                <h2 className="mt-4 text-lg font-semibold text-slate-700">
                  创建你的第一个学习计划
                </h2>
                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  填写左侧表单创建计划，日历将在此处展示你的全部学习安排
                </p>
              </div>
            ) : (
              <UnifiedCalendar plans={plans} onDayClick={setPreviewDate} />
            )}
          </div>
        </div>
      </main>

      {previewDate && previewEntries.length > 0 && (
        <DayPreview
          date={previewDate}
          entries={previewEntries}
          onClose={() => setPreviewDate(null)}
        />
      )}
    </div>
  )
}
