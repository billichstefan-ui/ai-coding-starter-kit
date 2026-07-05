import Link from 'next/link'
import { FolderKanban } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import { requireQpContext } from '@/lib/qualipilot/db'
import { formatDate } from '@/lib/qualipilot/format'
import { PageHeader } from '@/components/qualipilot/PageHeader'
import { EmptyState } from '@/components/qualipilot/EmptyState'
import { StatusBadge, RiskBadge } from '@/components/qualipilot/badges'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { GAMP_CATEGORIES } from '@/lib/qualipilot/constants'
import type { Project } from '@/lib/qualipilot/types'

export const dynamic = 'force-dynamic'

function gampLabel(value: string | null): string {
  if (!value) return '—'
  return GAMP_CATEGORIES.find((g) => g.value === value)?.label.split(' — ')[0] ?? value
}

export default async function ProjectsPage() {
  await requireQpContext()
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from('qp_projects')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  const rows = (projects ?? []) as Project[]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projekte"
        description="GMP-Qualifizierungsprojekte"
        actions={
          <Button asChild className="bg-[#0078FF] text-white hover:bg-[#0067DB]">
            <Link href="/qualipilot/projects/new">Neues Projekt</Link>
          </Button>
        }
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="Noch keine Projekte"
          description="Lege dein erstes GMP-Qualifizierungsprojekt an, um Dokumente, Risiken und Anforderungen zu verwalten."
          actionLabel="Neues Projekt"
          actionHref="/qualipilot/projects/new"
        />
      ) : (
        <Card className="overflow-hidden border-white/10 bg-white/[0.03]">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60">Name</TableHead>
                <TableHead className="text-white/60">Kunde</TableHead>
                <TableHead className="text-white/60">System</TableHead>
                <TableHead className="text-white/60">GAMP</TableHead>
                <TableHead className="text-white/60">Risikoklasse</TableHead>
                <TableHead className="text-white/60">Status</TableHead>
                <TableHead className="text-white/60">Zieltermin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => (
                <TableRow key={p.id} className="border-white/10 hover:bg-white/[0.04]">
                  <TableCell className="font-medium">
                    <Link
                      href={`/qualipilot/projects/${p.id}`}
                      className="text-white hover:text-[#7FB4FF]"
                    >
                      {p.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-white/70">{p.customer ?? '—'}</TableCell>
                  <TableCell className="text-white/70">{p.system_name ?? '—'}</TableCell>
                  <TableCell className="text-white/70">{gampLabel(p.gamp_category)}</TableCell>
                  <TableCell>
                    <RiskBadge riskClass={p.risk_class} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} kind="project" />
                  </TableCell>
                  <TableCell className="text-white/70">{formatDate(p.target_date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
