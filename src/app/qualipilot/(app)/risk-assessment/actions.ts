'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { requireQpContext } from '@/lib/qualipilot/db'
import { logAudit } from '@/lib/qualipilot/audit'
import { computeRpn, riskClassForRpn, requiresRecommendedAction } from '@/lib/qualipilot/fmea'

export type ActionResult = { ok: true } | { ok: false; error: string }

const emptyToNull = (v: unknown) => (typeof v === 'string' && v.trim() === '' ? null : v)

const sod = z.coerce
  .number()
  .int('Bitte eine ganze Zahl zwischen 1 und 10')
  .min(1, 'Wert muss zwischen 1 und 10 liegen')
  .max(10, 'Wert muss zwischen 1 und 10 liegen')

const RiskSchema = z.object({
  project_id: z.preprocess(emptyToNull, z.string().uuid().nullable()).default(null),
  process_step: z.preprocess(emptyToNull, z.string().trim().nullable()).default(null),
  function: z.preprocess(emptyToNull, z.string().trim().nullable()).default(null),
  failure_mode: z.string().trim().min(2, 'Bitte einen Fehlermodus angeben'),
  failure_effect: z.preprocess(emptyToNull, z.string().trim().nullable()).default(null),
  failure_cause: z.preprocess(emptyToNull, z.string().trim().nullable()).default(null),
  existing_control: z.preprocess(emptyToNull, z.string().trim().nullable()).default(null),
  severity: sod,
  occurrence: sod,
  detection: sod,
  recommended_action: z.preprocess(emptyToNull, z.string().trim().nullable()).default(null),
  status: z.enum(['open', 'in_progress', 'mitigated', 'closed']).default('open'),
})

export type RiskInput = z.input<typeof RiskSchema>

/**
 * Legt ein neues FMEA-Risiko an. RPN + Risikoklasse werden serverseitig
 * autoritativ über die fmea-Helfer berechnet (Client-Werte sind nur Preview).
 * Critical/High ohne empfohlene Maßnahme werden abgelehnt.
 */
export async function createRisk(input: RiskInput): Promise<ActionResult> {
  const parsed = RiskSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Ungültige Eingabe' }
  }

  const { severity, occurrence, detection, recommended_action } = parsed.data
  const rpn = computeRpn(severity, occurrence, detection)
  const risk_class = riskClassForRpn(rpn)

  if (requiresRecommendedAction(risk_class) && !recommended_action) {
    return {
      ok: false,
      error: 'Kritische Risiken (High/Critical) benötigen eine empfohlene Maßnahme.',
    }
  }

  const { userId, profile } = await requireQpContext()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('qp_risks')
    .insert({
      organization_id: profile.organization_id,
      ...parsed.data,
      rpn,
      risk_class,
    })
    .select('id')
    .single()

  if (error || !data) {
    return { ok: false, error: error?.message ?? 'Risiko konnte nicht angelegt werden' }
  }

  await logAudit(supabase, {
    organizationId: profile.organization_id!,
    userId,
    entityType: 'risk',
    entityId: data.id,
    eventType: 'risk.created',
    newValue: { failure_mode: parsed.data.failure_mode, rpn, risk_class },
  })

  revalidatePath('/qualipilot/risk-assessment')
  return { ok: true }
}
