// QualiPilot — Audit-Trail-Helfer.
// Schreibt append-only Einträge in qp_audit_trail. Fehler beim Loggen
// dürfen die eigentliche Aktion nicht blockieren (best-effort), werden
// aber serverseitig geloggt.

import 'server-only'
import type { SupabaseClient } from '@supabase/supabase-js'

export type AuditEventType =
  | 'project.created'
  | 'project.updated'
  | 'document.created'
  | 'document.updated'
  | 'document.approved'
  | 'document.version_created'
  | 'ai.draft_generated'
  | 'ai.provider_configured'
  | 'ai.connection_tested'
  | 'risk.created'
  | 'risk.updated'
  | 'traceability.link_created'
  | 'test_case.created'
  | 'test_case.updated'

export interface AuditInput {
  organizationId: string
  userId: string | null
  entityType: string
  entityId?: string | null
  eventType: AuditEventType
  oldValue?: Record<string, unknown> | null
  newValue?: Record<string, unknown> | null
  reason?: string | null
}

export async function logAudit(
  supabase: SupabaseClient,
  input: AuditInput
): Promise<void> {
  const { error } = await supabase.from('qp_audit_trail').insert({
    organization_id: input.organizationId,
    user_id: input.userId,
    entity_type: input.entityType,
    entity_id: input.entityId ?? null,
    event_type: input.eventType,
    old_value: input.oldValue ?? null,
    new_value: input.newValue ?? null,
    reason: input.reason ?? null,
  })

  if (error) {
    // Audit-Log ist wichtig, darf die Nutzeraktion aber nicht scheitern lassen.
    console.error('[qp audit] Eintrag fehlgeschlagen:', error.message, input.eventType)
  }
}
