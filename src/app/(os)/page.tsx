import { createClient } from '@/lib/supabase-server'
import { getCeoKpis } from '@/lib/metrics'
import { getDailyBriefing } from '@/lib/briefing'
import type { Suggestion } from '@/app/dashboard/suggestion-card'
import { KpiCard } from '@/components/os/KpiCard'
import { BriefingCard } from '@/components/os/BriefingCard'
import { ProjectHeatmap } from '@/components/os/ProjectHeatmap'
import { ActivityStream, type ActivityItem } from '@/components/os/ActivityStream'
import { ApprovalsIsland } from './approvals-island'

const CATEGORY_LABELS: Record<string, string> = {
  marketing: 'Marketing',
  product: 'Produkt',
  operations: 'Operations',
  design: 'Design & Brand',
  digital_product: 'Produkt-Chance',
}

type ImplementationRow = {
  id: string
  created_at: string
  suggestion_id: string
  status: string
}

type DailyReportRow = {
  report_date: string
  suggestions_count: number
  generation_status: string
  created_at: string
}

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 11) return 'Guten Morgen, Stefan'
  if (hour < 18) return 'Hallo, Stefan'
  return 'Guten Abend, Stefan'
}

/**
 * CEO Home — Phase 1 Spine. Server component: fetches all data in parallel,
 * derives the activity feed in-server, and hands the pending list to the
 * ApprovalsIsland client island (which calls the existing server action).
 * Honors the empty-slot doctrine throughout.
 */
export default async function CeoHome() {
  const supabase = await createClient()

  // Alle unabhängigen Reads parallel. Defensiv: page rendert auch, wenn
  // einzelne Queries leer/fehlerhaft sind.
  const [listResult, kpis, implResult, reportResult] = await Promise.all([
    supabase
      .from('suggestions')
      .select('id, title, body, insight, source, category, status, report_date')
      .eq('status', 'pending')
      .order('report_date', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(50),
    getCeoKpis(),
    supabase
      .from('implementations')
      .select('id, created_at, suggestion_id, status')
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('daily_reports')
      .select('report_date, suggestions_count, generation_status, created_at')
      .order('report_date', { ascending: false })
      .limit(10),
  ])

  const pending = (listResult.data ?? []) as Suggestion[]

  // Zweite Query nur für den Activity-Feed: zuletzt erstellte Vorschläge
  // (jeden Status), um "created"-Events ableiten zu können.
  const { data: recentSuggestionsData } = await supabase
    .from('suggestions')
    .select('id, title, category, status, created_at')
    .order('created_at', { ascending: false })
    .limit(20)

  const recentSuggestions = (recentSuggestionsData ?? []) as Array<{
    id: string
    title: string
    category: string
    status: string
    created_at: string
  }>
  const implementations = (implResult.data ?? []) as ImplementationRow[]
  const reports = (reportResult.data ?? []) as DailyReportRow[]

  // ─── Activity-Feed in-server ableiten (merge + sort DESC) ───
  const activity: ActivityItem[] = [
    ...recentSuggestions.map((s) => ({
      id: `sug-${s.id}`,
      ts: s.created_at,
      actor: 'NORA',
      verb: 'erstellte Vorschlag',
      summary: s.title,
      module_key: CATEGORY_LABELS[s.category] ?? s.category,
    })),
    ...implementations.map((impl) => ({
      id: `impl-${impl.id}`,
      ts: impl.created_at,
      actor: 'Stefan',
      verb: impl.status === 'done' ? 'setzte um' : 'bestätigte',
      summary: 'BizDev-Vorschlag',
      module_key: null,
    })),
    ...reports.map((r) => ({
      id: `report-${r.report_date}`,
      ts: r.created_at,
      actor: 'NORA',
      verb: 'generierte Report',
      summary: `${r.suggestions_count} ${
        r.suggestions_count === 1 ? 'Vorschlag' : 'Vorschläge'
      } (${r.report_date})`,
      module_key: null,
    })),
  ]
    .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
    .slice(0, 20)

  // ─── Briefing (best-effort, blockiert nie) ───
  const briefing = await getDailyBriefing({
    pendingSuggestions: pending.length,
    openTasks: pending.length,
    topSuggestionTitles: pending.slice(0, 3).map((s) => s.title),
  })

  return (
    <div className="space-y-8 p-6">
      {/* Greeting */}
      <div className="space-y-1">
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ color: 'var(--kx-text)' }}
        >
          {greeting()}
        </h1>
        <p className="text-sm" style={{ color: 'var(--kx-text-muted)' }}>
          {pending.length > 0
            ? `${pending.length} ${
                pending.length === 1 ? 'Vorschlag wartet' : 'Vorschläge warten'
              } auf deine Prüfung.`
            : 'Keine offenen Vorschläge — alles bearbeitet.'}
        </p>
      </div>

      {/* KPI-Strip — 8 Karten */}
      <section aria-label="Kennzahlen">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <KpiCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              unit={kpi.unit}
              delta={kpi.delta}
              sparkline={kpi.sparkline}
              source={kpi.source}
              empty={kpi.empty}
            />
          ))}
        </div>
      </section>

      {/* Briefing + Approvals */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2" aria-label="Briefing und Freigaben">
        <div>
          <BriefingCard
            text={briefing.text}
            generatedAt={briefing.generatedAt}
            fallback={briefing.fallback}
          />
        </div>
        <div className="space-y-3">
          <h2
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--kx-text-muted)' }}
          >
            Freigaben
          </h2>
          <ApprovalsIsland initial={pending} />
        </div>
      </section>

      {/* Projects + Activity */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2" aria-label="Projekte und Aktivität">
        <div className="space-y-3">
          <h2
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--kx-text-muted)' }}
          >
            Projekte
          </h2>
          <ProjectHeatmap projects={[]} />
        </div>
        <div className="space-y-3">
          <h2
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--kx-text-muted)' }}
          >
            Aktivität
          </h2>
          <ActivityStream items={activity} />
        </div>
      </section>
    </div>
  )
}
