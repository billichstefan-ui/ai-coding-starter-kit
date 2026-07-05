import { Network } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import { requireQpContext } from '@/lib/qualipilot/db'
import { PageHeader } from '@/components/qualipilot/PageHeader'
import { EmptyState } from '@/components/qualipilot/EmptyState'
import { CoverageBadge } from '@/components/qualipilot/badges'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type {
  Requirement,
  Risk,
  TestCase,
  TraceabilityLink,
  DocumentRecord,
} from '@/lib/qualipilot/types'

export const dynamic = 'force-dynamic'

function reqLabel(r: Requirement): string {
  return r.requirement_id ? `${r.requirement_id} · ${r.title}` : r.title
}

function testLabel(t: TestCase): string {
  return t.test_id ? `${t.test_id} · ${t.title}` : t.title
}

export default async function TraceabilityPage() {
  await requireQpContext()
  const supabase = await createClient()

  const [reqRes, riskRes, testRes, docRes, linkRes] = await Promise.all([
    supabase.from('qp_requirements').select('*').order('created_at', { ascending: false }).limit(200),
    supabase.from('qp_risks').select('*').limit(200),
    supabase.from('qp_test_cases').select('*').limit(200),
    supabase.from('qp_documents').select('*').limit(200),
    supabase.from('qp_traceability_links').select('*').order('created_at', { ascending: false }).limit(200),
  ])

  const requirements = (reqRes.data ?? []) as Requirement[]
  const risks = (riskRes.data ?? []) as Risk[]
  const testCases = (testRes.data ?? []) as TestCase[]
  const documents = (docRes.data ?? []) as DocumentRecord[]
  const links = (linkRes.data ?? []) as TraceabilityLink[]

  const reqMap = new Map(requirements.map((r) => [r.id, r]))
  const riskMap = new Map(risks.map((r) => [r.id, r]))
  const testMap = new Map(testCases.map((t) => [t.id, t]))
  const docMap = new Map(documents.map((d) => [d.id, d]))

  // Anforderungen ohne Verknüpfung ODER ohne verknüpften Testfall.
  const reqWithTest = new Set(
    links.filter((l) => l.requirement_id && l.test_case_id).map((l) => l.requirement_id)
  )
  const uncovered = requirements.filter((r) => !reqWithTest.has(r.id))

  if (requirements.length === 0 && links.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Traceability Matrix"
          description="Anforderung ↔ Risiko ↔ Testfall ↔ Dokument"
        />
        <EmptyState
          icon={Network}
          title="Noch keine Traceability-Daten"
          description="Lege Anforderungen, Risiken und Testfälle an und verknüpfe sie."
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Traceability Matrix"
        description="Anforderung ↔ Risiko ↔ Testfall ↔ Dokument"
      />

      <Card className="overflow-hidden border-white/10 bg-white/[0.03]">
        {links.length === 0 ? (
          <CardContent className="py-10 text-center text-sm text-white/50">
            Noch keine Verknüpfungen erfasst.
          </CardContent>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60">Anforderung</TableHead>
                <TableHead className="text-white/60">Risiko</TableHead>
                <TableHead className="text-white/60">Testfall</TableHead>
                <TableHead className="text-white/60">Dokument</TableHead>
                <TableHead className="text-white/60">Coverage</TableHead>
                <TableHead className="text-white/60">Evidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((l) => {
                const req = l.requirement_id ? reqMap.get(l.requirement_id) : undefined
                const risk = l.risk_id ? riskMap.get(l.risk_id) : undefined
                const test = l.test_case_id ? testMap.get(l.test_case_id) : undefined
                const doc = l.document_id ? docMap.get(l.document_id) : undefined
                return (
                  <TableRow key={l.id} className="border-white/10 hover:bg-white/[0.04]">
                    <TableCell className="text-white/80">
                      {req ? reqLabel(req) : '—'}
                    </TableCell>
                    <TableCell className="text-white/70">
                      {risk?.failure_mode ?? '—'}
                    </TableCell>
                    <TableCell className="text-white/70">
                      {test ? testLabel(test) : '—'}
                    </TableCell>
                    <TableCell className="text-white/70">{doc?.title ?? '—'}</TableCell>
                    <TableCell>
                      <CoverageBadge status={l.coverage_status} />
                    </TableCell>
                    <TableCell className="text-white/60">
                      {l.evidence_reference ?? '—'}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="text-white">Nicht abgedeckte Anforderungen</CardTitle>
        </CardHeader>
        <CardContent>
          {uncovered.length === 0 ? (
            <p className="text-sm text-emerald-300">
              Alle Anforderungen sind mit einem Testfall verknüpft.
            </p>
          ) : (
            <ul className="space-y-2">
              {uncovered.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.02] px-3 py-2"
                >
                  <span className="min-w-0 truncate text-sm text-white/80">{reqLabel(r)}</span>
                  <Badge
                    variant="outline"
                    className="shrink-0 border-red-500/40 bg-red-500/15 font-medium text-red-300"
                  >
                    Nicht abgedeckt
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
