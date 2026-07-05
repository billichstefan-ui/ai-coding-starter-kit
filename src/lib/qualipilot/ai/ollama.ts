// QualiPilot — OllamaProvider.
// Spricht die native Ollama-API (/api/chat, /api/embeddings, /api/tags).

import {
  type AIProvider,
  type AIProviderRuntimeConfig,
  type AIConnectionTestResult,
  type GenerateChatInput,
  type GenerateChatResult,
  type GenerateEmbeddingInput,
  type GenerateEmbeddingResult,
  type GenerateTextInput,
  type GenerateTextResult,
  AIUnavailableError,
  fetchWithTimeout,
} from './types'

export class OllamaProvider implements AIProvider {
  readonly type = 'ollama' as const
  readonly name: string
  private baseUrl: string
  private model: string
  private embeddingModel?: string
  private temperature: number
  private maxTokens: number

  constructor(config: AIProviderRuntimeConfig) {
    this.name = config.name
    this.baseUrl = (config.baseUrl ?? 'http://localhost:11434').replace(/\/$/, '')
    this.model = config.model ?? 'llama3.1'
    this.embeddingModel = config.embeddingModel || undefined
    this.temperature = config.temperature
    this.maxTokens = config.maxTokens
  }

  async generateChat(input: GenerateChatInput): Promise<GenerateChatResult> {
    let res: Response
    try {
      res = await fetchWithTimeout(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          messages: input.messages,
          stream: false,
          options: {
            temperature: input.temperature ?? this.temperature,
            num_predict: input.maxTokens ?? this.maxTokens,
          },
        }),
      })
    } catch (err) {
      throw new AIUnavailableError(undefined, err)
    }

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      throw new AIUnavailableError(`Ollama returned ${res.status}. ${detail.slice(0, 200)}`)
    }

    const data = await res.json()
    const content = data?.message?.content
    if (!content) {
      throw new AIUnavailableError('Ollama returned an empty response.')
    }

    return {
      message: { role: 'assistant', content },
      model: data?.model ?? this.model,
      usage: {
        inputTokens: data?.prompt_eval_count,
        outputTokens: data?.eval_count,
      },
    }
  }

  async generateText(input: GenerateTextInput): Promise<GenerateTextResult> {
    const messages = [
      ...(input.system ? [{ role: 'system' as const, content: input.system }] : []),
      { role: 'user' as const, content: input.prompt },
    ]
    const result = await this.generateChat({
      messages,
      temperature: input.temperature,
      maxTokens: input.maxTokens,
    })
    return { text: result.message.content, model: result.model, usage: result.usage }
  }

  async generateEmbedding(
    input: GenerateEmbeddingInput
  ): Promise<GenerateEmbeddingResult> {
    if (!this.embeddingModel) {
      throw new AIUnavailableError('No embedding model configured for this provider.')
    }
    const inputs = Array.isArray(input.input) ? input.input : [input.input]
    const embeddings: number[][] = []
    for (const text of inputs) {
      let res: Response
      try {
        res = await fetchWithTimeout(`${this.baseUrl}/api/embeddings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: this.embeddingModel, prompt: text }),
        })
      } catch (err) {
        throw new AIUnavailableError(undefined, err)
      }
      if (!res.ok) {
        throw new AIUnavailableError(`Ollama embedding failed (${res.status}).`)
      }
      const data = await res.json()
      if (data?.embedding) embeddings.push(data.embedding)
    }
    return { embeddings, model: this.embeddingModel }
  }

  async testConnection(): Promise<AIConnectionTestResult> {
    const started = Date.now()
    const checks = {
      reachable: false,
      modelConfigured: Boolean(this.model),
      chatCompletion: false,
      embedding: undefined as boolean | undefined,
    }

    try {
      const res = await fetchWithTimeout(
        `${this.baseUrl}/api/tags`,
        { method: 'GET' },
        8_000
      )
      checks.reachable = res.ok
    } catch {
      return {
        ok: false,
        message: 'Local AI unavailable',
        checks,
        error: 'Ollama nicht erreichbar unter ' + this.baseUrl,
      }
    }

    if (!checks.modelConfigured) {
      return { ok: false, message: 'Kein Modell konfiguriert', checks, latencyMs: Date.now() - started }
    }

    try {
      const result = await this.generateChat({
        messages: [{ role: 'user', content: 'Reply with the single word: OK' }],
        maxTokens: 16,
      })
      checks.chatCompletion = Boolean(result.message.content)
    } catch (err) {
      return {
        ok: false,
        message: 'Chat-Completion fehlgeschlagen',
        checks,
        latencyMs: Date.now() - started,
        error: err instanceof Error ? err.message : String(err),
      }
    }

    if (this.embeddingModel) {
      try {
        const emb = await this.generateEmbedding({ input: 'connection test' })
        checks.embedding = emb.embeddings.length > 0
      } catch {
        checks.embedding = false
      }
    }

    return {
      ok: checks.chatCompletion,
      message: 'Verbindung erfolgreich',
      checks,
      latencyMs: Date.now() - started,
    }
  }
}
