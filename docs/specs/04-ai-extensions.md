# Spec 4：AI 学习建议与每日计划细化（拓展）

## Why

用户需要系统基于已有计划数据给出负载提醒、进度反馈，并在每日详情中生成更细化的学习步骤。

## What Changes

- 新增 `AiSuggestionsPanel` 首页 AI 建议面板
- 新增 `DailyRefinementPanel` 每日详情细化面板
- 新增规则引擎 `aiSuggestions.ts` / `aiDailyRefinement.ts`
- 细化结果持久化至 localStorage

## Requirements

1. 根据计划数量、本周预计时长、完成率生成学习建议
2. 检测单日负载超过 5 小时并给出警告
3. 每日详情页提供「细化当天计划」按钮
4. 细化结果包含学习材料、具体练习、完成标准（Markdown 展示）
5. 完成标准清单可勾选并持久化

## Scenarios

| 场景 | 预期结果 |
|------|----------|
| 用户有多个计划 | 首页显示本周概览与建议 |
| 某日任务超过 5 小时 | 显示负载偏高警告 |
| 用户点击「细化当天计划」 | 生成 Markdown 详细计划 |
| 用户勾选完成标准 | 刷新后状态保留 |

## Tasks

- [x] 实现 generateLearningSuggestions
- [x] 实现 refineDailyPlan
- [x] AiSuggestionsPanel 与 DailyRefinementPanel UI
- [x] refinements localStorage 持久化

## Checklist

- [x] 首页可见 AI 学习建议
- [x] 每日详情可细化并展示 Markdown
- [x] 完成标准 checklist 可勾选持久化
