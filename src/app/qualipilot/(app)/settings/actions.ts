'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { requireQpContext } from '@/lib/qualipilot/db'
import { logAudit } from '@/lib/qualipilot/audit'

export type ActionResult = { ok: true } | { ok: false; error: string }

const emptyToNull = (v: unknown) => (typeof v === 'string' && v.trim() === '' ? null : v)

const ProviderSchema = z.object({
  id: z.preprocess(emptyToNull, z.string().uuid().nullable()).default(null),
  name: z.string().trim().min(2, 'Bitte einen Namen angeben'),
  provider_type: z.enum(['openai-compatible', 'ollama', 'disabled']),
  base_url: z.preprocess(emptyToNull, z.string().trim().nullable()).default(null),
  api_key: z.preprocess(emptyToNull, z.string().trim().nullable()).default(null),
  model_name: z.preprocess(emptyToNull, z.string().trim().nullable()).default(null),
  embedding_model_name: z.preprocess(emptyToNull, z.string().trim().nullable()).default(null),
  temperature: z.coerce.number().min(0).max(2).default(0.2),
  max_tokens: z.coerce.number().int().min(1).max(128000).default(4000),
  enabled: z.coerce.boolean().default(true),
  is_default: z.coerce.boolean().default(false),
})

export type ProviderInput = z.input<typeof ProviderSchema>

/**
 * Legt einen KI-Provider an oder aktualisiert ihn (admin-only).
 * Wird ein Provider zum Default gemacht, wird der bisherige Default der Org
 * zurückgesetzt (unique partial index erlaubt nur einen Default je Org).
 */
export async function saveProvider(input: ProviderInput): Promise<ActionResult> {
  const parsed = ProviderSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Ungültige Eingabe' }
  }

  const { userId, profile } = await requireQpContext()
  if (profile.role !== 'admin') {
    return { ok: false, error: 'Nur Admins können KI-Provider verwalten.' }
  }
  const orgId = profile.organization_id!
  const supabase = await createClient()

  const data = parsed.data

  // Nur EIN Default je Org: vorhandene Defaults zurücksetzen.
  if (data.is_default) {
    const reset = supabase
      .from('qp_ai_providers')
      .update({ is_default: false })
      .eq('organization_id', orgId)
      .eq('is_default', true)
    if (data.id) reset.neq('id', data.id)
    const { error: resetErr } = await reset
    if (resetErr) return { ok: false, error: resetErr.message }
  }

  // TODO(security): api_key via Supabase Vault verschlüsseln statt Klartext.
  const row = {
    organization_id: orgId,
    name: data.name,
    provider_type: data.provider_type,
    base_url: data.base_url,
    model_name: data.model_name,
    embedding_model_name: data.embedding_model_name,
    api_key_encrypted: data.api_key,
    temperature: data.temperature,
    max_tokens: data.max_tokens,
    enabled: data.enabled,
    is_default: data.is_default,
    supports_embeddings: Boolean(data.embedding_model_name),
  }

  let providerId = data.id
  if (data.id) {
    const { error } = await supabase
      .from('qp_ai_providers')
      .update(row)
      .eq('id', data.id)
      .eq('organization_id', orgId)
    if (error) return { ok: false, error: error.message }
  } else {
    const { data: inserted, error } = await supabase
      .from('qp_ai_providers')
      .insert(row)
      .select('id')
      .single()
    if (error || !inserted) {
      return { ok: false, error: error?.message ?? 'Provider konnte nicht gespeichert werden' }
    }
    providerId = inserted.id
  }

  await logAudit(supabase, {
    organizationId: orgId,
    userId,
    entityType: 'ai_provider',
    entityId: providerId,
    eventType: 'ai.provider_configured',
    newValue: {
      name: data.name,
      provider_type: data.provider_type,
      enabled: data.enabled,
      is_default: data.is_default,
    },
  })

  revalidatePath('/qualipilot/settings/ai-providers')
  return { ok: true }
}

const OrgSchema = z.string().trim().min(2, 'Bitte einen Namen angeben')

/**
 * Benennt die Organisation um (admin-only).
 */
export async function saveOrganization(name: string): Promise<ActionResult> {
  const parsed = OrgSchema.safeParse(name)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Ungültige Eingabe' }
  }

  const { profile } = await requireQpContext()
  if (profile.role !== 'admin') {
    return { ok: false, error: 'Nur Admins können die Organisation bearbeiten.' }
  }
  const supabase = await createClient()

  const { error } = await supabase
    .from('qp_organizations')
    .update({ name: parsed.data })
    .eq('id', profile.organization_id!)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/qualipilot/settings/organization')
  return { ok: true }
}
