import { createClient } from '@/lib/supabase-server'
import Image from 'next/image'
import { LogoutButton } from './logout-button'
import { GenerateButton } from './generate-button'
import { DashboardClient } from './dashboard-client'
import type { Suggestion } from './suggestion-card'

export default async function DashboardPage() {
  const supabase = await createClient()

  const [listResult, implCount, appCount, rejCount] = await Promise.all([
    supabase
      .from('suggestions')
      .select('id, title, body, insight, source, category, status, report_date')
      .order('report_date', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(500),
    supabase.from('suggestions').select('*', { count: 'exact', head: true }).eq('status', 'implemented'),
    supabase.from('suggestions').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('suggestions').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
  ])

  const suggestions = (listResult.data ?? []) as Suggestion[]
  const allTimeCounts = {
    implemented: implCount.count ?? 0,
    approved: appCount.count ?? 0,
    rejected: rejCount.count ?? 0,
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: '#070B1E', fontFamily: 'var(--font-sora), sans-serif' }}
    >
      {/* Neon splatter background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            'radial-gradient(500px circle at 12% 8%, rgba(56,229,255,0.10), transparent 60%),' +
            'radial-gradient(460px circle at 90% 14%, rgba(255,45,156,0.10), transparent 60%),' +
            'radial-gradient(420px circle at 80% 92%, rgba(166,255,60,0.08), transparent 60%)',
        }}
      />
      <header
        className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10"
        style={{ borderColor: '#1C2340', background: '#070B1E' }}
      >
        <div className="flex items-center gap-3">
          <Image
            src="/brand/kicasso-mascot.png"
            alt="KIcasso"
            width={30}
            height={30}
            priority
          />
          <div className="text-base font-extrabold tracking-[1px]">
            <span style={{ color: '#38E5FF', textShadow: '0 0 5px #38E5FF, 0 0 12px rgba(56,229,255,0.55)' }}>KI</span>
            <span style={{ color: '#FF2D9C', textShadow: '0 0 5px #FF2D9C, 0 0 12px rgba(255,45,156,0.55)' }}>casso</span>
          </div>
          <div
            className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium"
            style={{ background: '#0E1430', color: '#8892B0', border: '1px solid #1C2340' }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#A6FF3C', boxShadow: '0 0 6px #A6FF3C' }} aria-hidden="true" />
            NORA
          </div>
        </div>
        <div className="flex items-center gap-2">
          <GenerateButton />
          <LogoutButton />
        </div>
      </header>

      <div className="relative z-10 flex-1 flex flex-col">
        <DashboardClient initialSuggestions={suggestions} allTimeCounts={allTimeCounts} />
      </div>
    </div>
  )
}
