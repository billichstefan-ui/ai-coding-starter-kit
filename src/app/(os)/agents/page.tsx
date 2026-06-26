import { ModuleShell } from '@/components/os/ModuleShell'
import { EmptySlot } from '@/components/os/EmptySlot'
import { AgentCard } from '@/components/os/AgentCard'
import { RunLog } from '@/components/os/RunLog'
import { getAgentControlCenter } from '@/lib/agents'

// Live-Telemetrie: nie statisch cachen.
export const dynamic = 'force-dynamic'

function formatUsd(value: number): string {
  if (value > 0 && value < 0.01) return '< $0,01'
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('de-DE').format(value)
}

/**
 * AI Agents Control Center (Company OS Phase 2) — erstes echtes Live-Modul.
 * NORA läuft täglich; ihre Läufe (Status, Tokens, Kosten) erscheinen hier.
 * Die übrigen Agenten sind ehrliche Slots, bis sie angebunden werden.
 */
export default async function AgentsPage() {
  const { agents, runs, totals7d } = await getAgentControlCenter()

  // Registry leer (DB nicht erreichbar / Migration noch nicht angewendet) → ehrlicher Slot.
  if (agents.length === 0) {
    return (
      <ModuleShell title="AI Agents">
        <EmptySlot
          title="AI Agents ist noch nicht verbunden"
          description="Sobald die Agenten-Registry verfügbar ist, erscheinen hier Status, Läufe, Tokens und Kosten deiner KI-Agenten."
          provider="Agent-Telemetrie"
        />
      </ModuleShell>
    )
  }

  const liveCount = agents.filter((a) => a.status === 'live').length

  return (
    <ModuleShell title="AI Agents">
      <div className="space-y-8">
        {/* 7-Tage-Übersicht — echte Telemetrie oder ehrlicher Hinweis */}
        <section aria-label="7-Tage-Übersicht">
          {totals7d ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Läufe (7T)', value: formatNumber(totals7d.runs) },
                { label: 'Kosten (7T)', value: formatUsd(totals7d.costUsd) },
                { label: 'Input-Tokens (7T)', value: formatNumber(totals7d.inputTokens) },
                { label: 'Output-Tokens (7T)', value: formatNumber(totals7d.outputTokens) },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-1 rounded-xl border p-4"
                  style={{
                    borderColor: 'var(--kx-border)',
                    background: 'var(--kx-surface)',
                  }}
                >
                  <span
                    className="text-[10px] font-medium uppercase tracking-wide"
                    style={{ color: 'var(--kx-text-muted)' }}
                  >
                    {stat.label}
                  </span>
                  <span
                    className="text-xl font-semibold tabular-nums"
                    style={{ color: 'var(--kx-text)' }}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="rounded-xl border border-dashed px-4 py-3 text-xs"
              style={{ borderColor: 'var(--kx-border)', color: 'var(--kx-text-muted)' }}
            >
              {liveCount > 0
                ? 'Echte Token- und Kosten-Telemetrie erscheint, sobald der nächste NORA-Lauf läuft. Die bisherige Lauf-Historie unten ist aus den Tagesreports abgeleitet.'
                : 'Noch keine Telemetrie — sobald ein Agent läuft, erscheinen hier Läufe, Tokens und Kosten.'}
            </div>
          )}
        </section>

        {/* Agenten-Registry */}
        <section className="space-y-3" aria-label="Agenten">
          <h2
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--kx-text-muted)' }}
          >
            Agenten
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <AgentCard key={agent.key} agent={agent} />
            ))}
          </div>
        </section>

        {/* Ausführungs-Log */}
        <section className="space-y-3" aria-label="Ausführungs-Log">
          <h2
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--kx-text-muted)' }}
          >
            Ausführungs-Log
          </h2>
          <RunLog runs={runs} />
        </section>
      </div>
    </ModuleShell>
  )
}
