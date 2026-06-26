import * as React from 'react'
import { Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { GlassPanel } from './GlassPanel'

type BriefingCardProps = {
  text: string
  generatedAt?: string | null
  fallback?: boolean
}

/**
 * Daily briefing surface. Gradient accent rule + "— Claude" attribution.
 * When `fallback === true` (no API key / SDK error), shows an honest
 * "Offline-Briefing" badge instead of pretending it is a live answer.
 * Server-safe presentational component.
 */
export function BriefingCard({ text, generatedAt, fallback }: BriefingCardProps) {
  return (
    <GlassPanel className="overflow-hidden p-5">
      {/* Gradient accent rule */}
      <div
        className="absolute inset-x-0 top-0 h-0.5"
        style={{ background: 'var(--kx-gradient)' }}
        aria-hidden="true"
      />

      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4" style={{ color: 'var(--kx-cyan)' }} aria-hidden="true" />
        <span className="text-sm font-semibold" style={{ color: 'var(--kx-text)' }}>
          Tagesbriefing
        </span>
        {fallback && (
          <Badge
            variant="outline"
            className="text-[10px] font-normal"
            style={{ borderColor: 'var(--kx-border)', color: 'var(--kx-text-muted)' }}
          >
            Offline-Briefing
          </Badge>
        )}
      </div>

      <p
        className="whitespace-pre-line text-sm leading-relaxed"
        style={{ color: 'var(--kx-text)' }}
      >
        {text}
      </p>

      <div
        className="mt-4 flex items-center justify-between text-xs"
        style={{ color: 'var(--kx-text-muted)' }}
      >
        <span>— Claude</span>
        {generatedAt && (
          <span className="tabular-nums">
            {new Intl.DateTimeFormat('de-DE', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }).format(new Date(generatedAt))}
          </span>
        )}
      </div>
    </GlassPanel>
  )
}
