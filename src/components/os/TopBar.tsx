'use client'

import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'

/**
 * 56px top bar. Gradient KORDIX wordmark (same technique as dashboard/page.tsx),
 * a search slot styled as an input that opens the command menu, and right-side
 * actions (notifications, theme toggle, ⌘K trigger).
 */
export function TopBar({ onOpenCommand }: { onOpenCommand: () => void }) {
  return (
    <header
      className="flex h-14 items-center gap-3 border-b px-4"
      style={{
        background: 'var(--kx-surface)',
        borderColor: 'var(--kx-border)',
      }}
    >
      {/* Wordmark */}
      <div
        className="select-none text-sm font-extrabold uppercase tracking-[4px]"
        style={{
          background: 'var(--kx-gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        KORDIX
      </div>

      {/* Global search slot (opens the command menu) */}
      <button
        type="button"
        onClick={onOpenCommand}
        className="mx-auto flex h-9 w-full max-w-md items-center gap-2 rounded-md border px-3 text-sm transition-colors hover:opacity-90"
        style={{
          background: 'var(--kx-bg)',
          borderColor: 'var(--kx-border)',
          color: 'var(--kx-text-muted)',
        }}
        aria-label="Suche öffnen"
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="truncate">Suchen oder Befehl…</span>
        <kbd
          className="ml-auto hidden items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px] font-medium sm:inline-flex"
          style={{ borderColor: 'var(--kx-border)' }}
        >
          ⌘K
        </kbd>
      </button>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="Benachrichtigungen"
          style={{ color: 'var(--kx-text-muted)' }}
        >
          <Bell className="h-4 w-4" />
        </Button>
        <ThemeToggle />
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenCommand}
          className="hidden h-8 px-2 text-xs sm:inline-flex"
          style={{ color: 'var(--kx-text-muted)' }}
          aria-label="Befehlsmenü öffnen"
        >
          ⌘K
        </Button>
      </div>
    </header>
  )
}
