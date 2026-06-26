'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { NAV_GROUPS, type NavItem } from './nav'

/**
 * OS Sidebar — grouped Decide / Operate / Remember nav (blueprint §1.3 / §2.1).
 * Thin custom composition over shadcn ScrollArea + Tooltip (per contract F6:
 * do NOT recreate shadcn primitives). Collapsible to an icon-only rail.
 */
export function OsSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <TooltipProvider delayDuration={150}>
      <aside
        className={cn(
          'hidden md:flex flex-col border-r transition-[width] duration-200 ease-in-out',
          collapsed ? 'w-[64px]' : 'w-[232px]'
        )}
        style={{
          background: 'var(--kx-surface)',
          borderColor: 'var(--kx-border)',
        }}
        aria-label="Hauptnavigation"
      >
        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-4 p-2 py-4">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="flex flex-col gap-1">
                {!collapsed && (
                  <span
                    className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: 'var(--kx-text-muted)' }}
                  >
                    {group.label}
                  </span>
                )}
                {group.items.map((item) => (
                  <SidebarLink
                    key={item.href}
                    item={item}
                    active={isActive(item.href)}
                    collapsed={collapsed}
                  />
                ))}
              </div>
            ))}
          </nav>
        </ScrollArea>

        <div
          className="border-t p-2"
          style={{ borderColor: 'var(--kx-border)' }}
        >
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-white/5"
            style={{ color: 'var(--kx-text-muted)' }}
            aria-label={collapsed ? 'Sidebar ausklappen' : 'Sidebar einklappen'}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4 shrink-0" />
            ) : (
              <PanelLeftClose className="h-4 w-4 shrink-0" />
            )}
            {!collapsed && <span>Einklappen</span>}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  )
}

function SidebarLink({
  item,
  active,
  collapsed,
}: {
  item: NavItem
  active: boolean
  collapsed: boolean
}) {
  const Icon = item.icon

  const link = (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        collapsed && 'justify-center px-0',
        !active && 'hover:bg-white/5'
      )}
      style={{
        color: active ? '#FFFFFF' : 'var(--kx-text-muted)',
        background: active ? 'var(--kx-primary)' : 'transparent',
      }}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  )

  if (!collapsed) return link

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  )
}
