const DEFAULT_BASE = 'https://api.openai.com/v1'
const DEFAULT_MODEL = 'gpt-4o-mini'

export function isAiConfigured() {
  return Boolean(process.env.AI_API_KEY?.trim())
}

function normalizeBaseUrl(url) {
  let base = url.trim().replace(/\/+$/, '')
  // 用户若误填完整 endpoint，去掉重复的 /chat/completions
  if (base.endsWith('/chat/completions')) {
    base = base.slice(0, -'/chat/completions'.length).replace(/\/+$/, '')
  }
  return base
}

function getConfig() {
  return {
    apiKey: process.env.AI_API_KEY?.trim(),
    baseUrl: normalizeBaseUrl(process.env.AI_API_BASE?.trim() || DEFAULT_BASE),
    model: process.env.AI_MODEL?.trim() || DEFAULT_MODEL,
  }
}

async function chatCompletion(messages, { temperature = 0.7 } = {}) {
  const { apiKey, baseUrl, model } = getConfig()
  if (!apiKey) {
    throw new Error('AI_API_KEY 未配置')
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature,
      messages,
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`AI API 错误 (${response.status}): ${text.slice(0, 300)}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('AI API 返回内容为空')
  }

  return JSON.parse(content)
}

export async function generateSuggestionsFromAi(planSummary) {
  const system = `你是学习计划助手。根据用户的学习计划摘要，生成 2-5 条实用建议。
必须返回 JSON：
{
  "suggestions": [
    { "id": "唯一字符串", "type": "warning"|"info"|"success", "title": "标题", "content": "具体建议内容" }
  ]
}
要求：
- 分析计划数量、本周时长、完成率、单日负载
- 单日超过 5 小时要 warning，并建议将部分任务移到相邻日期
- 完成率低或进度滞后要 info，给出补齐建议
- 根据已完成任务生成「学习复盘」summary
- 完成率高可 success
- 内容用中文，具体可执行，类似「你当前有 N 个计划，本周预计 X 小时，周三负载较高建议…」`

  const user = `学习计划摘要（JSON）：\n${JSON.stringify(planSummary, null, 2)}`

  const result = await chatCompletion([
    { role: 'system', content: system },
    { role: 'user', content: user },
  ])

  if (!Array.isArray(result.suggestions)) {
    throw new Error('AI 返回格式无效：缺少 suggestions 数组')
  }

  return result.suggestions.map((s, i) => ({
    id: String(s.id || `ai-${i}`),
    type: ['warning', 'info', 'success'].includes(s.type) ? s.type : 'info',
    title: String(s.title || '学习建议'),
    content: String(s.content || ''),
  }))
}

export async function refineDailyPlanFromAi(date, dayContext) {
  const system = `你是学习计划细化助手。根据某天的学习任务，生成详细 Markdown 学习计划。
必须返回 JSON：
{
  "markdown": "完整 Markdown 字符串，含 ## 标题、### 学习材料、### 具体练习、### 完成标准",
  "checklist": ["可勾选的完成标准1", "完成标准2"]
}
要求：
- markdown 用中文
- 学习材料要具体（文档/教程名称）
- 练习要可执行
- checklist 从完成标准提炼，3-8 条`

  const user = `日期：${date}\n当天任务（JSON）：\n${JSON.stringify(dayContext, null, 2)}`

  const result = await chatCompletion(
    [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    { temperature: 0.8 },
  )

  if (!result.markdown || !Array.isArray(result.checklist)) {
    throw new Error('AI 返回格式无效：需要 markdown 和 checklist')
  }

  return {
    markdown: String(result.markdown),
    checklist: result.checklist.map((text, i) => ({
      id: `ai-check-${i}-${Date.now()}`,
      text: String(text),
      completed: false,
    })),
  }
}
