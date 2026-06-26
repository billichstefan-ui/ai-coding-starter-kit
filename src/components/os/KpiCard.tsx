'use client'

import { ResponsiveContainer, LineChart, Line } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export type KpiCardProps = {
  label: string
  value: number | null
  unit?: 'eur' | 'count' | 'pct'
  delta?: number | null
  sparkline?: number[]
  source?: string
  empty?: boolean
}

function formatValue(value: number, unit?: KpiCardProps['unit']): string {
  switch (unit) {
    case 'eur':
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }).format(value)
    case 'pct':
      return `${new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 }).format(value)} %`
    case 'count':
    default:
      return new Intl.NumberFormat('de-DE').format(value)
  }
}

/**
 * Single KPI tile. Empty-slot doctrine (integration note 6): when `empty` or
 * `value === null`, render an em-dash + "Quelle verbinden" tooltip — NEVER
 * `0` styled as success. Positive delta → cyan, negative → danger.
 */
export function KpiCard({
  label,
  value,
  unit = 'count',
  delta,
  sparkline,
  source,
  empty,
}: KpiCardProps) {
  const isEmpty = empty === true || value === null
  const hasSparkline = !isEmpty && Array.isArray(sparkline) && sparkline.length > 1
  const sparkData = hasSparkline ? sparkline!.map((v, i) => ({ i, v })) : []

  const deltaColor =
    delta == null || delta === 0
      ? 'var(--kx-text-muted)'
      : delta > 0
        ? 'var(--kx-cyan)'
        : 'var(--kx-danger)'

  return (
    <Card
      style={{
        background: 'var(--kx-surface)',
        border: '1px solid var(--kx-border)',
      }}
    >
      <CardContent className="flex flex-col gap-2 p-4">
        <span
          className="text-xs font-medium uppercase tracking-wide"
          style={{ color: 'var(--kx-text-muted)' }}
        >
          {label}
        </span>

        {isEmpty ? (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className="cursor-help text-2xl font-semibold tabular-nums"
                  style={{ color: 'var(--kx-text-muted)' }}
                  aria-label="Kein Wert — Quelle nicht verbunden"
                >
                  —
                </span>
              </TooltipTrigger>
              <TooltipContent>
                Quelle verbinden{source ? ` · ${source}` : ''}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <div className="flex items-end justify-between gap-2">
            <span
              className="text-2xl font-semibold tabular-nums"
              style={{ color: 'var(--kx-text)' }}
            >
              {formatValue(value as number, unit)}
            </span>
            {hasSparkline && (
              <div className="h-8 w-20 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparkData}>
                    <Line
                      type="monotone"
                      dataKey="v"
                      stroke="var(--kx-primary)"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          {!isEmpty && delta != null && (
            <span
              className="text-xs font-medium tabular-nums"
              style={{ color: deltaColor }}
            >
              {delta > 0 ? '+' : ''}
              {new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 }).format(delta)}
              {unit === 'pct' ? ' pp' : ' %'}
            </span>
          )}
          {source && (
            <Badge
              variant="outline"
              className="text-[10px] font-normal"
              style={{
                borderColor: 'var(--kx-border)',
                color: 'var(--kx-text-muted)',
              }}
            >
              {source}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
