import { useState } from 'react'
import type { PlanFormData } from '../types'
import { validatePlanForm, generatePlan } from '../utils/planGenerator'
import { todayString } from '../utils/dates'
import type { LearningPlan } from '../types'

interface PlanFormProps {
  onSubmit: (plan: LearningPlan) => void
}

const defaultForm: PlanFormData = {
  title: '',
  notes: '',
  startDate: todayString(),
  days: 14,
  dailyHours: 1.5,
  customDailyContent: '',
}

export function PlanForm({ onSubmit }: PlanFormProps) {
  const [form, setForm] = useState<PlanFormData>(defaultForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[name]
      return next
    })
    setSuccess(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validatePlanForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const plan = generatePlan(form)
    onSubmit(plan)
    setForm({ ...defaultForm, startDate: todayString() })
    setErrors({})
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">创建学习计划</h2>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          学习主题 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="例如：React 基础、线性代数复习"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">补充说明</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={2}
          placeholder="已有基础、学习重点、考试目标等"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          开始日期 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {errors.startDate && (
          <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            计划天数 <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="days"
            min={1}
            max={90}
            value={form.days}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {errors.days && <p className="mt-1 text-xs text-red-500">{errors.days}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            每日时长(小时) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="dailyHours"
            min={0.5}
            max={6}
            step={0.5}
            value={form.dailyHours}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {errors.dailyHours && (
            <p className="mt-1 text-xs text-red-500">{errors.dailyHours}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          每日任务内容（选填）
        </label>
        <input
          type="text"
          name="customDailyContent"
          value={form.customDailyContent}
          onChange={handleChange}
          placeholder="留空则由系统根据主题自动生成"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
      >
        创建计划
      </button>

      {success && (
        <p className="text-center text-sm text-green-600">计划创建成功！</p>
      )}
    </form>
  )
}
