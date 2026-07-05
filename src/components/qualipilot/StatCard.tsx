import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

export interface StatCardProps {
  label: string
  value: string | number
  icon?: LucideIcon
  hint?: string
  href?: string
  /** Hebt kritische Kennzahlen hervor (z. B. offene kritische Risiken). */
  emphasis?: 'default' | 'danger' | 'accent'
}

export function StatCard({ label, value, icon: Icon, hint, href, emphasis = 'default' }: StatCardProps) {
  const accent =
    emphasis === 'danger'
      ? 'text-red-300'
      : emphasis === 'accent'
        ? 'text-[#38E5FF]'
        : 'text-white'

  const card = (
    <Card
      className={cn(
        'relative overflow-hidden border-white/10 bg-white/[0.03] p-5 transition-colors',
        href && 'hover:border-[#0078FF]/40 hover:bg-white/[0.05]'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-white/50">{label}</p>
          <p className={cn('text-3xl font-semibold tabular-nums', accent)}>{value}</p>
          {hint && <p className="text-xs text-white/45">{hint}</p>}
        </div>
        {Icon && (
          <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/60">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </Card>
  )

  return href ? (
    <Link href={href} className="block">
      {card}
    </Link>
  ) : (
    card
  )
}
