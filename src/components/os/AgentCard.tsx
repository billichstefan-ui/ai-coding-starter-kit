import { Card, CardContent } from '@/components/ui/card'
import type { AgentCardData } from '@/lib/agents'

const STATUS_LABEL: Record<string, string> = {
  succeeded: 'Erfolgreich',
  failed: 'Fehlgeschlagen',
  running: 'Läuft',
}

const STATUS_COLOR: Record<string, string> = {
  live: 'var(--kx-cyan)',
  slot: 'var(--kx-text-muted)',
  disabled: 'var(--kx-text-muted)',
}

const STATUS_PILL: Record<string, string> = {
  live: 'Aktiv',
  slot: 'Nicht verbunden',
  disabled: 'Deaktiviert',
}

/** '0 6 * * *' → 'Täglich 06:00 UTC'; sonst der Rohwert. */
function humanizeSchedule(schedule: string | null): string | null {
  if (!schedule) return null
  const parts = schedule.trim().split(/\s+/)
  if (parts.length === 5 && parts[2] === '*' && parts[3] === '*' && parts[4] === '*') {
    const [m, h] = parts
    if (/^\d+$/.test(m) && /^\d+$/.test(h)) {
      return `Täglich ${h.padStart(2, '0')}:${m.padStart(2, '0')} UTC`
    }
  }
  return schedule
}

function formatDateTime(ts: string | null): string | null {
  if (!ts) return null
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return null
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

function formatUsd(value: number): string {
  if (value > 0 && value < 0.01) return '< $0,01'
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Eine Agenten-Karte im Control Center. Live-Agenten (NORA) zeigen echte
 * 7-Tage-Telemetrie; fehlt sie (null), erscheint ehrlich „—" statt einer
 * erfundenen 0 (Empty-Slot-Doktrin). Slots werden gedimmt, aber sichtbar
 * dargestellt — sie sind reale, noch nicht verbundene Module. Server-safe.
 */
export function AgentCard({ agent }: { agent: AgentCardData }) {
  const isLive = agent.status === 'live'
  const dotColor = STATUS_COLOR[agent.status] ?? 'var(--kx-text-muted)'
  const schedule = humanizeSchedule(agent.schedule)
  const lastRunAt = formatDateTime(agent.lastRunAt)

  return (
    <Card
      style={{
        background: 'var(--kx-surface)',
        border: '1px solid var(--kx-border)',
        opacity: isLive ? 1 : 0.72,
      }}
    >
      <CardContent className="flex flex-col gap-3 p-5">
        {/* Kopf: Name + Status-Pille */}
        <div className="flex items-start justify-between gap-3">
          <h3
            className="text-sm font-semibold leading-tight"
            style={{ color: 'var(--kx-text)' }}
          >
            {agent.label}
          </h3>
          <span className="flex shrink-0 items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: dotColor }}
              aria-hidden="true"
            />
            <span
              className="text-[11px] font-medium uppercase tracking-wide"
              style={{ color: dotColor }}
            >
              {STATUS_PILL[agent.status] ?? agent.status}
            </span>
          </span>
        </div>

        {/* Modell + Zeitplan */}
        <div
          className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs"
          style={{ color: 'var(--kx-text-muted)' }}
        >
          <span className="font-mono">{agent.model}</span>
          {schedule ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{schedule}</span>
            </>
          ) : null}
        </div>

        {/* Stats — echte Telemetrie oder ehrliches „—" */}
        <div
          className="grid grid-cols-2 gap-3 rounded-lg p-3"
          style={{ background: 'var(--kx-surface-2)' }}
        >
          <div className="flex flex-col gap-0.5">
            <span
              className="text-[10px] font-medium uppercase tracking-wide"
              style={{ color: 'var(--kx-text-muted)' }}
            >
              Läufe (7T)
            </span>
            <span
              className="text-lg font-semibold tabular-nums"
              style={{ color: agent.runs7d == null ? 'var(--kx-text-muted)' : 'var(--kx-text)' }}
            >
              {agent.runs7d == null ? '—' : agent.runs7d}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span
              className="text-[10px] font-medium uppercase tracking-wide"
              style={{ color: 'var(--kx-text-muted)' }}
            >
              Kosten (7T)
            </span>
            <span
              className="text-lg font-semibold tabular-nums"
              style={{ color: agent.costUsd7d == null ? 'var(--kx-text-muted)' : 'var(--kx-text)' }}
            >
              {agent.costUsd7d == null ? '—' : formatUsd(agent.costUsd7d)}
            </span>
          </div>
        </div>

        {/* Letzter Lauf */}
        <p className="text-xs" style={{ color: 'var(--kx-text-muted)' }}>
          {lastRunAt ? (
            <>
              Letzter Lauf: {lastRunAt}
              {agent.lastRunStatus
                ? ` · ${STATUS_LABEL[agent.lastRunStatus] ?? agent.lastRunStatus}`
                : ''}
            </>
          ) : (
            'Noch kein Lauf'
          )}
        </p>

        {/* Beschreibung */}
        {agent.description ? (
          <p
            className="text-xs leading-relaxed"
            style={{ color: 'var(--kx-text-muted)' }}
          >
            {agent.description}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
