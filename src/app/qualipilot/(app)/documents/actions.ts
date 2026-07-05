'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { requireQpContext } from '@/lib/qualipilot/db'
import { logAudit } from '@/lib/qualipilot/audit'
import type { DocumentContent, DocumentRecord } from '@/lib/qualipilot/types'

export type ActionResult = { ok: true } | { ok: false; error: string }

/**
 * GMP-Freigabe eines Dokuments.
 *
 * Reihenfolge ist wichtig: Der UPDATE läuft, WÄHREND der Status noch nicht
 * 'approved' ist — die RLS-Policy (status <> 'approved') erlaubt das. Vor dem
 * Statuswechsel wird der aktuelle Inhalt unveränderlich in
 * qp_document_versions eingefroren (Freigabe-Snapshot). Approved-Dokumente
 * werden danach nie überschrieben, sondern über neue Versionen fortgeführt.
 */
export async function approveDocument(id: string): Promise<ActionResult> {
  const { userId, profile } = await requireQpContext()
  const supabase = await createClient()

  const { data: doc, error: fetchErr } = await supabase
    .from('qp_documents')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (fetchErr) return { ok: false, error: fetchErr.message }
  if (!doc) return { ok: false, error: 'Dokument nicht gefunden' }

  const record = doc as DocumentRecord
  if (record.status === 'approved') {
    return { ok: false, error: 'Dokument ist bereits freigegeben' }
  }

  // Pflichtangaben-Check: ohne Titel, Typ, Projekt und mind. 1 Abschnitt keine Freigabe.
  const content = (record.content ?? {}) as DocumentContent
  const hasSections = Array.isArray(content.sections) && content.sections.length > 0
  if (!record.title || !record.document_type || !record.project_id || !hasSections) {
    return { ok: false, error: 'Pflichtangaben fehlen für die Freigabe' }
  }

  // 1) Freigabe-Snapshot als unveränderliche Version einfrieren.
  const { error: versionErr } = await supabase.from('qp_document_versions').insert({
    document_id: record.id,
    version: record.version,
    content: record.content,
    change_reason: 'Freigabe',
    created_by: userId,
  })
  if (versionErr) return { ok: false, error: versionErr.message }

  // 2) Status auf 'approved' setzen (RLS erlaubt UPDATE, solange noch nicht approved).
  const { error: updateErr } = await supabase
    .from('qp_documents')
    .update({
      status: 'approved',
      approved_at: new Date().toISOString(),
      approver_id: userId,
      review_required: false,
      updated_by: userId,
    })
    .eq('id', record.id)
  if (updateErr) return { ok: false, error: updateErr.message }

  await logAudit(supabase, {
    organizationId: profile.organization_id!,
    userId,
    entityType: 'document',
    entityId: record.id,
    eventType: 'document.version_created',
    newValue: { version: record.version, change_reason: 'Freigabe' },
  })
  await logAudit(supabase, {
    organizationId: profile.organization_id!,
    userId,
    entityType: 'document',
    entityId: record.id,
    eventType: 'document.approved',
    oldValue: { status: record.status },
    newValue: { status: 'approved' },
  })

  revalidatePath('/qualipilot/documents')
  revalidatePath(`/qualipilot/documents/${id}`)
  return { ok: true }
}

/**
 * Statuswechsel: Dokument in Prüfung geben.
 */
export async function markInReview(id: string): Promise<ActionResult> {
  const { userId, profile } = await requireQpContext()
  const supabase = await createClient()

  const { error } = await supabase
    .from('qp_documents')
    .update({ status: 'in_review', updated_by: userId })
    .eq('id', id)
  if (error) return { ok: false, error: error.message }

  await logAudit(supabase, {
    organizationId: profile.organization_id!,
    userId,
    entityType: 'document',
    entityId: id,
    eventType: 'document.updated',
    newValue: { status: 'in_review' },
  })

  revalidatePath('/qualipilot/documents')
  revalidatePath(`/qualipilot/documents/${id}`)
  return { ok: true }
}

/**
 * Statuswechsel: Dokument als geprüft markieren (Reviewer gesetzt).
 */
export async function markReviewed(id: string): Promise<ActionResult> {
  const { userId, profile } = await requireQpContext()
  const supabase = await createClient()

  const { error } = await supabase
    .from('qp_documents')
    .update({
      status: 'reviewed',
      reviewer_id: userId,
      review_required: false,
      updated_by: userId,
    })
    .eq('id', id)
  if (error) return { ok: false, error: error.message }

  await logAudit(supabase, {
    organizationId: profile.organization_id!,
    userId,
    entityType: 'document',
    entityId: id,
    eventType: 'document.updated',
    newValue: { status: 'reviewed' },
  })

  revalidatePath('/qualipilot/documents')
  revalidatePath(`/qualipilot/documents/${id}`)
  return { ok: true }
}
