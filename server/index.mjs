import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import {
  generateSuggestionsFromAi,
  isAiConfigured,
  refineDailyPlanFromAi,
} from './ai.mjs'

const app = express()
const PORT = Number(process.env.PORT) || 3001

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, aiConfigured: isAiConfigured() })
})

app.get('/api/ai/status', (_req, res) => {
  res.json({
    configured: isAiConfigured(),
    model: process.env.AI_MODEL || 'gpt-4o-mini',
    baseUrl: process.env.AI_API_BASE || 'https://api.openai.com/v1',
  })
})

app.post('/api/ai/suggestions', async (req, res) => {
  try {
    if (!isAiConfigured()) {
      return res.status(503).json({ error: 'AI_API_KEY 未配置，请在 .env 中设置' })
    }
    const { planSummary } = req.body
    if (!planSummary) {
      return res.status(400).json({ error: '缺少 planSummary' })
    }
    const suggestions = await generateSuggestionsFromAi(planSummary)
    res.json({ suggestions, source: 'ai' })
  } catch (err) {
    console.error('[AI suggestions]', err)
    res.status(500).json({ error: err instanceof Error ? err.message : '生成失败' })
  }
})

app.post('/api/ai/refine-daily', async (req, res) => {
  try {
    if (!isAiConfigured()) {
      return res.status(503).json({ error: 'AI_API_KEY 未配置，请在 .env 中设置' })
    }
    const { date, dayContext } = req.body
    if (!date || !dayContext) {
      return res.status(400).json({ error: '缺少 date 或 dayContext' })
    }
    const result = await refineDailyPlanFromAi(date, dayContext)
    res.json({
      refinement: {
        date,
        markdown: result.markdown,
        checklist: result.checklist,
        generatedAt: new Date().toISOString(),
        source: 'ai',
      },
    })
  } catch (err) {
    console.error('[AI refine-daily]', err)
    res.status(500).json({ error: err instanceof Error ? err.message : '生成失败' })
  }
})

app.listen(PORT, () => {
  console.log(`API server http://localhost:${PORT}`)
  console.log(`AI configured: ${isAiConfigured()}`)
})
