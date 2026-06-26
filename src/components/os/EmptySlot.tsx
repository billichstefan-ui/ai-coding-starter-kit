import * as React from 'react'
import { Plug } from 'lucide-react'
import { Button } from '@/components/ui/button'

type EmptySlotProps = {
  title: string
  description: string
  provider?: string
  ctaLabel?: string
  icon?: React.ReactNode
}

/**
 * Empty-slot doctrine (blueprint, integration note 6): when a module/source
 * has no data yet, render an honest empty state — icon + explanation + a
 * non-functional Connect CTA. NEVER renders a fabricated number.
 */
export function EmptySlot({
  title,
  description,
  provider,
  ctaLabel = 'Verbinden',
  icon,
}: EmptySlotProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center"
      style={{
        borderColor: 'var(--kx-border)',
        background: 'var(--kx-surface)',
      }}
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full"
        style={{
          background: 'var(--kx-surface-2)',
          color: 'var(--kx-text-muted)',
        }}
      >
        {icon ?? <Plug className="h-5 w-5" aria-hidden="true" />}
      </div>

      <div className="space-y-1">
        <h3
          className="text-sm font-semibold"
          style={{ color: 'var(--kx-text)' }}
        >
          {title}
        </h3>
        <p
          className="mx-auto max-w-sm text-xs leading-relaxed"
          style={{ color: 'var(--kx-text-muted)' }}
        >
          {description}
        </p>
      </div>

      <Button
        size="sm"
        variant="outline"
        disabled
        className="mt-1 text-xs"
        style={{ borderColor: 'var(--kx-border)', color: 'var(--kx-text-muted)' }}
        aria-label={
          provider ? `${ctaLabel}: ${provider} (noch nicht verfügbar)` : ctaLabel
        }
      >
        <Plug className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
        {provider ? `${ctaLabel} · ${provider}` : ctaLabel}
      </Button>
    </div>
  )
}
