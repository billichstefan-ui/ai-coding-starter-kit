// QualiPilot — OpenAICompatibleProvider.
// Für LM Studio, LocalAI, llama-cpp-python und andere OpenAI-kompatible
// Server. Spricht die /chat/completions- und /embeddings-Endpunkte an.

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

export class OpenAICompatibleProvider implements AIProvider {
  readonly type = 'openai-compatible' as const
  readonly name: string
  private baseUrl: string
  private apiKey: string
  private model: string
  private embeddingModel?: string
  private temperature: number
  private maxTokens: number

  constructor(config: AIProviderRuntimeConfig) {
    this.name = config.name
    // Trailing-Slash normalisieren; erwartet eine …/v1-Basis.
    this.baseUrl = (config.baseUrl ?? 'http://localhost:1234/v1').replace(/\/$/, '')
    this.apiKey = config.apiKey || 'local-not-required'
    this.model = config.model ?? ''
    this.embeddingModel = config.embeddingModel || undefined
    this.temperature = config.temperature
    this.maxTokens = config.maxTokens
  }

  private headers(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    }
  }

  async generateChat(input: GenerateChatInput): Promise<GenerateChatResult> {
    let res: Response
    try {
      res = await fetchWithTimeout(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({
          model: this.model,
          messages: input.messages,
          temperature: input.temperature ?? this.temperature,
          max_tokens: input.maxTokens ?? this.maxTokens,
          stream: false,
        }),
      })
    } catch (err) {
      throw new AIUnavailableError(undefined, err)
    }

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      throw new AIUnavailableError(
        `AI server returned ${res.status}. ${detail.slice(0, 200)}`
      )
    }

    const data = await res.json()
    const message = data?.choices?.[0]?.message
    if (!message?.content) {
      throw new AIUnavailableError('AI server returned an empty response.')
    }

    return {
      message: { role: 'assistant', content: message.content },
      model: data?.model ?? this.model,
      usage: {
        inputTokens: data?.usage?.prompt_tokens,
        outputTokens: data?.usage?.completion_tokens,
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
    let res: Response
    try {
      res = await fetchWithTimeout(`${this.baseUrl}/embeddings`, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({ model: this.embeddingModel, input: input.input }),
      })
    } catch (err) {
      throw new AIUnavailableError(undefined, err)
    }
    if (!res.ok) {
      throw new AIUnavailableError(`Embedding request failed (${res.status}).`)
    }
    const data = await res.json()
    const embeddings = (data?.data ?? []).map((d: { embedding: number[] }) => d.embedding)
    return { embeddings, model: data?.model ?? this.embeddingModel }
  }

  async testConnection(): Promise<AIConnectionTestResult> {
    const started = Date.now()
    const checks = {
      reachable: false,
      modelConfigured: Boolean(this.model),
      chatCompletion: false,
      embedding: undefined as boolean | undefined,
    }

    // 1) Erreichbarkeit: /models auflisten.
    try {
      const res = await fetchWithTimeout(
        `${this.baseUrl}/models`,
        { method: 'GET', headers: this.headers() },
        8_000
      )
      checks.reachable = res.ok
    } catch {
      return {
        ok: false,
        message: 'Local AI unavailable',
        checks,
        error: 'Server nicht erreichbar unter ' + this.baseUrl,
      }
    }

    if (!checks.modelConfigured) {
      return {
        ok: false,
        message: 'Kein Modell konfiguriert',
        checks,
        latencyMs: Date.now() - started,
      }
    }

    // 2) Echte Chat-Completion.
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

    // 3) Optional: Embedding.
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
