'use client'

import { useState } from 'react'
import { OsSidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { CommandMenu } from './CommandMenu'

/**
 * Top-level OS chrome: TopBar across the top, OsSidebar on the left, content
 * outlet on the right. Owns the command-menu open state (blueprint §5).
 * Below 768px the sidebar collapses (it is `hidden md:flex`); content stays full-width.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [cmdOpen, setCmdOpen] = useState(false)

  return (
    <div
      className="flex h-screen flex-col"
      style={{ background: 'var(--kx-bg)', color: 'var(--kx-text)' }}
    >
      <TopBar onOpenCommand={() => setCmdOpen(true)} />

      <div className="flex min-h-0 flex-1">
        <OsSidebar />
        <main
          className="min-w-0 flex-1 overflow-y-auto"
          style={{ background: 'var(--kx-bg)' }}
        >
          {children}
        </main>
      </div>

      <CommandMenu open={cmdOpen} onOpenChange={setCmdOpen} />
    </div>
  )
}
