import { createClient } from '@/lib/supabase-server'
import { requireQpContext } from '@/lib/qualipilot/db'
import { formatDate } from '@/lib/qualipilot/format'
import { PageHeader } from '@/components/qualipilot/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Organization } from '@/lib/qualipilot/types'
import { SettingsNav } from '../SettingsNav'
import { OrgForm } from './OrgForm'

export const dynamic = 'force-dynamic'

export default async function OrganizationSettingsPage() {
  const { profile } = await requireQpContext()
  const supabase = await createClient()

  const [{ data: org }, { count }] = await Promise.all([
    supabase
      .from('qp_organizations')
      .select('*')
      .eq('id', profile.organization_id!)
      .maybeSingle(),
    supabase
      .from('qp_profiles')
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', profile.organization_id!),
  ])

  const organization = org as Organization | null
  const isAdmin = profile.role === 'admin'

  return (
    <div className="space-y-6">
      <PageHeader title="Organisation" description="Stammdaten deiner Organisation" />
      <SettingsNav active="organization" />

      {isAdmin && organization ? (
        <OrgForm initialName={organization.name} />
      ) : (
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="text-base text-white">Organisation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-white/70">
              <span className="text-white/40">Name: </span>
              {organization?.name ?? '—'}
            </p>
            {!isAdmin && (
              <p className="text-xs text-white/40">
                Nur Admins können die Organisation bearbeiten.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="border-white/10 bg-white/[0.03]">
        <CardContent className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2">
          <div>
            <p className="text-xs text-white/40">Mitglieder</p>
            <p className="text-lg font-semibold text-white">{count ?? 0}</p>
          </div>
          <div>
            <p className="text-xs text-white/40">Erstellt</p>
            <p className="text-lg font-semibold text-white">
              {formatDate(organization?.created_at)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
