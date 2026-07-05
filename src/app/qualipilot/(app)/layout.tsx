import { requireQpContext } from '@/lib/qualipilot/db'
import { createClient } from '@/lib/supabase-server'
import { AppSidebar } from '@/components/qualipilot/AppSidebar'
import { Topbar } from '@/components/qualipilot/Topbar'

/**
 * QualiPilot App-Shell (server component).
 * Auth-Gate: requireQpContext() leitet ohne Session zum QP-Login und ohne
 * Profil/Org zur QP-Registrierung (Onboarding). Danach Sidebar + Topbar.
 */
export default async function QualiPilotAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId, profile } = await requireQpContext()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: org } = await supabase
    .from('qp_organizations')
    .select('name')
    .eq('id', profile.organization_id!)
    .maybeSingle()

  return (
    <div className="flex h-screen overflow-hidden bg-[#070B1E] text-white">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar email={user?.email ?? ''} orgName={org?.name ?? 'QualiPilot'} />
        <main className="flex-1 overflow-y-auto px-6 py-8" data-user={userId}>
          <div className="mx-auto max-w-7xl space-y-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
