# /spec — 统一日历：多计划聚合展示

```yaml
spec_id: SPEC-02
phase: Phase 2 — 统一日历
status: ✅ 已完成并验收
tool: Trae /spec 模式（Cursor Agent 等价实现）
created: 2026-06-02
updated: 2026-06-03
depends_on: SPEC-01
modules:
  - src/components/UnifiedCalendar.tsx
  - src/components/DayPreview.tsx
  - src/utils/calendarAggregate.ts
```

---

## Why

用户同时推进多个学习目标（如 React + 线性代数）时，**不应在多个独立日历间切换**，而应在**同一日历**中看到所有计划的任务安排，并按日期汇总。

---

## What Changes

| 变更项 | 说明 |
|--------|------|
| `calendarAggregate.ts` | 按 date 合并所有 plan 的 dailyPlans |
| `UnifiedCalendar` | 月历视图、周排列、月切换、高亮 |
| `DayPreview` | 点击日期后的快速预览弹窗 |

---

## Requirements

### R1 聚合范围（核心）

日历展示**所有已保存计划**的任务，按日期**合并**——**不是**单个计划的日历。

### R2 月历交互

- 月历视图，按周排列日期格子
- 支持切换上一个月 / 下一个月
- 有学习任务的日期高亮

### R3 格子信息

- 显示当天**总学习时长**和/或**任务数量**
- 同一天多个计划 → **一个格子**，显示合计

### R4 点击行为

- 点击**无任务**日期：不报错，不弹窗
- 点击**有任务**日期：打开每日预览

---

## Scenarios

| ID | 场景 | 预期结果 |
|----|------|----------|
| S2-01 | 「React 基础」+「线性代数」6月2日都有任务 | 6月2日**一格**，显示合计时长（如 3h） |
| S2-02 | 切换到上/下月 | 对应月份正确，有任务日期仍高亮 |
| S2-03 | 点击无任务日期 | 不报错，不打开预览 |
| S2-04 | 点击有任务日期 | 打开 DayPreview，显示当天所有计划任务 |
| S2-05 | 删除一个计划 | 日历同步更新，该计划日期不再高亮（若无其他任务） |

---

## Tasks

| ID | 任务 | 优先级 | 状态 |
|----|------|--------|------|
| T2-01 | 实现 aggregateCalendarDays 聚合逻辑 | P0 | ✅ |
| T2-02 | 实现 getDayPlanEntries 按日期取全部计划 | P0 | ✅ |
| T2-03 | 实现 UnifiedCalendar 月历 + 月切换 | P0 | ✅ |
| T2-04 | 日历格子高亮 + 合计时长/任务数 | P0 | ✅ |
| T2-05 | 实现 DayPreview 弹窗 | P1 | ✅ |
| T2-06 | 无任务日期 disabled 处理 | P1 | ✅ |

---

## Checklist（验收）

- [x] 日历显示所有计划，同一天合并显示合计
- [x] 月切换正常
- [x] 有任务日期高亮
- [x] 点击有任务日期 → 预览
- [x] 点击无任务日期不报错
- [x] 删除计划后日历同步更新

---

## Spec 迭代记录 ⭐

### v0.1 初稿（模糊 — 已废弃）

```
日历展示学习计划
```

| 问题 | 后果 |
|------|------|
| 未说明「所有计划」还是「当前计划」 | 可能只展示刚创建的计划 |
| 未说明同天多计划如何显示 | 可能重复多个格子或只显示一个计划 |

### v1.0 修正后（明确 — 当前实现）

```
日历展示所有已保存计划的任务，按日期聚合合并，
同一日期格子显示合计时长（totalHours）和任务数（taskCount）。
```

**实现验证**：

```typescript
// aggregateCalendarDays: Map<date, { totalHours, taskCount, planIds, planTitles }>
```

**关联测试**：`calendarAggregate.test.ts` → merges multiple plans on same date

---

## 与 Spec 1 的衔接

```
SPEC-01 产出 plans[]  →  SPEC-02 读取全部 plans 聚合  →  日历格子
```
