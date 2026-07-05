import { Users } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import { requireQpContext } from '@/lib/qualipilot/db'
import { formatDate } from '@/lib/qualipilot/format'
import { PageHeader } from '@/components/qualipilot/PageHeader'
import { EmptyState } from '@/components/qualipilot/EmptyState'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Profile, UserRole } from '@/lib/qualipilot/types'
import { SettingsNav } from '../SettingsNav'

export const dynamic = 'force-dynamic'

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  member: 'Mitglied',
  reviewer: 'Prüfer',
  approver: 'Freigeber',
}

export default async function UsersSettingsPage() {
  const { profile } = await requireQpContext()
  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from('qp_profiles')
    .select('id, full_name, role, created_at')
    .eq('organization_id', profile.organization_id!)
    .order('created_at', { ascending: true })
    .limit(200)

  const rows = (profiles ?? []) as Pick<Profile, 'id' | 'full_name' | 'role' | 'created_at'>[]

  return (
    <div className="space-y-6">
      <PageHeader title="Nutzer" description="Mitglieder deiner Organisation" />
      <SettingsNav active="users" />

      <p className="text-xs text-white/40">
        Nutzerverwaltung im MVP schreibgeschützt — Einladungen folgen.
      </p>

      {rows.length === 0 ? (
        <EmptyState icon={Users} title="Keine Nutzer" description="Es sind keine Mitglieder vorhanden." />
      ) : (
        <Card className="overflow-hidden border-white/10 bg-white/[0.03]">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60">Name</TableHead>
                <TableHead className="text-white/60">Rolle</TableHead>
                <TableHead className="text-white/60">Beigetreten</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((u) => (
                <TableRow key={u.id} className="border-white/10 hover:bg-white/[0.04]">
                  <TableCell className="font-medium text-white">
                    {u.full_name ?? '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-white/15 bg-white/5 text-white/80">
                      {ROLE_LABELS[u.role] ?? u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white/70">{formatDate(u.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
