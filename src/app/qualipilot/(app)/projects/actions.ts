'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { requireQpContext } from '@/lib/qualipilot/db'
import { logAudit } from '@/lib/qualipilot/audit'

export type ActionResult = { ok: true } | { ok: false; error: string }

// Nimmt string | null | undefined aus dem Formular entgegen und normalisiert
// leere Strings zu null (Output: string | null).
const nullableStr = z
  .union([z.string(), z.null()])
  .optional()
  .transform((v) => {
    const s = typeof v === 'string' ? v.trim() : v
    return s ? s : null
  })

const ProjectSchema = z.object({
  name: z.string().trim().min(2, 'Bitte einen Projektnamen angeben'),
  customer: nullableStr,
  site: nullableStr,
  system_name: nullableStr,
  system_description: nullableStr,
  gmp_relevance: nullableStr,
  gamp_category: nullableStr,
  risk_class: nullableStr,
  status: z
    .enum(['draft', 'in_progress', 'in_review', 'approved', 'archived'])
    .default('draft'),
  start_date: nullableStr,
  target_date: nullableStr,
})

export type ProjectInput = z.input<typeof ProjectSchema>

/**
 * Legt ein neues QualiPilot-Projekt in der Org des eingeloggten Nutzers an.
 * Bei Erfolg → redirect zur Detailseite. Bei Fehler → { ok:false, error }.
 */
export async function createProject(input: ProjectInput): Promise<ActionResult> {
  const parsed = ProjectSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Ungültige Eingabe' }
  }

  const { userId, profile } = await requireQpContext()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('qp_projects')
    .insert({
      organization_id: profile.organization_id,
      ...parsed.data,
      owner_id: userId,
      created_by: userId,
      updated_by: userId,
    })
    .select('id')
    .single()

  if (error || !data) {
    return { ok: false, error: error?.message ?? 'Projekt konnte nicht angelegt werden' }
  }

  await logAudit(supabase, {
    organizationId: profile.organization_id!,
    userId,
    entityType: 'project',
    entityId: data.id,
    eventType: 'project.created',
    newValue: { name: parsed.data.name, status: parsed.data.status },
  })

  revalidatePath('/qualipilot/projects')
  redirect(`/qualipilot/projects/${data.id}`)
}

/**
 * Aktualisiert ein bestehendes Projekt. Revalidiert Liste + Detailseite.
 */
export async function updateProject(id: string, input: ProjectInput): Promise<ActionResult> {
  const parsed = ProjectSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Ungültige Eingabe' }
  }

  const { userId, profile } = await requireQpContext()
  const supabase = await createClient()

  const { error } = await supabase
    .from('qp_projects')
    .update({ ...parsed.data, updated_by: userId })
    .eq('id', id)

  if (error) {
    return { ok: false, error: error.message }
  }

  await logAudit(supabase, {
    organizationId: profile.organization_id!,
    userId,
    entityType: 'project',
    entityId: id,
    eventType: 'project.updated',
    newValue: { name: parsed.data.name, status: parsed.data.status },
  })

  revalidatePath('/qualipilot/projects')
  revalidatePath(`/qualipilot/projects/${id}`)
  return { ok: true }
}
