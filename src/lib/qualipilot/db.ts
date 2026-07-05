// QualiPilot — serverseitige Supabase-Helfer (Auth-Kontext + Org-Scoping).
//
// Wiederverwendet die vorhandenen Company-OS-Clients (createClient /
// createServiceRoleClient). QualiPilot-Tabellen sind `qp_`-geprefixt und
// liegen im public-Schema, daher genügt `.from('qp_...')`.

import 'server-only'
import { redirect } from 'next/navigation'
import { createClient, createServiceRoleClient } from '@/lib/supabase-server'
import { QP_BASE } from './constants'
import type { Profile } from './types'

export { createClient, createServiceRoleClient }

export interface QpContext {
  userId: string
  profile: Profile
}

/**
 * Lädt den eingeloggten Nutzer + sein QualiPilot-Profil.
 * Ohne Session → redirect zum QualiPilot-Login.
 * Mit Session aber ohne Profil (z. B. Company-OS-Nutzer ohne QP-Onboarding)
 * → redirect zur Registrierung, die Org + Profil anlegt.
 */
export async function requireQpContext(): Promise<QpContext> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`${QP_BASE}/login`)

  const { data: profile } = await supabase
    .from('qp_profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile || !profile.organization_id) {
    redirect(`${QP_BASE}/register?onboarding=1`)
  }

  return { userId: user.id, profile: profile as Profile }
}

/**
 * Nicht-werfende Variante für Stellen, die selbst entscheiden wollen
 * (z. B. Layout-Guard). Gibt null zurück statt zu redirecten.
 */
export async function getQpContext(): Promise<QpContext | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('qp_profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile || !profile.organization_id) return null
  return { userId: user.id, profile: profile as Profile }
}
