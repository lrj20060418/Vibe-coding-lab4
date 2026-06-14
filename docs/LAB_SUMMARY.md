# Lab 4 实验总结

## 1. 系统模块

| 模块 | 职责 |
|------|------|
| `PlanForm` | 计划创建表单与校验 |
| `storage/plans.ts` | localStorage 持久化（增删改、完成状态） |
| `planGenerator.ts` | 根据表单生成结构化 DailyPlan + Task |
| `calendarAggregate.ts` | 多计划按日期聚合 |
| `UnifiedCalendar` | 月历视图与日期点击 |
| `DayPreview` | 每日任务快速预览弹窗 |
| `DayDetailPage` | 以日期为中心的详情页与 checkbox |
| `ProgressOverview` | 首页进度统计 |
| `exportMarkdown.ts` | 计划 Markdown 导出 |
| `server/` | Express 后端，代理大模型 API（Key 仅存 .env） |
| `src/services/aiApi.ts` | AI 请求 + 本地规则降级 |
| `AiSuggestionsPanel` | AI 学习建议（负载、复盘、进度） |
| `DailyRefinementPanel` | 每日计划细化 + Markdown 渲染 |
| `MarkdownContent` | react-markdown 渲染组件 |

## 2. 数据结构

```
LearningPlan (1) ──< DailyPlan (N) ──< Task (N)
     │
     └── 多个 LearningPlan 可同时存在
     └── 同一 date 可出现在多个 plan 的 DailyPlan 中
```

- **LearningPlan**：id, title, startDate, days, dailyHours, notes, dailyPlans[], createdAt
- **DailyPlan**：date, goal, tasks[]
- **Task**：id, title, description, estimatedHours, completed, practiceSuggestion
- **DailyRefinement**：date, markdown, checklist[], generatedAt, source（ai | local）

## 3. 统一日历实现

遍历所有 plan 的 `dailyPlans`，按 `date` 字段合并：

```typescript
// aggregateCalendarDays: Map<date, { totalHours, taskCount, planIds, planTitles }>
```

同一天多个计划的任务合并到一个日历格子，显示合计时长和任务数。

## 4. 日期中心详情

路由设计为 `/day/:date`（如 `/day/2026-06-02`），而非 `planId + dayIndex`。

原因：用户关心的是「某一天要做什么」，当天可能涉及多个计划。详情页通过 `getDayPlanEntries(plans, date)` 聚合当天所有计划的任务。

## 5. /spec 模式与迭代修正

本实验要求 Trae /spec 模式；实际使用 **Cursor Agent** 完成等价流程，Spec 文档见 `docs/specs/` 与 `docs/trae-spec/`。

| 初版（模糊） | 修正后（明确） |
|-------------|---------------|
| 日历展示学习计划 | 日历展示**所有已保存计划**的任务，按日期**聚合合并** |
| 查看某天详情 | 以**日期**为中心展示当天**所有计划**的任务，路由 `/day/:date` |
| 前端直接调 API | Express 后端代理，Key 仅存 `.env`；Base URL 只填根地址 |

完整迭代记录见 `docs/trae-spec/ITERATION-LOG.md`。

## 6. 拓展功能尝试

### 自动化测试（方向 A）

- 9 个测试文件，**34 项测试**全部通过（`npm test`）
- 覆盖：表单校验、持久化、日历聚合、每日详情、端到端流程、AI 逻辑
- 测试计划：`docs/TEST_PLAN.md`

### AI 学习建议（方向 C）

- 首页 `AiSuggestionsPanel` 调用 `/api/ai/suggestions`
- 智谱 GLM 生成：本周概览、负载警告（>5h）、学习复盘、调整建议
- API 失败时降级为本地规则引擎

### 每日计划细化（方向 D）

- 详情页「细化当天计划」调用 `/api/ai/refine-daily`
- `MarkdownContent` 渲染学习材料、练习、完成标准
- checklist 可勾选，持久化至 localStorage

### 开发辅助（方向 B）

- **Cursor Agent**：需求拆解、分模块实现、联调排错、测试编写
- **MCP（HeroUI）**：UI 组件文档参考
- 协作记录：`docs/trae-chat/COLLABORATION-LOG.md`

### 未实现

- 方向 E 自定义 Agent（web_search / read_webpage）

## 7. 自测 Checklist

- [x] 可创建多份计划，旧计划不被覆盖
- [x] 刷新后计划与完成状态仍在
- [x] 日历显示所有计划，同一天合并显示合计
- [x] 点击有任务日期 → 预览 → 详情页
- [x] 详情页以日期展示全部计划任务
- [x] 勾选任务刷新后仍完成；进度数字正确
- [x] 删除计划后日历与进度更新
- [x] 表单校验有明确错误提示
- [x] 无计划时有空状态引导
- [x] 支持 Markdown 导出
- [x] AI 大模型建议与每日细化（智谱 API）
- [x] Markdown 细化结果正确渲染
- [x] `npm test` 34 项全部通过
