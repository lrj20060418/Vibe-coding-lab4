# Spec 3：每日详情 — 以日期为中心 + 完成状态持久化

## Why

用户按「某一天要做什么」组织学习，而非按单个 planId。需要查看当天所有计划的任务，并标记完成状态且持久化。

## What Changes

- 新增 `/day/:date` 路由的每日详情页
- 任务 checkbox 完成状态与 localStorage 持久化
- 首页进度概览体现完成情况
- 支持 Markdown 导出

## Requirements

1. 路由 `/day/2026-06-02`，展示**当天所有计划**的任务（不以 planId + dayIndex 为中心）
2. 返回首页入口
3. 前一天 / 后一天切换（跳到有任务的相邻日期）
4. 当天总学习时长、所有计划任务汇总
5. 多计划时用分组或标签页展示
6. 每个任务有 checkbox，勾选后有视觉变化（删除线、颜色变淡）
7. 取消勾选可恢复
8. 勾选状态持久化，刷新后保留
9. 进度概览：已完成任务数 / 总任务数
10. 至少支持导出单个计划为 Markdown

## Scenarios

| 场景 | 预期结果 |
|------|----------|
| 用户从日历进入 6月2日详情 | 看到当天所有计划的任务，按计划分组 |
| 用户勾选某任务 | 任务显示删除线，进度数字更新 |
| 用户刷新页面 | 完成状态仍保留 |
| 用户取消勾选 | 状态恢复，进度更新 |
| 用户点击「前一天」 | 跳转到最近有任务的前一日期 |
| 用户导出计划 | 下载 Markdown，含日期、任务、时长、完成情况 |

## Tasks

- [x] 实现 DayDetailPage（/day/:date 路由）
- [x] 实现 getDayTasks 按日期聚合所有计划任务
- [x] 实现 updateTaskCompletion 持久化
- [x] 任务 checkbox 与视觉反馈
- [x] 前后天导航（有任务相邻日期）
- [x] ProgressOverview 完成率统计
- [x] exportPlanMarkdown 导出功能

## Checklist

- [x] 详情页以日期展示全部计划任务
- [x] 勾选任务刷新后仍完成
- [x] 进度数字正确
- [x] 前后天切换正常
- [x] 至少一种导出方式可用
- [x] 导出内容含完成情况

## 迭代修正记录

- **初版描述**：「查看某天详情」— 不够清晰
- **修正后**：「以日期为中心展示当天所有计划的任务，路由 /day/:date，不使用 planId + dayIndex」

> 完整 Trae 风格导出见 [`docs/trae-spec/SPEC-03-day-detail-completion.md`](../trae-spec/SPEC-03-day-detail-completion.md)
