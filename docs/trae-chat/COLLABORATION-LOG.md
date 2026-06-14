# Cursor 协作开发记录（等价 Trae /spec 流程）

> 本实验要求使用 Trae /spec 模式。实际开发使用 **Cursor Agent** 完成等价的需求拆解、分阶段实现与验收。
> 本文档为协作过程摘要，供助教审阅分阶段推进方式。

---

## 阶段 1：项目初始化与数据层

**目标**：搭建 React + Vite + TypeScript 工程，定义数据结构，实现 localStorage 持久化。

**协作内容**：
- 初始化 Vite 项目，配置 Tailwind CSS 4
- 定义 `LearningPlan` / `DailyPlan` / `Task` 类型
- 实现 `storage/plans.ts`：loadPlans、addPlan、deletePlan、updateTaskCompletion
- Git commit：`feat: 初始化学习计划工作台项目`、`feat: 完成计划数据模型与 localStorage 持久化`

---

## 阶段 2：基础功能（Spec 1–3）

**目标**：完成计划创建、统一日历、每日详情、进度、导出。

**协作内容**：
- `/spec` 等价文档：`docs/trae-spec/SPEC-01~03.md`
- 实现 PlanForm、HomePage、UnifiedCalendar、DayPreview、DayDetailPage、HistoryPanel
- 路由 `/day/:date`，日历多计划聚合 `calendarAggregate.ts`
- Git commit：`feat: 完成计划创建、统一日历、每日详情与进度功能`

**Spec 迭代修正**（协作中发现）：
- 「日历展示学习计划」→「展示所有计划并按日期聚合」
- 「查看某天详情」→「以日期为中心，路由 /day/:date」

---

## 阶段 3：Spec 文档与实验总结

**协作内容**：
- 编写 `docs/trae-spec/` 四组 Spec + Checklist
- 编写 `docs/LAB_SUMMARY.md`、`README.md`
- Git commit：`docs: 添加 Spec 文档、README 与实验总结`

---

## 阶段 4：自动化测试（拓展方向 A）

**目标**：Vitest 覆盖 Spec Scenario 与 Checklist。

**协作内容**：
- 配置 Vitest + Testing Library
- 测试文件：planGenerator、plans、calendarAggregate、progress、aiSuggestions、aiDailyRefinement
- 后续补充：dayDetail.test.tsx、e2e-flow.test.ts、refinements.test.ts
- 测试计划：`docs/TEST_PLAN.md`
- Git commit：`test: 添加 Vitest 自动化测试`（34 项全部通过）

---

## 阶段 5：AI 拓展（方向 C + D）

**目标**：真实大模型 API + 本地降级。

**协作内容**：
- Express 后端 `server/` 代理智谱 API，Key 仅存 `.env`
- 前端 `src/services/aiApi.ts` 调用 `/api/ai/suggestions`、`/api/ai/refine-daily`
- AiSuggestionsPanel、DailyRefinementPanel
- 联调排错：Base URL 重复路径 404、模型名 400 → 修正 `.env` 与 `normalizeBaseUrl`
- Git commit：`feat: 添加 AI 学习建议与每日计划细化`

---

## 阶段 6：Markdown 渲染与 Trae Spec 导出

**协作内容**：
- `react-markdown` + `MarkdownContent` 组件渲染细化结果
- `docs/trae-spec/` 完整 Spec 导出 + `ITERATION-LOG.md`
- 更新 SUBMISSION 清单

---

## 工具与辅助能力使用情况

| 工具 | 用途 | 效果 |
|------|------|------|
| Cursor Agent | 需求拆解、代码实现、联调排错 | 分模块推进，每阶段可运行 |
| /spec 等价流程 | docs/trae-spec | 需求清晰，有迭代记录 |
| Vitest | 自动化测试 | 34 项测试覆盖核心 Scenario |
| 智谱 GLM API | AI 建议与每日细化 | 大模型标签正常，失败时本地降级 |
| MCP（HeroUI） | UI 组件文档参考 | 开发辅助，非产品功能 |

**未实现**：方向 E 自定义 Agent（web_search / read_webpage），属选做加分项。

---

## 分阶段 Git 提交记录

见 `docs/git-log.txt` 或运行 `git log --oneline`。
