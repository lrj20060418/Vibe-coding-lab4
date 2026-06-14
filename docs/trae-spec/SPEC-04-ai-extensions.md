# /spec — AI 学习建议与每日计划细化（拓展）

```yaml
spec_id: SPEC-04
phase: Phase 4 — AI 拓展
status: ✅ 已完成并验收
tool: Trae /spec 模式（Cursor Agent 等价实现）
depends_on: SPEC-01, SPEC-03
modules:
  - server/ai.mjs
  - server/index.mjs
  - src/services/aiApi.ts
  - src/components/AiSuggestionsPanel.tsx
  - src/components/DailyRefinementPanel.tsx
  - src/components/MarkdownContent.tsx
```

---

## Why

用户需要系统基于已有计划数据给出负载提醒、进度反馈，并在每日详情中生成更细化的学习步骤。

---

## What Changes

| 变更项 | 说明 |
|--------|------|
| Express 后端 | `/api/ai/*` 代理大模型，Key 仅存 `.env` |
| `AiSuggestionsPanel` | 首页 AI 学习建议 |
| `DailyRefinementPanel` | 每日计划细化 + checklist |
| `MarkdownContent` | react-markdown 渲染 |
| 本地降级 | API 不可用时规则引擎兜底 |

---

## Requirements

1. 根据计划数量、本周时长、完成率生成学习建议（优先大模型）
2. 检测单日负载超过 5 小时并警告
3. 每日详情「细化当天计划」按钮，调用大模型 API
4. 细化含学习材料、练习、完成标准（Markdown 展示）
5. checklist 可勾选并持久化
6. API Key 不得暴露在前端

---

## Scenarios

| ID | 场景 | 预期结果 |
|----|------|----------|
| S4-01 | 配置 AI_API_KEY 并 dev:all | 显示「大模型」标签 |
| S4-02 | 多计划存在 | 首页 AI 本周概览与建议 |
| S4-03 | 某日 >5h | 负载偏高警告 |
| S4-04 | 点击细化 | 生成 Markdown 详细计划 |
| S4-05 | API 失败 | 降级本地规则 + 提示 |
| S4-06 | 勾选完成标准 | 刷新后保留 |

---

## Tasks

| ID | 任务 | 状态 |
|----|------|------|
| T4-01 | Express 后端 ai 路由 | ✅ |
| T4-02 | fetchLearningSuggestions / fetchDailyRefinement | ✅ |
| T4-03 | 本地降级引擎 | ✅ |
| T4-04 | AiSuggestionsPanel / DailyRefinementPanel | ✅ |
| T4-05 | refinements localStorage | ✅ |
| T4-06 | MarkdownContent 渲染 | ✅ |
| T4-07 | .env.example + Vite 代理 | ✅ |

---

## Checklist（验收）

- [x] 首页可见 AI 学习建议（大模型或降级）
- [x] 每日详情可细化并 Markdown 渲染
- [x] 完成标准 checklist 可勾选持久化
- [x] API Key 仅在后端 .env

---

## Spec 迭代记录

| 初版 | 修正后 |
|------|--------|
| 纯前端规则引擎 | Express 后端代理 + 智谱 API + 本地降级 |
| `<pre>` 原样展示 | react-markdown 渲染 |
| AI_API_BASE 填完整 URL | 只填根地址，normalizeBaseUrl 防重复路径 |

见 [`ITERATION-LOG.md`](./ITERATION-LOG.md) 迭代 #3–#5。
