import { ShieldAlert } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import { requireQpContext } from '@/lib/qualipilot/db'
import { PageHeader } from '@/components/qualipilot/PageHeader'
import { EmptyState } from '@/components/qualipilot/EmptyState'
import type { AIProviderConfig } from '@/lib/qualipilot/types'
import { SettingsNav } from '../SettingsNav'
import { AiProvidersManager } from './AiProvidersManager'

export const dynamic = 'force-dynamic'

export default async function AiProvidersPage() {
  const { profile } = await requireQpContext()

  return (
    <div className="space-y-6">
      <PageHeader
        title="KI-Provider"
        description="Lokale KI anbinden (LM Studio, LocalAI, Ollama)"
      />
      <SettingsNav active="ai-providers" />

      {profile.role !== 'admin' ? (
        <EmptyState
          icon={ShieldAlert}
          title="Kein Zugriff"
          description="Nur Admins können KI-Provider verwalten."
        />
      ) : (
        <AdminSection />
      )}
    </div>
  )
}

async function AdminSection() {
  const supabase = await createClient()
  const { data: providers } = await supabase
    .from('qp_ai_providers')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(50)

  return <AiProvidersManager providers={(providers ?? []) as AIProviderConfig[]} />
}
