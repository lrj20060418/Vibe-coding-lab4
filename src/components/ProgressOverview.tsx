import type { ProgressStats } from '../utils/progress'

interface ProgressOverviewProps {
  stats: ProgressStats
}

export function ProgressOverview({ stats }: ProgressOverviewProps) {
  const cards = [
    { label: '计划数量', value: stats.planCount, unit: '个' },
    { label: '学习天数', value: stats.totalDays, unit: '天' },
    { label: '总学习时长', value: stats.totalHours, unit: '小时' },
    {
      label: '任务完成率',
      value: stats.totalTasks > 0 ? `${stats.completionRate}%` : '—',
      unit: stats.totalTasks > 0 ? `(${stats.completedTasks}/${stats.totalTasks})` : '',
    },
  ]

  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <p className="text-xs font-medium text-slate-500">{card.label}</p>
          <p className="mt-1 text-2xl font-bold text-indigo-600">
            {card.value}
            {typeof card.value === 'number' && (
              <span className="ml-1 text-sm font-normal text-slate-400">{card.unit}</span>
            )}
          </p>
          {typeof card.value === 'string' && card.unit && (
            <p className="text-xs text-slate-400">{card.unit}</p>
          )}
        </div>
      ))}
    </section>
  )
}
