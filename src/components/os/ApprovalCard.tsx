'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Suggestion } from '@/app/dashboard/suggestion-card'

// Same colors/labels as suggestion-card.tsx CATEGORY_CONFIG — copied per
// contract (do not invent colors), kept local to avoid a new export surface.
const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  marketing: { label: 'Marketing', color: '#38E5FF' },
  product: { label: 'Produkt', color: '#0078FF' },
  operations: { label: 'Operations', color: '#A720FF' },
  design: { label: 'Design & Brand', color: '#0E9594' },
  digital_product: { label: 'Produkt-Chance', color: '#7B81FF' },
}

type ApprovalCardProps = {
  suggestion: Suggestion
  onAction: (
    id: string,
    status: 'approved' | 'rejected' | 'pending' | 'implemented'
  ) => Promise<void>
}

/**
 * Compact approve/reject card for CEO Home. Reuses the existing Suggestion type
 * and the onAction signature from suggestion-card.tsx. The parent passes an
 * onAction that calls the existing updateSuggestionStatus server action.
 */
export function ApprovalCard({ suggestion, onAction }: ApprovalCardProps) {
  const [isLoading, setIsLoading] = useState<'approve' | 'reject' | null>(null)

  const category =
    CATEGORY_CONFIG[suggestion.category] ?? {
      label: suggestion.category,
      color: '#8892B0',
    }

  async function handleAction(action: 'approve' | 'reject') {
    const newStatus = action === 'approve' ? 'approved' : 'rejected'
    setIsLoading(action)
    try {
      await onAction(suggestion.id, newStatus)
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <Card
      className="overflow-hidden"
      style={{ background: 'var(--kx-surface)', border: '1px solid var(--kx-border)' }}
    >
      <CardContent className="space-y-3 p-4">
        <Badge
          variant="outline"
          className="text-xs font-medium"
          style={{
            color: category.color,
            borderColor: category.color + '40',
            background: category.color + '15',
          }}
        >
          {category.label}
        </Badge>

        <h3
          className="text-sm font-semibold leading-snug"
          style={{ color: 'var(--kx-text)' }}
        >
          {suggestion.title}
        </h3>

        <p
          className="line-clamp-2 text-sm leading-relaxed"
          style={{ color: 'var(--kx-text-muted)' }}
        >
          {suggestion.body}
        </p>

        <div className="flex gap-2 pt-1">
          <Button
            onClick={() => handleAction('approve')}
            disabled={isLoading !== null}
            size="sm"
            className="h-9 flex-1 text-xs font-medium transition-all hover:opacity-90"
            style={{ background: 'var(--kx-primary)', color: '#FFFFFF', border: 'none' }}
            aria-label={`Vorschlag bestätigen: ${suggestion.title}`}
          >
            {isLoading === 'approve' ? (
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block h-3 w-3 animate-spin rounded-full border-2"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }}
                />
                Speichere…
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Bestätigen
              </span>
            )}
          </Button>
          <Button
            onClick={() => handleAction('reject')}
            disabled={isLoading !== null}
            size="sm"
            variant="outline"
            className="h-9 flex-1 text-xs font-medium transition-all hover:opacity-80"
            style={{
              background: 'transparent',
              borderColor: 'var(--kx-border)',
              color: 'var(--kx-text-muted)',
            }}
            aria-label={`Vorschlag ablehnen: ${suggestion.title}`}
          >
            {isLoading === 'reject' ? (
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block h-3 w-3 animate-spin rounded-full border-2"
                  style={{
                    borderColor: 'rgba(255,255,255,0.15)',
                    borderTopColor: 'rgba(255,255,255,0.6)',
                  }}
                />
                Speichere…
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Ablehnen
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
