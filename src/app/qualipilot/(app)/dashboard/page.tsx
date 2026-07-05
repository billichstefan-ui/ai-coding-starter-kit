import Link from 'next/link'
import {
  FolderKanban,
  FileText,
  FileClock,
  FileCheck2,
  ShieldAlert,
  ClipboardList,
  Sparkles,
  Plus,
  Wand2,
  GitBranch,
  ScrollText,
  Activity,
} from 'lucide-react'
import { requireQpContext } from '@/lib/qualipilot/db'
import { createClient } from '@/lib/supabase-server'
import { PageHeader } from '@/components/qualipilot/PageHeader'
import { StatCard } from '@/components/qualipilot/StatCard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { formatDateTime } from '@/lib/qualipilot/format'
import type { AuditEntry } from '@/lib/qualipilot/types'

// Server component — RLS scoped Zählungen + Compliance-Heuristik.
export default async function DashboardPage() {
  await requireQpContext()
  const supabase = await createClient()

  // Defensive: bei Query-Fehler count = 0, damit das Dashboard nie crasht.
  const c = (v: number | null | undefined) => v ?? 0

  const [
    projects,
    draftDocs,
    reviewDocs,
    approvedDocs,
    totalDocs,
    criticalRisks,
    totalRisks,
    openTests,
    aiReview,
    audit,
  ] = await Promise.all([
    supabase.from('qp_projects').select('id', { count: 'exact', head: true }),
    supabase.from('qp_documents').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('qp_documents').select('id', { count: 'exact', head: true }).eq('status', 'in_review'),
    supabase.from('qp_documents').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('qp_documents').select('id', { count: 'exact', head: true }),
    supabase.from('qp_risks').select('id', { count: 'exact', head: true }).eq('risk_class', 'critical'),
    supabase.from('qp_risks').select('id', { count: 'exact', head: true }),
    supabase.from('qp_test_cases').select('id', { count: 'exact', head: true }).eq('status', 'not_run'),
    supabase.from('qp_ai_generations').select('id', { count: 'exact', head: true }).eq('review_required', true),
    supabase
      .from('qp_audit_trail')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6),
  ])

  const projectCount = c(projects.count)
  const draftCount = c(draftDocs.count)
  const reviewCount = c(reviewDocs.count)
  const approvedCount = c(approvedDocs.count)
  const totalDocCount = c(totalDocs.count)
  const criticalCount = c(criticalRisks.count)
  const totalRiskCount = c(totalRisks.count)
  const openTestCount = c(openTests.count)
  const aiReviewCount = c(aiReview.count)
  const auditRows = (audit.data ?? []) as AuditEntry[]

  // Compliance Readiness Score — einfache Heuristik (kein regulatorischer Wert).
  const approvalRatio = approvedCount / Math.max(totalDocCount, 1)
  const riskRatio = 1 - criticalCount / Math.max(totalRiskCount, 1)
  const score = Math.round(((approvalRatio + riskRatio) / 2) * 100)

  const quickActions = [
    { label: 'Neues Projekt', href: '/qualipilot/projects/new', icon: Plus },
    { label: 'AI Draft generieren', href: '/qualipilot/ai-generator', icon: Wand2 },
    { label: 'FMEA starten', href: '/qualipilot/risk-assessment', icon: ShieldAlert },
    { label: 'Trace Matrix', href: '/qualipilot/traceability', icon: GitBranch },
    { label: 'Audit Trail', href: '/qualipilot/audit-trail', icon: ScrollText },
  ]

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" description="Compliance-Überblick auf einen Blick" />

      {/* Kennzahlen */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Projekte"
          value={projectCount}
          icon={FolderKanban}
          href="/qualipilot/projects"
        />
        <StatCard
          label="Dokumente in Draft"
          value={draftCount}
          icon={FileText}
          href="/qualipilot/documents"
        />
        <StatCard
          label="Dokumente im Review"
          value={reviewCount}
          icon={FileClock}
          href="/qualipilot/documents"
        />
        <StatCard
          label="Freigegebene Dokumente"
          value={approvedCount}
          icon={FileCheck2}
          href="/qualipilot/documents"
        />
        <StatCard
          label="Kritische Risiken"
          value={criticalCount}
          icon={ShieldAlert}
          emphasis="danger"
          href="/qualipilot/risk-assessment"
        />
        <StatCard
          label="Offene Test Cases"
          value={openTestCount}
          icon={ClipboardList}
          href="/qualipilot/testing"
        />
        <StatCard
          label="AI Drafts — Review nötig"
          value={aiReviewCount}
          icon={Sparkles}
          emphasis="accent"
          href="/qualipilot/documents"
        />
      </div>

      {/* Readiness + Quick Actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border-white/10 bg-white/[0.03] lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-white">Compliance Readiness Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-semibold tabular-nums text-[#38E5FF]">{score}</span>
              <span className="text-sm text-white/50">/ 100</span>
            </div>
            <Progress value={score} className="h-2 bg-white/10" />
            <p className="text-xs text-white/45">Heuristik — kein regulatorischer Wert</p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.03] lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {quickActions.map(({ label, href, icon: Icon }) => (
                <Button
                  key={href}
                  asChild
                  variant="outline"
                  className="border-white/15 bg-white/5 text-white hover:border-[#0078FF]/40 hover:bg-white/10"
                >
                  <Link href={href}>
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Trail */}
      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Activity className="h-4 w-4 text-white/60" />
            Letzte Audit-Trail-Aktivitäten
          </CardTitle>
        </CardHeader>
        <CardContent>
          {auditRows.length === 0 ? (
            <p className="text-sm text-white/50">Noch keine Aktivitäten</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {auditRows.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <span className="font-medium text-white">{entry.event_type}</span>
                    <span className="text-white/40"> · {entry.entity_type}</span>
                  </div>
                  <span className="shrink-0 tabular-nums text-white/45">
                    {formatDateTime(entry.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
