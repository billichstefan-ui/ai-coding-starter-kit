import { ScrollText } from 'lucide-react'
import { requireQpContext } from '@/lib/qualipilot/db'
import { createClient } from '@/lib/supabase-server'
import { PageHeader } from '@/components/qualipilot/PageHeader'
import { EmptyState } from '@/components/qualipilot/EmptyState'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { formatDateTime } from '@/lib/qualipilot/format'
import type { AuditEntry } from '@/lib/qualipilot/types'

// Server component — unveränderliches Ereignisprotokoll (21 CFR Part 11).
export default async function AuditTrailPage() {
  await requireQpContext()
  const supabase = await createClient()

  const { data } = await supabase
    .from('qp_audit_trail')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  const rows = (data ?? []) as AuditEntry[]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Trail"
        description="Unveränderliches Ereignisprotokoll (21 CFR Part 11)"
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={ScrollText}
          title="Noch keine Audit-Einträge"
          description="Aktionen wie Projekt- und Dokumentänderungen erscheinen hier."
        />
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-white/45">
            Audit-Einträge sind append-only und können nicht geändert oder gelöscht werden.
          </p>
          <Card className="border-white/10 bg-white/[0.03]">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white/50">Zeitpunkt</TableHead>
                    <TableHead className="text-white/50">Ereignis</TableHead>
                    <TableHead className="text-white/50">Entität</TableHead>
                    <TableHead className="text-white/50">Grund</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((entry) => (
                    <TableRow key={entry.id} className="border-white/5 hover:bg-white/[0.03]">
                      <TableCell className="tabular-nums text-white/70">
                        {formatDateTime(entry.created_at)}
                      </TableCell>
                      <TableCell className="font-medium text-white">{entry.event_type}</TableCell>
                      <TableCell className="text-white/70">{entry.entity_type}</TableCell>
                      <TableCell className="text-white/60">{entry.reason ?? '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
