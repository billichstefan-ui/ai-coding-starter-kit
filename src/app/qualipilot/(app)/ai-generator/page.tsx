import { createClient } from '@/lib/supabase-server'
import { requireQpContext } from '@/lib/qualipilot/db'
import { PageHeader } from '@/components/qualipilot/PageHeader'
import { ReviewRequiredBanner } from '@/components/qualipilot/ReviewRequiredBanner'
import { AiGeneratorPanel } from './AiGeneratorPanel'

export const dynamic = 'force-dynamic'

export default async function AiGeneratorPage() {
  await requireQpContext()
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from('qp_projects')
    .select('id, name')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Draft Generator"
        description="Strukturierte GMP-Entwürfe mit lokaler KI — Review Required"
      />
      <ReviewRequiredBanner />
      <AiGeneratorPanel projects={projects ?? []} />
    </div>
  )
}
