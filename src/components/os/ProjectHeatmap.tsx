'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { EmptySlot } from './EmptySlot'

export type ProjectRow = {
  name: string
  progress: number
  priority: 'P0' | 'P1' | 'P2' | null
  status: string
}

const PRIORITY_COLOR: Record<string, string> = {
  P0: 'var(--kx-violet)',
  P1: 'var(--kx-primary)',
  P2: 'var(--kx-cyan)',
}

/**
 * Project progress × priority. Phase 1 has no `projects` table → CEO Home
 * passes `projects={[]}` and this renders an honest EmptySlot rather than
 * fabricated bars (empty-slot doctrine).
 */
export function ProjectHeatmap({ projects }: { projects: ProjectRow[] }) {
  if (projects.length === 0) {
    return (
      <EmptySlot
        title="Projects-Modul nicht verbunden"
        description="Sobald das Projects-Modul live ist, erscheinen hier Fortschritt und Priorität deiner Projekte."
        provider="Projects"
      />
    )
  }

  return (
    <TooltipProvider delayDuration={150}>
      <div className="space-y-3">
        {projects.map((project) => {
          const pct = Math.max(0, Math.min(100, project.progress))
          const color = project.priority
            ? PRIORITY_COLOR[project.priority] ?? 'var(--kx-primary)'
            : 'var(--kx-primary)'
          return (
            <Tooltip key={project.name}>
              <TooltipTrigger asChild>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className="truncate font-medium"
                      style={{ color: 'var(--kx-text)' }}
                    >
                      {project.name}
                    </span>
                    <span
                      className="tabular-nums text-xs"
                      style={{ color: 'var(--kx-text-muted)' }}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div
                    className="h-2 w-full overflow-hidden rounded-full"
                    style={{ background: 'var(--kx-surface-2)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {project.priority ? `${project.priority} · ` : ''}
                {project.status}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
