import { createClient } from '@/lib/supabase-server'

/**
 * Single-tenant constant — the fixed seed org id from supabase/schema.sql
 * (Company OS Phase 0). Every reader/writer of org-scoped tables uses this
 * value so the system stays org_id-ready while remaining single-tenant today.
 */
export const KORDIX_ORG_ID = '00000000-0000-0000-0000-000000000001'

export type KpiMetric = {
  label: string
  value: number | null
  unit?: 'eur' | 'count' | 'pct'
  delta?: number | null
  sparkline?: number[]
  source?: string
  empty: boolean
}

/**
 * Builds the 8-card CEO Home KPI strip in the blueprint's order
 * (MRR, ARR, Cash, Leads, Kunden, Tasks, Visits, Conversion).
 *
 * Phase 1 doctrine (integration note 6 + 9): real numbers come ONLY from the
 * `suggestions` table. Everything that needs a connector we don't have yet
 * (finance, CRM, web analytics) is an honest EMPTY slot (`value: null,
 * empty: true`) — never a fabricated `0`. Swapping a card from
 * "live-from-suggestions" to "live-from-kpi_snapshots" later is a one-line change.
 *
 * Defensive by design: every Supabase call is wrapped so a query failure
 * degrades a single card to an empty slot instead of crashing CEO Home.
 */
export async function getCeoKpis(): Promise<KpiMetric[]> {
  let pendingCount: number | null = null

  try {
    const supabase = await createClient()
    // REAL: open work proxy — pending NORA suggestions (count-only idiom,
    // identical to dashboard/page.tsx).
    const { count, error } = await supabase
      .from('suggestions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    if (!error) pendingCount = count ?? 0
  } catch {
    pendingCount = null
  }

  const suggestionsEmpty = pendingCount === null

  return [
    // ─── EMPTY slots (no connector in Phase 0/1) ───
    {
      label: 'MRR',
      value: null,
      unit: 'eur',
      empty: true,
      source: 'Finance',
    },
    {
      label: 'ARR',
      value: null,
      unit: 'eur',
      empty: true,
      source: 'Finance',
    },
    {
      label: 'Cash',
      value: null,
      unit: 'eur',
      empty: true,
      source: 'Finance',
    },
    // ─── REAL: NORA pending suggestions (the only live source in Phase 0/1) ───
    {
      label: 'NORA-Vorschläge',
      value: suggestionsEmpty ? null : pendingCount,
      unit: 'count',
      empty: suggestionsEmpty,
      source: 'NORA',
    },
    {
      label: 'Kunden',
      value: null,
      unit: 'count',
      empty: true,
      source: 'CRM',
    },
    // ─── EMPTY: no tasks/projects table yet (Phase 2) — honest slot, NOT a
    //     duplicate of the suggestions count (empty-slot doctrine).
    {
      label: 'Offene Tasks',
      value: null,
      unit: 'count',
      empty: true,
      source: 'Projects',
    },
    {
      label: 'Visits',
      value: null,
      unit: 'count',
      empty: true,
      source: 'Analytics',
    },
    {
      label: 'Conversion',
      value: null,
      unit: 'pct',
      empty: true,
      source: 'Analytics',
    },
  ]
}
