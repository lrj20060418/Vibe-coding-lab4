# 学习计划工作台

Lab 4 实验项目 — 支持创建多个学习计划、统一日历查看、每日任务详情与完成状态管理。

## 技术栈

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- React Router
- Express 后端（AI API 代理）
- localStorage 持久化

## 快速开始

```bash
# 安装依赖
npm install --registry https://registry.npmmirror.com

# 配置 AI API（复制示例并填入 Key）
cp .env.example .env
# 编辑 .env，设置 AI_API_KEY

# 同时启动后端 + 前端（AI 功能必需）
npm run dev:all

# 仅前端（AI 将降级为本地规则）
npm run dev

# 构建生产版本
npm run build

# 运行自动化测试
npm test
```

浏览器访问 `http://localhost:5173/`。

## AI API 配置

| 变量 | 说明 |
|------|------|
| `AI_API_KEY` | 必填，OpenAI 兼容 API Key |
| `AI_API_BASE` | 可选，默认 `https://api.openai.com/v1` |
| `AI_MODEL` | 可选，默认 `gpt-4o-mini` |
| `PORT` | 后端端口，默认 `3001` |

**DeepSeek 示例：**

```env
AI_API_KEY=sk-xxx
AI_API_BASE=https://api.deepseek.com/v1
AI_MODEL=deepseek-chat
```

API 调用链路：

```
前端 → /api/ai/suggestions 或 /api/ai/refine-daily
     → Vite 代理 → Express 后端 (server/)
     → OpenAI 兼容 API（Key 仅在 .env）
```

未配置 Key 或 API 失败时，自动降级为本地规则引擎。

## 功能说明

| 功能 | 说明 |
|------|------|
| 创建计划 | 填写主题、日期、天数、每日时长，自动生成结构化逐日任务 |
| 历史计划 | 查看摘要、跳转首日详情、导出 Markdown、删除计划 |
| 统一日历 | 所有计划按日期聚合，显示合计时长与任务数 |
| 每日预览 | 点击日历日期，弹窗快速查看当天任务 |
| 每日详情 | `/day/2026-06-02` 以日期为中心展示全部计划任务 |
| 完成状态 | checkbox 勾选持久化，刷新后保留 |
| 进度概览 | 计划数、学习天数、总时长、任务完成率 |
| 导出 | 单个计划导出为 Markdown（含完成情况） |
| AI 建议 | 大模型分析负载与进度（可降级本地规则） |
| 每日细化 | 大模型生成 Markdown 计划与可勾选完成标准 |
| 自动化测试 | Vitest 单元测试，`npm test` |

## 项目结构

```
src/
  types/          # 数据类型定义
  storage/        # localStorage 读写
  services/       # AI API 调用（含降级）
  utils/          # 日期、计划生成、日历聚合、进度、导出
  hooks/          # usePlans
  components/     # UI 组件
  pages/          # HomePage, DayDetailPage
server/           # Express AI 代理后端
docs/
  trae-spec/      # Trae /spec 设计文档（Spec 1–4 + 迭代日志）
  trae-chat/      # 协作对话导出
```

## Spec 文档

见 [`docs/trae-spec/`](docs/trae-spec/) 目录，包含需求、Scenario、Tasks、Checklist 与迭代记录。

## 提交说明

打包提交时请包含：项目代码、Spec 文档、Trae 协作记录、`git log --oneline`、实验总结（见 `docs/LAB_SUMMARY.md`）。
