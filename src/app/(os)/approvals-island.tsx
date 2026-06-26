'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { updateSuggestionStatus } from '@/app/actions/suggestions'
import { ApprovalCard } from '@/components/os/ApprovalCard'
import type { Suggestion } from '@/app/dashboard/suggestion-card'

/**
 * Client island for CEO Home approvals. Holds the pending list locally and
 * calls the EXISTING `updateSuggestionStatus` server action (REUSE — no
 * reimplementation). Mirrors the verified handleAction toast flow from
 * dashboard-client.tsx (Monday/Notion URLs, warnings).
 */
export function ApprovalsIsland({ initial }: { initial: Suggestion[] }) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(initial)

  async function handleAction(
    id: string,
    status: 'approved' | 'rejected' | 'pending' | 'implemented'
  ) {
    const result = await updateSuggestionStatus(id, status)

    if (!result.success) {
      toast.error(result.error ?? 'Fehler beim Speichern. Bitte versuche es erneut.')
      return
    }

    // Erledigte Vorschläge sofort aus der Liste entfernen.
    setSuggestions((prev) => prev.filter((s) => s.id !== id))

    if (status === 'approved') {
      if (result.monday_task_url) {
        const mondayUrl = result.monday_task_url
        toast.success('✓ Task erstellt', {
          action: {
            label: 'In Monday öffnen ↗',
            onClick: () => window.open(mondayUrl, '_blank', 'noopener,noreferrer'),
          },
          duration: 8000,
        })
      }

      if (result.notion_page_url) {
        const notionUrl = result.notion_page_url
        toast.success('✓ Notion-Seite erstellt', {
          action: {
            label: 'In Notion öffnen ↗',
            onClick: () => window.open(notionUrl, '_blank', 'noopener,noreferrer'),
          },
          duration: 8000,
        })
        if (result.elaboration_warning) {
          toast.info(result.elaboration_warning, { duration: 6000 })
        }
      } else if (result.notion_warning) {
        toast.warning(result.notion_warning, { duration: 6000 })
      }
    }
  }

  if (suggestions.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-2 rounded-xl border px-6 py-10 text-center"
        style={{
          borderColor: 'var(--kx-border)',
          background: 'var(--kx-surface)',
        }}
      >
        <span className="text-sm font-semibold" style={{ color: 'var(--kx-text)' }}>
          Alle Vorschläge bearbeitet
        </span>
        <span className="text-xs" style={{ color: 'var(--kx-text-muted)' }}>
          NORA arbeitet bereits am nächsten Report.
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {suggestions.map((suggestion) => (
        <ApprovalCard
          key={suggestion.id}
          suggestion={suggestion}
          onAction={handleAction}
        />
      ))}
    </div>
  )
}
