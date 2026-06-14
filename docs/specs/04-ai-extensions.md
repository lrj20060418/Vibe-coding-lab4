# Spec 4：AI 学习建议与每日计划细化（拓展）

## Why

用户需要系统基于已有计划数据给出负载提醒、进度反馈，并在每日详情中生成更细化的学习步骤。

## What Changes

- 新增 `AiSuggestionsPanel` 首页 AI 建议面板
- 新增 `DailyRefinementPanel` 每日详情细化面板
- 新增 Express 后端 `/api/ai/*` 代理大模型调用（API Key 仅存服务端 `.env`）
- 本地规则引擎作为降级方案
- 细化结果持久化至 localStorage

## Requirements

1. 根据计划数量、本周预计时长、完成率生成学习建议（优先调用大模型 API）
2. 检测单日负载超过 5 小时并给出警告
3. 每日详情页提供「细化当天计划」按钮（调用大模型 API）
4. 细化结果包含学习材料、具体练习、完成标准（Markdown 展示）
5. 完成标准清单可勾选并持久化
6. API Key 不得暴露在前端代码中

## Scenarios

| 场景 | 预期结果 |
|------|----------|
| 用户配置 AI_API_KEY 并启动 dev:all | 首页/详情页显示「大模型」标签 |
| 用户有多个计划 | 首页显示 AI 生成的本周概览与建议 |
| 某日任务超过 5 小时 | 显示负载偏高警告 |
| 用户点击「细化当天计划」 | 调用 API 生成 Markdown 详细计划 |
| API 未配置或失败 | 自动降级为本地规则，页面有提示 |
| 用户勾选完成标准 | 刷新后状态保留 |

## Tasks

- [x] 实现 Express 后端 ai 路由
- [x] 实现 fetchLearningSuggestions / fetchDailyRefinement
- [x] 保留 generateLearningSuggestionsLocal / refineDailyPlanLocal 降级
- [x] AiSuggestionsPanel 与 DailyRefinementPanel UI
- [x] refinements localStorage 持久化
- [x] .env.example 与 Vite 代理配置

## Checklist

- [x] 首页可见 AI 学习建议（大模型或降级）
- [x] 每日详情可细化并展示 Markdown
- [x] 完成标准 checklist 可勾选持久化
- [x] API Key 仅在后端 .env，不提交 git
