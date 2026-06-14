# 测试计划（方向 A）

本项目的自动化测试使用 **Vitest + Testing Library**，依据 Spec 1–4 的 Requirements、Scenarios 与 Checklist 设计。

## 运行方式

```bash
npm test
```

---

## 方向 A：测试类型覆盖

| 实验要求 | 状态 | 测试文件 |
|----------|------|----------|
| 表单校验测试 | ✅ | `planGenerator.test.ts` |
| 计划保存和读取测试 | ✅ | `plans.test.ts` |
| 多计划日历聚合测试 | ✅ | `calendarAggregate.test.ts` |
| 每日详情展示测试 | ✅ | `dayDetail.test.tsx` |
| checkbox 完成状态持久化测试 | ✅ | `plans.test.ts`, `dayDetail.test.tsx` |
| 端到端流程测试 | ✅ | `e2e-flow.test.ts` |
| 细化 checklist 持久化 | ✅ | `refinements.test.ts` |
| AI 建议 / 细化逻辑 | ✅ | `aiSuggestions.test.ts`, `aiDailyRefinement.test.ts` |

---

## 测试 ↔ Spec Requirement / Scenario 映射

### Spec 1：计划创建与保存

| Scenario / Requirement | 测试用例 |
|------------------------|----------|
| 用户提交空主题 → 显示错误 | `planGenerator.test.ts` → rejects empty title |
| 用户设置天数为 0 → 显示错误 | `planGenerator.test.ts` → rejects days less than 1 |
| 用户设置每日时长 0.3h → 显示错误 | `planGenerator.test.ts` → rejects daily hours below 0.5 |
| 保存后数据结构完整 | `planGenerator.test.ts` → each day has goal and tasks |
| 用户创建第二份计划，两份均保留 | `plans.test.ts` → persists multiple plans |
| 刷新后计划仍在 | `plans.test.ts` → loadPlans after save |

### Spec 2：统一日历

| Scenario / Requirement | 测试用例 |
|------------------------|----------|
| 6月2日两计划都有任务 → 合并显示 | `calendarAggregate.test.ts` → merges multiple plans on same date |
| 点击有任务日期 → 当天所有计划 | `calendarAggregate.test.ts` → returns all plan entries for a date |
| 前后天导航 | `calendarAggregate.test.ts` → navigates to adjacent dates |
| 删除计划后日历更新 | `e2e-flow.test.ts` → 删除计划后日历更新 |

### Spec 3：每日详情与完成状态

| Scenario / Requirement | 测试用例 |
|------------------------|----------|
| 6月2日详情看到所有计划任务 | `dayDetail.test.tsx` → 以日期为中心展示 |
| 勾选任务 → 删除线视觉变化 | `dayDetail.test.tsx` → 勾选任务后有删除线 |
| 刷新后完成状态保留 | `plans.test.ts` → persists completion state |
| 进度数字正确 | `progress.test.ts` → calculates global completion rate |
| 无任务日期空状态 | `dayDetail.test.tsx` → 无任务日期显示空状态 |

### Spec 4 / 方向 C & D

| Scenario / Requirement | 测试用例 |
|------------------------|----------|
| 单日超过 5 小时 → 负载警告 | `aiSuggestions.test.ts` → warns when overload |
| 细化 Markdown 含材料/练习/标准 | `aiDailyRefinement.test.ts` → generates markdown structure |
| 多计划当天细化 | `aiDailyRefinement.test.ts` → includes all plans |
| checklist 勾选持久化 | `refinements.test.ts` → 勾选完成标准后持久化 |

### 端到端（跨 Spec 闭环）

| 流程步骤 | 测试用例 |
|----------|----------|
| 创建 → 保存 → 日历 → 详情 → 勾选 → 进度 → 细化 → 删除 | `e2e-flow.test.ts` → 完整流程 |

---

## 方向 C / D / E 功能实现状态

| 方向 | 状态 | 说明 |
|------|------|------|
| **C：AI 学习建议** | ✅ 已实现 | 大模型 API + 本地降级；含概览、负载警告、复盘、调整建议 |
| **D：每日计划细化** | ✅ 已实现 | 详情页按钮、Markdown、可勾选 checklist、持久化 |
| **E：自定义 Agent** | ❌ 未实现 | 无 web_search / read_webpage / 多步 Agent（选做加分项） |

---

## 未覆盖项说明

- **浏览器级 E2E**（Playwright/Cypress）：未引入，当前为逻辑层 + 组件层测试，已覆盖实验列出的全部测试类型。
- **真实 AI API 集成测试**：需配置 `AI_API_KEY` 后手动验证；单测只测本地降级逻辑。
