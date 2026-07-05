// QualiPilot — AI Connection Test.
// Prüft: Server erreichbar · Modell gesetzt · Chat-Completion · optional Embedding.
// Nimmt eine (auch ungespeicherte) Provider-Konfiguration aus dem Settings-Formular
// entgegen, damit der Nutzer VOR dem Speichern testen kann. Nur für Admins.

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase-server'
import { logAudit } from '@/lib/qualipilot/audit'
import { createProvider } from '@/lib/qualipilot/ai/factory'
import type { AIProviderRuntimeConfig } from '@/lib/qualipilot/ai/types'

const BodySchema = z.object({
  type: z.enum(['openai-compatible', 'ollama', 'disabled']),
  name: z.string().optional().default('Test'),
  baseUrl: z.string().optional(),
  apiKey: z.string().optional(),
  model: z.string().optional(),
  embeddingModel: z.string().optional(),
  temperature: z.coerce.number().optional().default(0.2),
  maxTokens: z.coerce.number().optional().default(4000),
})

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('qp_profiles')
    .select('organization_id, role')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile?.organization_id) {
    return NextResponse.json({ error: 'Kein Profil/Organisation' }, { status: 403 })
  }
  if (profile.role !== 'admin') {
    return NextResponse.json({ error: 'Nur Admins dürfen KI-Provider testen' }, { status: 403 })
  }

  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ungültiger Request-Body' }, { status: 400 })
  }

  const parsed = BodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validierung fehlgeschlagen', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const config: AIProviderRuntimeConfig = { ...parsed.data }
  const provider = createProvider(config)
  const result = await provider.testConnection()

  await logAudit(supabase, {
    organizationId: profile.organization_id,
    userId: user.id,
    entityType: 'ai_provider',
    eventType: 'ai.connection_tested',
    newValue: { type: config.type, ok: result.ok, message: result.message },
  })

  return NextResponse.json(result)
}
