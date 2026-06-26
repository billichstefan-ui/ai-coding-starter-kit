'use client'

import { ScrollArea } from '@/components/ui/scroll-area'

export type ActivityItem = {
  id: string
  ts: string
  actor: string
  verb: string
  summary: string
  module_key?: string | null
}

function formatTime(ts: string): string {
  const date = new Date(ts)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/**
 * Vertical activity feed (time · actor · summary). Initial items come from the
 * server (CEO Home merges suggestions/implementations/daily_reports). A live
 * Realtime subscription is a future hook — not required for Phase 1.
 */
export function ActivityStream({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <div
        className="rounded-xl border px-6 py-10 text-center text-sm"
        style={{
          borderColor: 'var(--kx-border)',
          background: 'var(--kx-surface)',
          color: 'var(--kx-text-muted)',
        }}
      >
        Noch keine Aktivität.
      </div>
    )
  }

  return (
    <ScrollArea className="h-[360px]">
      <ul className="space-y-0">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex gap-3 border-b px-1 py-3 last:border-b-0"
            style={{ borderColor: 'var(--kx-border)' }}
          >
            <span
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
              style={{ background: 'var(--kx-cyan)' }}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p
                className="text-sm leading-snug"
                style={{ color: 'var(--kx-text)' }}
              >
                <span className="font-medium">{item.actor}</span>{' '}
                <span style={{ color: 'var(--kx-text-muted)' }}>{item.verb}</span>{' '}
                {item.summary}
              </p>
              <span
                className="text-xs tabular-nums"
                style={{ color: 'var(--kx-text-muted)' }}
              >
                {formatTime(item.ts)}
                {item.module_key ? ` · ${item.module_key}` : ''}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}
