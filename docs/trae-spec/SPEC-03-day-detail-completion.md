# /spec — 每日详情：以日期为中心 + 完成状态持久化

```yaml
spec_id: SPEC-03
phase: Phase 3 — 每日详情与进度
status: ✅ 已完成并验收
tool: Trae /spec 模式（Cursor Agent 等价实现）
created: 2026-06-02
updated: 2026-06-03
depends_on: SPEC-01, SPEC-02
modules:
  - src/pages/DayDetailPage.tsx
  - src/utils/exportMarkdown.ts
  - src/components/HistoryPanel.tsx
  - src/storage/plans.ts (updateTaskCompletion)
```

---

## Why

用户关心的是「**某一天要做什么**」，而不是「某个计划的第 N 天」。详情页必须以**日期**为中心，汇总当天所有计划的任务，并支持勾选完成且持久化。

---

## What Changes

| 变更项 | 说明 |
|--------|------|
| 路由 `/day/:date` | 日期中心详情页 |
| `updateTaskCompletion` | checkbox 状态写入 localStorage |
| `ProgressOverview` | 首页体现完成率 |
| `exportPlanMarkdown` | 单计划 Markdown 导出 |

---

## Requirements

### R1 路由与组织方式

- 路由形式：`/day/2026-06-02`
- 展示**当天所有计划**的任务
- **禁止**仅依赖 `planId + dayIndex`

### R2 详情页内容

- 返回首页入口
- 当前日期、当天总学习时长
- 前/后一天切换（跳到有任务的相邻日期）
- 多计划时分组展示：目标、任务列表、时长、练习建议

### R3 完成状态

- 每任务 checkbox
- 勾选：删除线、颜色变淡、完成图标
- 取消勾选可恢复
- 持久化，刷新后保留

### R4 进度与导出

- 首页进度：已完成任务数 / 总任务数
- 至少支持导出单个计划为 Markdown（含完成情况）

---

## Scenarios

| ID | 场景 | 预期结果 |
|----|------|----------|
| S3-01 | 从日历进入 6月2日详情 | 看到当天**所有计划**任务，按计划分组 |
| S3-02 | 勾选某任务 | 删除线 + 进度数字更新 |
| S3-03 | 刷新页面 | 完成状态仍保留 |
| S3-04 | 取消勾选 | 状态恢复 |
| S3-05 | 点击「前一天」 | 跳转到最近有任务的前一日期 |
| S3-06 | 历史计划点「导出」 | 下载 Markdown，含 `[x]`/`[ ]` 完成情况 |
| S3-07 | DayPreview 点「进入完整详情」 | 跳转 `/day/:date` |

---

## Tasks

| ID | 任务 | 优先级 | 状态 |
|----|------|--------|------|
| T3-01 | 配置路由 `/day/:date` | P0 | ✅ |
| T3-02 | getDayPlanEntries 聚合当天任务 | P0 | ✅ |
| T3-03 | updateTaskCompletion 持久化 | P0 | ✅ |
| T3-04 | checkbox 视觉反馈 | P0 | ✅ |
| T3-05 | getAdjacentTaskDate 前后天导航 | P1 | ✅ |
| T3-06 | ProgressOverview 完成率 | P1 | ✅ |
| T3-07 | exportPlanMarkdown + 下载 | P1 | ✅ |

---

## Checklist（验收）

- [x] 详情页以日期展示全部计划任务
- [x] 勾选任务刷新后仍完成
- [x] 进度数字正确
- [x] 前后天切换正常
- [x] 至少一种导出方式可用
- [x] 导出内容含完成情况
- [x] 预览 → 详情链路通畅

---

## Spec 迭代记录 ⭐

### v0.1 初稿（模糊 — 已废弃）

```
查看某天详情
```

| 问题 | 后果 |
|------|------|
| 未明确「日期中心」还是「计划中心」 | 可能做成 `/plan/:id/day/3` 只看单计划 |
| 与统一日历逻辑不一致 | 用户无法在详情页看到当天全部安排 |

### v1.0 修正后（明确 — 当前实现）

```
以日期为中心展示当天所有计划的任务；
路由 /day/:date；
使用 getDayPlanEntries(plans, date) 聚合；
不使用 planId + dayIndex 作为详情主键。
```

**实现验证**：

```tsx
// App.tsx
<Route path="/day/:date" element={<DayDetailPage />} />
```

**关联测试**：`dayDetail.test.tsx`、`e2e-flow.test.ts`

---

## 完整闭环（Spec 1 → 2 → 3）

```
创建计划 → 保存 → 统一日历聚合 → 点击预览 → 进入详情
    → 勾选完成 → 进度更新 → 导出 Markdown
```
