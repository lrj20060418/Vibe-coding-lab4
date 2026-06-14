# Trae /spec 设计记录（导出）

> 本目录为实验要求的 **Spec 设计记录**，格式模仿 Trae `/spec` 模式输出。
> 实际开发使用 **Cursor Agent** 完成等价的需求拆解、任务跟进与验收检查。

## 文档清单

| 编号 | 文件 | 对应实验 Spec 建议 |
|------|------|-------------------|
| Spec 1 | [SPEC-01-plan-create-save.md](./SPEC-01-plan-create-save.md) | 初始项目 Spec：计划创建、保存、基础日历 |
| Spec 2 | [SPEC-02-unified-calendar.md](./SPEC-02-unified-calendar.md) | 统一日历 Spec：多计划聚合展示 |
| Spec 3 | [SPEC-03-day-detail-completion.md](./SPEC-03-day-detail-completion.md) | 每日详情 Spec：日期中心 + 勾选完成 |
| 迭代 | [ITERATION-LOG.md](./ITERATION-LOG.md) | 全部需求修正前后对照记录 |

## 使用方式说明

每组 Spec 均包含：

1. **Why** — 为什么需要这个功能
2. **What Changes** — 需要改变什么
3. **Requirements** — 系统应满足的要求
4. **Scenarios** — 用户在什么情况下看到什么结果
5. **Tasks** — 实现任务拆解（含状态）
6. **Checklist** — 验收检查项

若实现与预期不一致，先回到 Spec 修正需求，再调整代码（见 `ITERATION-LOG.md`）。
