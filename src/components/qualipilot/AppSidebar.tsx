'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { QP_NAV } from './nav'

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-[#0A0F24] md:flex">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#38E5FF] to-[#A720FF]">
          <ShieldCheck className="h-5 w-5 text-[#070B1E]" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">QualiPilot</p>
          <p className="text-[10px] uppercase tracking-wider text-white/40">GMP Platform</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {QP_NAV.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-white/35">
              {group.label}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(item.href + '/')
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                        active
                          ? 'bg-[#0078FF]/15 text-white ring-1 ring-inset ring-[#0078FF]/40'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      <Icon className={cn('h-4 w-4', active && 'text-[#38E5FF]')} />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <p className="text-[10px] leading-relaxed text-white/35">
          Assistenzsystem. Keine automatische GMP-Freigabe.
        </p>
      </div>
    </aside>
  )
}
