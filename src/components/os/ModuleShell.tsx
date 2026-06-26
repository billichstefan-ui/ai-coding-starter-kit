import * as React from 'react'

type ModuleShellProps = {
  title: string
  action?: React.ReactNode
  tabs?: React.ReactNode
  children: React.ReactNode
}

/**
 * Consistent module frame: title + single primary action slot, optional
 * sub-nav (tabs), then content. Server-safe; used by Operate slot pages so
 * every module looks the same (blueprint module IA).
 */
export function ModuleShell({ title, action, tabs, children }: ModuleShellProps) {
  return (
    <div className="flex flex-col">
      <div
        className="flex flex-col gap-4 border-b px-6 py-5"
        style={{ borderColor: 'var(--kx-border)' }}
      >
        <div className="flex items-center justify-between gap-4">
          <h1
            className="text-xl font-semibold tracking-tight"
            style={{ color: 'var(--kx-text)' }}
          >
            {title}
          </h1>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
        {tabs ? <div>{tabs}</div> : null}
      </div>

      <div className="p-6">{children}</div>
    </div>
  )
}
