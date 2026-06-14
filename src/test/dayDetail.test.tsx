import { describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { DayDetailPage } from '../pages/DayDetailPage'
import { savePlans } from '../storage/plans'
import { createMockPlan, createSecondPlan } from './fixtures'

describe('DayDetailPage 每日详情展示', () => {
  it('Spec3: 以日期为中心展示当天所有计划任务', async () => {
    savePlans([createMockPlan(), createSecondPlan()])

    render(
      <MemoryRouter initialEntries={['/day/2026-06-02']}>
        <Routes>
          <Route path="/day/:date" element={<DayDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('React 基础')).toBeInTheDocument()
    })
    expect(screen.getByText('线性代数复习')).toBeInTheDocument()
    expect(screen.getByText(/当天总学习时长/)).toBeInTheDocument()
    expect(screen.getByText(/涉及 2 个计划/)).toBeInTheDocument()
  })

  it('Spec3: 勾选任务后有删除线视觉变化', async () => {
    savePlans([createMockPlan()])
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/day/2026-06-01']}>
        <Routes>
          <Route path="/day/:date" element={<DayDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('React 基础概念')).toBeInTheDocument()
    })

    const checkbox = screen.getAllByRole('checkbox')[0]
    await user.click(checkbox)

    const title = screen.getByText('React 基础概念')
    expect(title.className).toMatch(/line-through/)
  })

  it('Spec3: 无任务日期显示空状态', async () => {
    savePlans([createMockPlan()])

    render(
      <MemoryRouter initialEntries={['/day/2099-01-01']}>
        <Routes>
          <Route path="/day/:date" element={<DayDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('该日期没有学习任务')).toBeInTheDocument()
    })
  })
})
