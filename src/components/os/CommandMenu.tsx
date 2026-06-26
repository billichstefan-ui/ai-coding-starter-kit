'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { NAV_GROUPS } from './nav'

/**
 * Global ⌘K / Ctrl+K command palette (blueprint Navigate / Act / Ask).
 * Phase 0: only the Navigate group is functional. Act / Ask are honest,
 * labeled placeholders (empty-slot doctrine — no fabricated actions);
 * Ask routes to the /copilot slot.
 */
export function CommandMenu({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const router = useRouter()

  // Global hotkey: ⌘K (mac) / Ctrl+K (win/linux)
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(true)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onOpenChange])

  function go(href: string) {
    onOpenChange(false)
    router.push(href)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Suchen oder Befehl eingeben…" />
      <CommandList>
        <CommandEmpty>Keine Treffer.</CommandEmpty>

        <CommandGroup heading="Navigieren">
          {NAV_GROUPS.flatMap((group) =>
            group.items.map((item) => {
              const Icon = item.icon
              return (
                <CommandItem
                  key={item.href}
                  value={`${item.label} ${group.label}`}
                  onSelect={() => go(item.href)}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{item.label}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {group.label}
                  </span>
                </CommandItem>
              )
            })
          )}
        </CommandGroup>

        {/* Act — placeholder, no fabricated actions in Phase 0 */}
        <CommandGroup heading="Aktion">
          <CommandItem disabled value="act-placeholder">
            <span className="text-muted-foreground">
              Aktionen folgen, sobald Module verbunden sind
            </span>
          </CommandItem>
        </CommandGroup>

        {/* Ask — routes to the Copilot slot */}
        <CommandGroup heading="Fragen">
          <CommandItem value="ask-copilot" onSelect={() => go('/copilot')}>
            <span>Copilot fragen…</span>
            <span className="ml-auto text-xs text-muted-foreground">Slot</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
