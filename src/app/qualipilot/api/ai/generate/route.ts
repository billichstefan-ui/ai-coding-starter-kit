// QualiPilot — AI Draft Generator (Backend).
// Erzeugt einen strukturierten GMP-Dokumententwurf mit dem aktiven lokalen
// KI-Provider der Organisation. Jede Ausgabe:
//   * wird in qp_ai_generations protokolliert (review_required = true),
//   * optional als qp_documents-Entwurf gespeichert (status 'ai_generated',
//     ai_generated = true, review_required = true).
// Ohne erreichbaren KI-Server → 503 mit klarer Meldung (App bleibt nutzbar).

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase-server'
import { logAudit } from '@/lib/qualipilot/audit'
import { resolveProvider } from '@/lib/qualipilot/ai/factory'
import { buildDraftPrompt, parseDraftOutput } from '@/lib/qualipilot/ai/prompts'
import { AIUnavailableError } from '@/lib/qualipilot/ai/types'

const BodySchema = z.object({
  documentType: z.string().min(1),
  language: z.enum(['de', 'en']).default('de'),
  projectId: z.string().uuid().optional().nullable(),
  projectName: z.string().optional(),
  systemDescription: z.string().optional(),
  processDescription: z.string().optional(),
  gmpCriticality: z.string().optional(),
  gampCategory: z.string().optional(),
  chapters: z.string().optional(),
  additionalInfo: z.string().optional(),
  saveAsDocument: z.boolean().optional().default(true),
  documentTitle: z.string().optional(),
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
    .select('organization_id')
    .eq('id', user.id)
    .maybeSingle()
  if (!profile?.organization_id) {
    return NextResponse.json({ error: 'Kein Profil/Organisation' }, { status: 403 })
  }
  const orgId = profile.organization_id

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
  const body = parsed.data

  const { provider, config, source } = await resolveProvider(supabase, orgId)
  if (config.type === 'disabled' || source === 'none') {
    return NextResponse.json(
      { error: 'Local AI unavailable', detail: 'Kein aktiver KI-Provider konfiguriert.' },
      { status: 503 }
    )
  }

  const { system, prompt } = buildDraftPrompt(body)

  let text: string
  let usage: { inputTokens?: number; outputTokens?: number } | undefined
  let modelName = config.model ?? ''
  try {
    const result = await provider.generateText({ system, prompt })
    text = result.text
    usage = result.usage
    modelName = result.model || modelName
  } catch (err) {
    const failMsg =
      err instanceof AIUnavailableError
        ? err.message
        : 'KI-Generierung fehlgeschlagen.'
    // Fehlversuch protokollieren (auditnah), dann 503.
    await supabase.from('qp_ai_generations').insert({
      organization_id: orgId,
      project_id: body.projectId ?? null,
      user_id: user.id,
      model_name: modelName,
      provider_type: config.type,
      prompt_type: body.documentType,
      prompt_input: body,
      generated_output: {},
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      status: 'failed',
      review_required: true,
    })
    return NextResponse.json({ error: 'Local AI unavailable', detail: failMsg }, { status: 503 })
  }

  const content = parseDraftOutput(text)

  // Optional als Dokument-Entwurf speichern.
  let documentId: string | null = null
  if (body.saveAsDocument) {
    const title =
      body.documentTitle?.trim() ||
      `${body.documentType} — KI-Entwurf${body.projectName ? ` (${body.projectName})` : ''}`
    const { data: doc, error: docErr } = await supabase
      .from('qp_documents')
      .insert({
        organization_id: orgId,
        project_id: body.projectId ?? null,
        document_type: body.documentType,
        title,
        version: 1,
        status: 'ai_generated',
        content,
        ai_generated: true,
        review_required: true,
        author_id: user.id,
        created_by: user.id,
        updated_by: user.id,
      })
      .select('id')
      .single()
    if (docErr) {
      console.error('[qp generate] Dokument speichern fehlgeschlagen:', docErr.message)
    } else {
      documentId = doc.id
      await logAudit(supabase, {
        organizationId: orgId,
        userId: user.id,
        entityType: 'document',
        entityId: documentId,
        eventType: 'document.created',
        newValue: { title, document_type: body.documentType, ai_generated: true },
        reason: 'AI Draft Generator',
      })
    }
  }

  const { data: gen } = await supabase
    .from('qp_ai_generations')
    .insert({
      organization_id: orgId,
      project_id: body.projectId ?? null,
      document_id: documentId,
      user_id: user.id,
      model_name: modelName,
      provider_type: config.type,
      prompt_type: body.documentType,
      prompt_input: body,
      generated_output: { ...content, usage },
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      status: 'completed',
      review_required: true,
    })
    .select('id')
    .single()

  await logAudit(supabase, {
    organizationId: orgId,
    userId: user.id,
    entityType: 'ai_generation',
    entityId: gen?.id ?? null,
    eventType: 'ai.draft_generated',
    newValue: { document_type: body.documentType, model: modelName, document_id: documentId },
  })

  return NextResponse.json({
    ok: true,
    documentId,
    generationId: gen?.id ?? null,
    content,
    model: modelName,
    reviewRequired: true,
  })
}
