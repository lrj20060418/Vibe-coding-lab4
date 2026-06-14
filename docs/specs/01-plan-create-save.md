# Spec 1：计划创建、保存与基础日历

## Why

用户需要把「想学什么」转化为结构化的逐日学习任务，并持久化保存，以便在日历中查看安排。

## What Changes

- 新增学习计划创建表单
- 新增 localStorage 持久化层
- 新增基础月历展示（单计划/多计划任务日期高亮）

## Requirements

1. 表单字段：学习主题（必填）、补充说明（选填）、开始日期（必填）、计划天数（1–90）、每日可用时长（0.5–6 小时）
2. 校验失败时在页面显示明确错误，不保存无效数据
3. 保存后生成结构化数据：`LearningPlan` + `DailyPlan[]` + `Task[]`
4. 每个 DailyPlan 包含：date、goal、tasks（含 title、description、estimatedHours、practiceSuggestion、completed）
5. 多个计划可同时存在，新计划不覆盖旧计划
6. 页面刷新后数据仍然存在

## Scenarios

| 场景 | 预期结果 |
|------|----------|
| 用户填写「React 基础」14 天计划并提交 | 历史列表出现该计划，日历对应 14 天有高亮 |
| 用户提交空主题 | 显示「学习主题不能为空」，不保存 |
| 用户设置天数为 0 | 显示错误，不保存 |
| 用户设置每日时长 0.3 小时 | 显示错误，不保存 |
| 用户创建第二份计划 | 两份计划均保留，日历合并展示 |

## Tasks

- [x] 定义 TypeScript 类型（LearningPlan, DailyPlan, Task）
- [x] 实现 localStorage 读写（loadPlans, savePlans, addPlan, deletePlan）
- [x] 实现计划生成逻辑（根据 startDate + days 生成逐日任务）
- [x] 实现 PlanForm 组件与表单校验
- [x] 实现 HomePage 布局与空状态提示
- [x] 实现 ProgressOverview 进度概览组件

## Checklist

- [x] 可创建多份计划，旧计划不被覆盖
- [x] 刷新后计划仍在
- [x] 表单校验：空主题、天数<1、时长超范围有提示
- [x] 无计划时有空状态引导
- [x] 保存后数据结构完整（含 date、goal、tasks）

## 迭代修正记录

- **初版（模糊）**：「用户可以创建学习计划并保存」— 未明确结构化逐日任务与校验规则
- **修正后（明确）**：「表单校验通过后生成 LearningPlan + DailyPlan[] + Task[]，多计划 localStorage 并存，首页含空状态与进度概览」

> 完整 Trae 风格导出见 [`docs/trae-spec/SPEC-01-plan-create-save.md`](../trae-spec/SPEC-01-plan-create-save.md)
