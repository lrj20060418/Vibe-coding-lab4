# /spec — 计划创建、保存与基础工作台

```yaml
spec_id: SPEC-01
phase: Phase 1 — 初始项目
status: ✅ 已完成并验收
tool: Trae /spec 模式（Cursor Agent 等价实现）
created: 2026-06-01
updated: 2026-06-03
modules:
  - src/components/PlanForm.tsx
  - src/components/ProgressOverview.tsx
  - src/components/HistoryPanel.tsx
  - src/storage/plans.ts
  - src/utils/planGenerator.ts
  - src/pages/HomePage.tsx
```

---

## Why

用户进入系统后，需要把「想学什么」转化为**结构化的逐日学习任务**，并**持久化保存**，以便后续在日历中统一查看。这是整个学习工作台的数据入口。

---

## What Changes

| 变更项 | 说明 |
|--------|------|
| 新增 `PlanForm` | 学习计划创建表单 |
| 新增 `storage/plans.ts` | localStorage 持久化层 |
| 新增 `planGenerator.ts` | 根据表单生成 DailyPlan + Task |
| 新增 `HomePage` | 首页布局：表单 + 进度 + 空状态 |
| 新增 `ProgressOverview` | 计划数 / 天数 / 时长 / 完成率 |
| 新增 `HistoryPanel` | 历史计划列表与删除 |

---

## Requirements

### R1 表单字段

| 字段 | 约束 |
|------|------|
| 学习主题 | 必填 |
| 补充说明 | 选填 |
| 开始日期 | 必填 |
| 计划天数 | 1–90 |
| 每日可用时长 | 0.5–6 小时 |
| 每日任务内容 | 选填；留空则系统模板生成 |

### R2 表单校验

- 学习主题不能为空
- 计划天数不能小于 1
- 每日时长不能小于 0.5 小时，不能超过 6 小时
- 校验失败：页面显示明确错误，**不保存**

### R3 结构化数据

保存后必须得到 `LearningPlan` + `DailyPlan[]` + `Task[]`，每天含：

- date、goal、tasks（title、description、estimatedHours、practiceSuggestion、completed）

### R4 多计划与持久化

- 多个计划可同时存在，新计划不覆盖旧计划
- 页面刷新后数据仍在 localStorage

### R5 首页工作台

- 导航栏、创建表单、进度概览
- 无计划时显示空状态引导，不能是空白页

---

## Scenarios

| ID | 场景 | 预期结果 |
|----|------|----------|
| S1-01 | 用户填写「React 基础」14 天计划并提交 | 历史列表出现该计划 |
| S1-02 | 用户提交空主题 | 显示「学习主题不能为空」，不保存 |
| S1-03 | 用户设置天数为 0 | 显示错误，不保存 |
| S1-04 | 用户设置每日时长 0.3 小时 | 显示错误，不保存 |
| S1-05 | 用户创建第二份计划 | 两份计划均保留 |
| S1-06 | 刷新页面 | 计划仍在 |

---

## Tasks

| ID | 任务 | 优先级 | 状态 |
|----|------|--------|------|
| T1-01 | 定义 TypeScript 类型 LearningPlan / DailyPlan / Task | P0 | ✅ |
| T1-02 | 实现 localStorage 读写 addPlan / deletePlan / loadPlans | P0 | ✅ |
| T1-03 | 实现 validatePlanForm + generatePlan | P0 | ✅ |
| T1-04 | 实现 PlanForm 组件 | P0 | ✅ |
| T1-05 | 实现 HomePage 布局与空状态 | P0 | ✅ |
| T1-06 | 实现 ProgressOverview | P1 | ✅ |
| T1-07 | 实现 HistoryPanel 摘要与删除 | P1 | ✅ |

---

## Checklist（验收）

- [x] 可创建多份计划，旧计划不被覆盖
- [x] 刷新后计划仍在
- [x] 表单校验：空主题、天数&lt;1、时长超范围有提示
- [x] 无计划时有空状态引导
- [x] 保存后数据结构完整（含 date、goal、tasks）
- [x] 历史计划显示名称、日期、天数、时长、创建时间

---

## Spec 迭代记录

### v0.1 初稿

> 「用户可以创建学习计划并保存。」

**问题**：未说明生成的是结构化逐日任务还是一段文字；未规定字段与校验。

### v1.0 修正后（当前）

> 「表单收集主题/日期/天数/时长，校验通过后由 `generatePlan` 生成含 DailyPlan[] 的结构化数据，写入 localStorage，支持多计划并存。」

**关联测试**：`planGenerator.test.ts`、`plans.test.ts`

---

## 数据结构（本 Spec 产出）

```
LearningPlan
 ├── id, title, startDate, days, dailyHours, notes?, createdAt
 └── dailyPlans[]
      ├── date, goal
      └── tasks[]
           └── id, title, description, estimatedHours, completed, practiceSuggestion?
```
