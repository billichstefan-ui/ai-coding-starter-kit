import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-white/12 bg-white/[0.02] px-6 py-14 text-center',
        className
      )}
    >
      {Icon && (
        <div className="mb-4 rounded-full border border-white/10 bg-white/5 p-3 text-white/50">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="text-base font-medium text-white">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-white/50">{description}</p>}
      {actionLabel && actionHref && (
        <Button asChild className="mt-5 bg-[#0078FF] text-white hover:bg-[#0067DB]">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  )
}
