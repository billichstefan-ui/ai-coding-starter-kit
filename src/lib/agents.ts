import { createClient } from '@/lib/supabase-server'

/**
 * AI Agents Control Center (Company OS Phase 2).
 *
 * Liest die Agenten-Registry (`agents`) plus die Lauf-Telemetrie (`agent_runs`).
 * NORAs Lauf-Historie wird zusätzlich aus `daily_reports` ergänzt — aber nur für
 * Tage OHNE echten `agent_run` (Dedup), damit nichts doppelt zählt. Für diese
 * historischen Läufe sind Tokens/Kosten unbekannt → die UI zeigt ehrlich „—"
 * (Empty-Slot-Doktrin), statt erfundene Zahlen zu zeigen.
 *
 * Defensiv: schlägt die Registry-Query fehl, wird ein leeres Center
 * zurückgegeben (→ EmptySlot auf der Seite). Läufe/Reports degradieren einzeln
 * zu leeren Listen. Wirft nie.
 */

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export type AgentStatus = 'live' | 'slot' | 'disabled'

export type AgentCardData = {
  key: string
  label: string
  model: string
  status: AgentStatus
  schedule: string | null
  description: string | null
  /** Läufe der letzten 7 Tage aus echter Telemetrie; null = noch keine Telemetrie. */
  runs7d: number | null
  /** USD-Kosten der letzten 7 Tage aus echter Telemetrie; null = noch keine Telemetrie. */
  costUsd7d: number | null
  lastRunAt: string | null
  lastRunStatus: string | null
}

export type RunEntry = {
  id: string
  agentKey: string
  agentLabel: string
  startedAt: string
  status: string
  trigger: string | null
  /** null = vor Einführung der Telemetrie (aus daily_reports abgeleitet). */
  inputTokens: number | null
  outputTokens: number | null
  costUsd: number | null
  summary: string | null
}

export type AgentControlCenter = {
  agents: AgentCardData[]
  runs: RunEntry[]
  totals7d: {
    runs: number
    costUsd: number
    inputTokens: number
    outputTokens: number
  } | null
}

type AgentRow = {
  key: string
  label: string
  model: string
  status: string
  schedule: string | null
  description: string | null
  sort_order: number
}

type AgentRunRow = {
  id: string
  agent_key: string
  started_at: string
  status: string
  trigger: string | null
  input_tokens: number | null
  output_tokens: number | null
  cost_usd: number | string | null
  summary: string | null
}

type DailyReportRow = {
  report_date: string
  suggestions_count: number
  generation_status: string
  created_at: string
}

const EMPTY: AgentControlCenter = { agents: [], runs: [], totals7d: null }

const REPORT_STATUS_MAP: Record<string, string> = {
  sent: 'succeeded',
  failed: 'failed',
  pending: 'running',
}

function toNumber(v: number | string | null): number {
  return v == null ? 0 : Number(v)
}

