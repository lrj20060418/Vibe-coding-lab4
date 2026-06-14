# 提交清单

打包为 `姓名_学号_lab4.zip`，包含以下内容：

## 1. 项目代码
- [x] 完整前端代码
- [x] README.md（运行说明）
- [x] `.env.example`（AI API 配置说明）
- 实际 `.env` 含 API Key，**不要提交 git**

## 2. Spec 设计记录
- [x] `docs/specs/01-plan-create-save.md`
- [x] `docs/specs/02-unified-calendar.md`
- [x] `docs/specs/03-day-detail-completion.md`
- [x] `docs/specs/04-ai-extensions.md`（拓展）
- [x] **`docs/trae-spec/`** — Trae /spec 风格完整导出（含迭代日志）
  - `SPEC-01-plan-create-save.md`
  - `SPEC-02-unified-calendar.md`
  - `SPEC-03-day-detail-completion.md`
  - `ITERATION-LOG.md`（修正前后对照）

## 3. Trae 协作记录
- [x] `docs/trae-chat/COLLABORATION-LOG.md` — 分阶段协作摘要
- [x] `docs/trae-chat/CURSOR-CHAT-EXPORT.md` — 完整对话导出（27 轮）
- [x] `docs/trae-chat/cursor-chat-source.jsonl` — 原始会话记录

## 4. 版本管理记录
- [x] `docs/git-log.txt`

## 5. 实验总结
- [x] `docs/LAB_SUMMARY.md`

## 运行方式

```bash
npm install --registry https://registry.npmmirror.com
cp .env.example .env   # 填入 AI_API_KEY
npm run dev:all        # 同时启动后端 + 前端
```

访问 http://localhost:5173/
