import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { RunEntry } from '@/lib/agents'

const STATUS_LABEL: Record<string, string> = {
  succeeded: 'Erfolgreich',
  failed: 'Fehlgeschlagen',
  running: 'Läuft',
}

const STATUS_COLOR: Record<string, string> = {
  succeeded: 'var(--kx-cyan)',
  failed: 'var(--kx-danger)',
  running: 'var(--kx-text-muted)',
}

const TRIGGER_LABEL: Record<string, string> = {
  manual: 'Manuell',
  cron: 'Cron',
}

function formatDateTime(ts: string): string {
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

function formatTokens(input: number | null, output: number | null): string {
  if (input == null && output == null) return '—'
  const fmt = (n: number | null) =>
    n == null ? '—' : new Intl.NumberFormat('de-DE').format(n)
  return `${fmt(input)} → ${fmt(output)}`
}

function formatUsd(value: number | null): string {
  if (value == null) return '—'
  if (value > 0 && value < 0.01) return '< $0,01'
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Ausführungs-Log der letzten Agenten-Läufe. Zeilen ohne Token-/Kosten-Daten
 * (aus daily_reports vor Einführung der Telemetrie abgeleitet) zeigen ehrlich
 * „—" statt erfundener Zahlen. Server-safe.
 */
export function RunLog({ runs }: { runs: RunEntry[] }) {
  if (runs.length === 0) {
    return (
      <div
        className="rounded-xl border px-6 py-10 text-center text-sm"
        style={{
          borderColor: 'var(--kx-border)',
          background: 'var(--kx-surface)',
          color: 'var(--kx-text-muted)',
        }}
      >
        Noch keine Läufe protokolliert.
      </div>
    )
  }

  return (
    <div
      className="rounded-xl border"
      style={{ borderColor: 'var(--kx-border)', background: 'var(--kx-surface)' }}
    >
      <Table>
        <TableHeader>
          <TableRow style={{ borderColor: 'var(--kx-border)' }}>
            <TableHead style={{ color: 'var(--kx-text-muted)' }}>Zeit</TableHead>
            <TableHead style={{ color: 'var(--kx-text-muted)' }}>Agent</TableHead>
            <TableHead style={{ color: 'var(--kx-text-muted)' }}>Auslöser</TableHead>
            <TableHead style={{ color: 'var(--kx-text-muted)' }}>Status</TableHead>
            <TableHead className="text-right" style={{ color: 'var(--kx-text-muted)' }}>
              Tokens (in → out)
            </TableHead>
            <TableHead className="text-right" style={{ color: 'var(--kx-text-muted)' }}>
              Kosten
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {runs.map((run) => {
            const color = STATUS_COLOR[run.status] ?? 'var(--kx-text-muted)'
            return (
              <TableRow key={run.id} style={{ borderColor: 'var(--kx-border)' }}>
                <TableCell
                  className="whitespace-nowrap tabular-nums text-xs"
                  style={{ color: 'var(--kx-text-muted)' }}
                >
                  {formatDateTime(run.startedAt)}
                </TableCell>
                <TableCell
                  className="font-medium"
                  style={{ color: 'var(--kx-text)' }}
                >
                  {run.agentLabel}
                </TableCell>
                <TableCell style={{ color: 'var(--kx-text-muted)' }}>
                  {run.trigger ? TRIGGER_LABEL[run.trigger] ?? run.trigger : '—'}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: color }}
                      aria-hidden="true"
                    />
                    <span style={{ color }}>
                      {STATUS_LABEL[run.status] ?? run.status}
                    </span>
                  </span>
                </TableCell>
                <TableCell
                  className="text-right tabular-nums text-xs"
                  style={{ color: 'var(--kx-text-muted)' }}
                >
                  {formatTokens(run.inputTokens, run.outputTokens)}
                </TableCell>
                <TableCell
                  className="text-right tabular-nums"
                  style={{ color: 'var(--kx-text)' }}
                >
                  {formatUsd(run.costUsd)}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