export async function getAgentControlCenter(): Promise<AgentControlCenter> {
  let supabase: Awaited<ReturnType<typeof createClient>>
  try {
    supabase = await createClient()
  } catch {
    return EMPTY
  }

  // Registry zuerst — ohne sie gibt es nichts zu zeigen.
  const { data: agentData, error: agentError } = await supabase
    .from('agents')
    .select('key, label, model, status, schedule, description, sort_order')
    .order('sort_order', { ascending: true })
    .limit(50)

  if (agentError || !agentData || agentData.length === 0) return EMPTY
  const agentRows = agentData as AgentRow[]
  const labelByKey = new Map(agentRows.map((a) => [a.key, a.label]))

  // Läufe + historische Reports defensiv laden.
  let runRows: AgentRunRow[] = []
  let reportRows: DailyReportRow[] = []
  try {
    const [runRes, reportRes] = await Promise.all([
      supabase
        .from('agent_runs')
        .select(
          'id, agent_key, started_at, status, trigger, input_tokens, output_tokens, cost_usd, summary'
        )
        .order('started_at', { ascending: false })
        .limit(50),
      supabase
        .from('daily_reports')
        .select('report_date, suggestions_count, generation_status, created_at')
        .order('report_date', { ascending: false })
        .limit(30),
    ])
    runRows = (runRes.data ?? []) as AgentRunRow[]
    reportRows = (reportRes.data ?? []) as DailyReportRow[]
  } catch {
    // Läufe/Reports bleiben leer — die Registry rendert trotzdem.
  }

  // Echte Telemetrie → RunEntry
  const telemetryEntries: RunEntry[] = runRows.map((r) => ({
    id: r.id,
    agentKey: r.agent_key,
    agentLabel: labelByKey.get(r.agent_key) ?? r.agent_key,
    startedAt: r.started_at,
    status: r.status,
    trigger: r.trigger,
    inputTokens: r.input_tokens ?? null,
    outputTokens: r.output_tokens ?? null,
    costUsd: r.cost_usd == null ? null : Number(r.cost_usd),
    summary: r.summary,
  }))

  // NORA-Historie aus daily_reports — nur Tage OHNE echten agent_run (Dedup).
  const noraRunDates = new Set(
    telemetryEntries
      .filter((e) => e.agentKey === 'nora')
      .map((e) => e.startedAt.slice(0, 10))
  )
  const noraLabel = labelByKey.get('nora') ?? 'NORA'
  const syntheticEntries: RunEntry[] = reportRows
    .filter((r) => !noraRunDates.has(r.report_date))
    .map((r) => ({
      id: `report-${r.report_date}`,
      agentKey: 'nora',
      agentLabel: noraLabel,
      startedAt: r.created_at,
      status: REPORT_STATUS_MAP[r.generation_status] ?? r.generation_status,
      trigger: null,
      inputTokens: null,
      outputTokens: null,
      costUsd: null,
      summary: `${r.suggestions_count} ${
        r.suggestions_count === 1 ? 'Vorschlag' : 'Vorschläge'
      }`,
    }))

  const runs = [...telemetryEntries, ...syntheticEntries]
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, 20)

  // 7-Tage-Fenster NUR über echte Telemetrie (Karten-Stats + Summen).
  const since = Date.now() - SEVEN_DAYS_MS
  const telemetryByAgent = new Map<string, AgentRunRow[]>()
  for (const r of runRows) {
    const list = telemetryByAgent.get(r.agent_key) ?? []
    list.push(r)
    telemetryByAgent.set(r.agent_key, list)
  }

  const lastRunByAgent = new Map<string, RunEntry>()
  for (const e of runs) {
    if (!lastRunByAgent.has(e.agentKey)) lastRunByAgent.set(e.agentKey, e)
  }

  const agents: AgentCardData[] = agentRows.map((a) => {
    const telemetry = telemetryByAgent.get(a.key) ?? []
    const hasTelemetry = telemetry.length > 0
    const within7d = telemetry.filter((r) => new Date(r.started_at).getTime() >= since)
    const last = lastRunByAgent.get(a.key) ?? null
    const status: AgentStatus = (['live', 'slot', 'disabled'] as const).includes(
      a.status as AgentStatus
    )
      ? (a.status as AgentStatus)
      : 'slot'
    return {
      key: a.key,
      label: a.label,
      model: a.model,
      status,
      schedule: a.schedule,
      description: a.description,
      runs7d: hasTelemetry ? within7d.length : null,
      costUsd7d: hasTelemetry
        ? within7d.reduce((sum, r) => sum + toNumber(r.cost_usd), 0)
        : null,
      lastRunAt: last?.startedAt ?? null,
      lastRunStatus: last?.status ?? null,
    }
  })

  // Summen nur bei echter Telemetrie im 7-Tage-Fenster (sonst null → EmptySlot).
  const within7dAll = runRows.filter((r) => new Date(r.started_at).getTime() >= since)
  const totals7d =
    within7dAll.length === 0
      ? null
      : {
          runs: within7dAll.length,
          costUsd: within7dAll.reduce((s, r) => s + toNumber(r.cost_usd), 0),
          inputTokens: within7dAll.reduce((s, r) => s + (r.input_tokens ?? 0), 0),
          outputTokens: within7dAll.reduce((s, r) => s + (r.output_tokens ?? 0), 0),
        }

  return { agents, runs, totals7d }
}
