// QualiPilot — AI Provider Layer: gemeinsame Typen.
// Ziel: die Anwendung ist NICHT an einen Anbieter gebunden. Lokale KI
// (LM Studio, LocalAI, Ollama) wird über ein einheitliches Interface
// angebunden; ohne erreichbaren Server bleibt die App voll nutzbar.

import type { ProviderType } from '../types'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface GenerateTextInput {
  prompt: string
  system?: string
  temperature?: number
  maxTokens?: number
}

export interface GenerateTextResult {
  text: string
  model: string
  usage?: { inputTokens?: number; outputTokens?: number }
}

export interface GenerateChatInput {
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
}

export interface GenerateChatResult {
  message: ChatMessage
  model: string
  usage?: { inputTokens?: number; outputTokens?: number }
}

export interface GenerateEmbeddingInput {
  input: string | string[]
}

export interface GenerateEmbeddingResult {
  embeddings: number[][]
  model: string
}

export interface AIConnectionTestResult {
  ok: boolean
  /** Kurzstatus für die UI. */
  message: string
  /** Detail-Checks für die Settings-Seite. */
  checks: {
    reachable: boolean
    modelConfigured: boolean
    chatCompletion: boolean
    embedding?: boolean
  }
  latencyMs?: number
  error?: string
}

/**
 * Laufzeit-Konfiguration eines Providers — abstrahiert von der DB-Zeile
 * (qp_ai_providers) und von ENV-Fallbacks.
 */
export interface AIProviderRuntimeConfig {
  type: ProviderType
  name: string
  baseUrl?: string
  apiKey?: string
  model?: string
  embeddingModel?: string
  temperature: number
  maxTokens: number
}

export interface AIProvider {
  name: string
  type: ProviderType
  generateText(input: GenerateTextInput): Promise<GenerateTextResult>
  generateChat(input: GenerateChatInput): Promise<GenerateChatResult>
  generateEmbedding?(input: GenerateEmbeddingInput): Promise<GenerateEmbeddingResult>
  testConnection(): Promise<AIConnectionTestResult>
}

/** Einheitliche Fehlermeldung, wenn kein lokaler KI-Server erreichbar ist. */
export const AI_UNAVAILABLE_MESSAGE =
  'Local AI server not reachable. Please check your AI provider settings.'

export class AIUnavailableError extends Error {
  constructor(message = AI_UNAVAILABLE_MESSAGE, public cause?: unknown) {
    super(message)
    this.name = 'AIUnavailableError'
  }
}

/** fetch mit Timeout, damit ein toter Server die App nicht hängen lässt. */
export async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = 30_000
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}
