// QualiPilot — AI Provider Factory.
// Baut einen konkreten Provider aus (a) einer DB-Zeile (qp_ai_providers)
// oder (b) ENV-Fallbacks. Die App bleibt ohne konfigurierten Server nutzbar:
// dann kommt der DisabledProvider zum Einsatz.

import 'server-only'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { AIProviderConfig, ProviderType } from '../types'
import type { AIProvider, AIProviderRuntimeConfig } from './types'
import { OpenAICompatibleProvider } from './openai-compatible'
import { OllamaProvider } from './ollama'
import { DisabledProvider } from './disabled'

export function createProvider(config: AIProviderRuntimeConfig): AIProvider {
  switch (config.type) {
    case 'openai-compatible':
      return new OpenAICompatibleProvider(config)
    case 'ollama':
      return new OllamaProvider(config)
    case 'disabled':
    default:
      return new DisabledProvider()
  }
}

/** Runtime-Config aus einer gespeicherten DB-Zeile. */
export function runtimeConfigFromRow(row: AIProviderConfig): AIProviderRuntimeConfig {
  return {
    type: row.enabled ? row.provider_type : 'disabled',
    name: row.name,
    baseUrl: row.base_url ?? undefined,
    // MVP: api_key_encrypted wird als Klartext behandelt.
    // TODO(security): über Supabase Vault ent-/verschlüsseln.
    apiKey: row.api_key_encrypted ?? undefined,
    model: row.model_name ?? undefined,
    embeddingModel: row.embedding_model_name ?? undefined,
    temperature: row.temperature ?? 0.2,
    maxTokens: row.max_tokens ?? 4000,
  }
}

/** Runtime-Config aus ENV-Variablen (lokale Entwicklung / Fallback). */
export function runtimeConfigFromEnv(): AIProviderRuntimeConfig {
  const type = (process.env.AI_PROVIDER as ProviderType) || 'disabled'
  const temperature = Number(process.env.AI_TEMPERATURE ?? '0.2')
  const maxTokens = Number(process.env.AI_MAX_TOKENS ?? '4000')

  if (type === 'ollama') {
    return {
      type: 'ollama',
      name: 'Ollama (ENV)',
      baseUrl: process.env.OLLAMA_BASE_URL,
      model: process.env.OLLAMA_MODEL,
      embeddingModel: process.env.OLLAMA_EMBEDDING_MODEL,
      temperature,
      maxTokens,
    }
  }

  if (type === 'openai-compatible') {
    return {
      type: 'openai-compatible',
      name: 'OpenAI-kompatibel (ENV)',
      baseUrl: process.env.AI_BASE_URL,
      apiKey: process.env.AI_API_KEY,
      model: process.env.AI_MODEL,
      temperature,
      maxTokens,
    }
  }

  return { type: 'disabled', name: 'Deaktiviert', temperature, maxTokens }
}

/**
 * Ermittelt den aktiven Provider einer Organisation:
 *   1. Default-Provider aus qp_ai_providers (enabled + is_default).
 *   2. sonst ENV-Fallback.
 *   3. sonst DisabledProvider.
 * Wirft NIE — im Zweifel Disabled, damit die App weiterläuft.
 */
export async function resolveProvider(
  supabase: SupabaseClient,
  organizationId: string
): Promise<{ provider: AIProvider; config: AIProviderRuntimeConfig; source: 'db' | 'env' | 'none' }> {
  try {
    const { data } = await supabase
      .from('qp_ai_providers')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('enabled', true)
      .eq('is_default', true)
      .maybeSingle()

    if (data) {
      const config = runtimeConfigFromRow(data as AIProviderConfig)
      return { provider: createProvider(config), config, source: 'db' }
    }
  } catch {
    // RLS/Verbindung — still auf ENV zurückfallen.
  }

  const envConfig = runtimeConfigFromEnv()
  if (envConfig.type !== 'disabled') {
    return { provider: createProvider(envConfig), config: envConfig, source: 'env' }
  }

  return {
    provider: new DisabledProvider(),
    config: { type: 'disabled', name: 'Deaktiviert', temperature: 0.2, maxTokens: 4000 },
    source: 'none',
  }
}
