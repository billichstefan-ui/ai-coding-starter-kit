'use server'

import { z } from 'zod'
import { createClient, createServiceRoleClient } from '@/lib/supabase-server'

const RegisterSchema = z.object({
  fullName: z.string().min(2, 'Bitte vollständigen Namen angeben'),
  orgName: z.string().min(2, 'Bitte Organisationsname angeben'),
  email: z.string().email('Ungültige E-Mail'),
  password: z.string().min(8, 'Mindestens 8 Zeichen'),
})

export type ActionResult = { ok: true } | { ok: false; error: string }

/**
 * Neuregistrierung: legt Auth-User (ohne E-Mail-Bestätigung), Organisation
 * und Admin-Profil an. Danach meldet sich der Client per Passwort an.
 * Nutzt den Service-Role-Key (RLS-Bypass) — die einzige Stelle, die Org +
 * Profil bootstrappt.
 */
export async function registerAction(
  input: z.infer<typeof RegisterSchema>
): Promise<ActionResult> {
  const parsed = RegisterSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Ungültige Eingabe' }
  }
  const { fullName, orgName, email, password } = parsed.data

  let admin
  try {
    admin = createServiceRoleClient()
  } catch {
    return {
      ok: false,
      error:
        'Serverkonfiguration fehlt (SUPABASE_SERVICE_ROLE_KEY). Registrierung nicht möglich.',
    }
  }

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  })
  if (createErr || !created.user) {
    return { ok: false, error: createErr?.message ?? 'Nutzer konnte nicht angelegt werden' }
  }

  const userId = created.user.id

  const { data: org, error: orgErr } = await admin
    .from('qp_organizations')
    .insert({ name: orgName })
    .select('id')
    .single()
  if (orgErr || !org) {
    return { ok: false, error: orgErr?.message ?? 'Organisation konnte nicht angelegt werden' }
  }

  const { error: profileErr } = await admin.from('qp_profiles').insert({
    id: userId,
    organization_id: org.id,
    full_name: fullName,
    role: 'admin',
  })
  if (profileErr) {
    return { ok: false, error: profileErr.message }
  }

  return { ok: true }
}

const OnboardSchema = z.object({
  fullName: z.string().min(2),
  orgName: z.string().min(2),
})

/**
 * Onboarding für einen bereits eingeloggten Nutzer ohne QualiPilot-Profil
 * (z. B. Company-OS-Nutzer). Legt Org + Admin-Profil für den aktuellen User an.
 */
export async function onboardAction(
  input: z.infer<typeof OnboardSchema>
): Promise<ActionResult> {
  const parsed = OnboardSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Ungültige Eingabe' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Keine aktive Sitzung' }

  let admin
  try {
    admin = createServiceRoleClient()
  } catch {
    return { ok: false, error: 'Serverkonfiguration fehlt (SUPABASE_SERVICE_ROLE_KEY).' }
  }

  const { data: org, error: orgErr } = await admin
    .from('qp_organizations')
    .insert({ name: parsed.data.orgName })
    .select('id')
    .single()
  if (orgErr || !org) {
    return { ok: false, error: orgErr?.message ?? 'Organisation konnte nicht angelegt werden' }
  }

  const { error: profileErr } = await admin.from('qp_profiles').upsert({
    id: user.id,
    organization_id: org.id,
    full_name: parsed.data.fullName,
    role: 'admin',
  })
  if (profileErr) return { ok: false, error: profileErr.message }

  return { ok: true }
}
