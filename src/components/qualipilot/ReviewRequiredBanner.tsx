import { AlertTriangle } from 'lucide-react'
import { AI_DRAFT_DISCLAIMER } from '@/lib/qualipilot/constants'
import { cn } from '@/lib/utils'

/**
 * GMP-Grundsatz sichtbar machen: KI-Ausgaben sind Entwürfe, nie freigegeben.
 * Wird auf jeder KI-generierten Dokumentansicht und im Generator gezeigt.
 */
export function ReviewRequiredBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3',
        className
      )}
      role="alert"
    >
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
      <div className="space-y-0.5">
        <p className="text-sm font-semibold text-amber-200">Review Required — KI-Entwurf</p>
        <p className="text-xs leading-relaxed text-amber-100/80">{AI_DRAFT_DISCLAIMER}</p>
      </div>
    </div>
  )
}
