# 测试计划

本项目的自动化测试使用 Vitest，对应 Spec 中的 Requirements 与 Scenarios。

## 运行方式

```bash
npm test
```

## 测试与需求映射

| 测试文件 | 对应 Requirement / Scenario |
|----------|----------------------------|
| `planGenerator.test.ts` | 表单校验：空主题、天数、时长范围；结构化 DailyPlan 生成 |
| `plans.test.ts` | 多计划保存不覆盖；完成状态持久化；删除计划 |
| `calendarAggregate.test.ts` | 多计划同日期合并；按日期聚合；前后天导航 |
| `progress.test.ts` | 完成率统计；已完成/总任务数 |
| `aiSuggestions.test.ts` | AI 建议：概览、负载警告、进度提醒 |
| `aiDailyRefinement.test.ts` | 每日细化：Markdown 结构、多计划合并 |

## 覆盖的核心 Scenario

- 用户提交空主题 → 校验拒绝
- 用户创建第二份计划 → 两份均保留
- 6月2日两个计划都有任务 → 日历合并显示合计
- 勾选任务 → 刷新后仍完成
- 单日超过 5 小时 → AI 负载警告
