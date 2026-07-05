import { ShieldAlert } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import { requireQpContext } from '@/lib/qualipilot/db'
import { PageHeader } from '@/components/qualipilot/PageHeader'
import { EmptyState } from '@/components/qualipilot/EmptyState'
import { RiskBadge, RiskStatusBadge } from '@/components/qualipilot/badges'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { RISK_CLASS_LABELS } from '@/lib/qualipilot/constants'
import type { Risk, RiskClass } from '@/lib/qualipilot/types'
import { NewRiskForm } from './NewRiskForm'

export const dynamic = 'force-dynamic'

const CLASS_ORDER: RiskClass[] = ['critical', 'high', 'medium', 'low']

const STAT_TONE: Record<RiskClass, string> = {
  critical: 'border-red-500/50 bg-red-500/15 text-red-200',
  high: 'border-red-500/40 bg-red-500/10 text-red-300',
  medium: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  low: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
}

function truncate(value: string | null, max = 60): string {
  if (!value) return '—'
  return value.length > max ? `${value.slice(0, max)}…` : value
}

export default async function RiskAssessmentPage() {
  await requireQpContext()
  const supabase = await createClient()

  const [risksRes, projectsRes] = await Promise.all([
    supabase
      .from('qp_risks')
      .select('*')
      .order('rpn', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(200),
    supabase.from('qp_projects').select('id, name').order('name').limit(200),
  ])

  const risks = (risksRes.data ?? []) as Risk[]
  const projects = (projectsRes.data ?? []) as { id: string; name: string }[]

  const counts = CLASS_ORDER.reduce(
    (acc, c) => {
      acc[c] = risks.filter((r) => r.risk_class === c).length
      return acc
    },
    {} as Record<RiskClass, number>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Risk Assessment / FMEA"
        description="Fehlermöglichkeits- und Einflussanalyse (RPN = S×O×D)"
      />

      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="text-white">Neues Risiko erfassen</CardTitle>
        </CardHeader>
        <CardContent>
          <NewRiskForm projects={projects} />
        </CardContent>
      </Card>

      {/* Summary-Strip: Anzahl je Risikoklasse */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CLASS_ORDER.map((c) => (
          <div
            key={c}
            className={cn(
              'flex items-center justify-between rounded-lg border px-4 py-3',
              STAT_TONE[c]
            )}
          >
            <span className="text-sm font-medium">{RISK_CLASS_LABELS[c]}</span>
            <span className="font-mono text-lg font-semibold">{counts[c]}</span>
          </div>
        ))}
      </div>

      {risks.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title="Noch keine Risiken erfasst"
          description="Erfasse den ersten Fehlermodus oben."
        />
      ) : (
        <Card className="overflow-hidden border-white/10 bg-white/[0.03]">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60">Prozessschritt</TableHead>
                <TableHead className="text-white/60">Fehlermodus</TableHead>
                <TableHead className="text-white/60 text-center">S</TableHead>
                <TableHead className="text-white/60 text-center">O</TableHead>
                <TableHead className="text-white/60 text-center">D</TableHead>
                <TableHead className="text-white/60 text-center">RPN</TableHead>
                <TableHead className="text-white/60">Klasse</TableHead>
                <TableHead className="text-white/60">Status</TableHead>
                <TableHead className="text-white/60">Maßnahme</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {risks.map((r) => (
                <TableRow
                  key={r.id}
                  className={cn(
                    'border-white/10 hover:bg-white/[0.04]',
                    r.risk_class === 'critical' && 'border-l-2 border-l-red-500/70'
                  )}
                >
                  <TableCell className="text-white/70">{r.process_step ?? '—'}</TableCell>
                  <TableCell className="font-medium text-white">
                    {r.failure_mode ?? '—'}
                  </TableCell>
                  <TableCell className="text-center text-white/70">{r.severity ?? '—'}</TableCell>
                  <TableCell className="text-center text-white/70">{r.occurrence ?? '—'}</TableCell>
                  <TableCell className="text-center text-white/70">{r.detection ?? '—'}</TableCell>
                  <TableCell className="text-center font-mono font-semibold text-white">
                    {r.rpn ?? '—'}
                  </TableCell>
                  <TableCell>
                    <RiskBadge riskClass={r.risk_class} />
                  </TableCell>
                  <TableCell>
                    <RiskStatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="text-white/70" title={r.recommended_action ?? undefined}>
                    {truncate(r.recommended_action)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
