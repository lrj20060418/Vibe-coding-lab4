import { useCallback, useEffect, useState } from 'react'
import type { LearningPlan } from '../types'
import {
  loadPlans,
  addPlan as storageAddPlan,
  deletePlan as storageDeletePlan,
  updateTaskCompletion as storageUpdateTask,
} from '../storage/plans'

export function usePlans() {
  const [plans, setPlans] = useState<LearningPlan[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setPlans(loadPlans())
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addPlan = useCallback(
    (plan: LearningPlan) => {
      const updated = storageAddPlan(plan)
      setPlans(updated)
    },
    [],
  )

  const deletePlan = useCallback(
    (planId: string) => {
      const updated = storageDeletePlan(planId)
      setPlans(updated)
    },
    [],
  )

  const updateTaskCompletion = useCallback(
    (planId: string, date: string, taskId: string, completed: boolean) => {
      const updated = storageUpdateTask(planId, date, taskId, completed)
      setPlans(updated)
    },
    [],
  )

  return { plans, loading, addPlan, deletePlan, updateTaskCompletion, refresh }
}
