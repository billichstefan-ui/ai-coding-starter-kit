import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { createClient } from '@/lib/supabase-server'
import { requireQpContext } from '@/lib/qualipilot/db'
import { formatDate, formatDateTime } from '@/lib/qualipilot/format'
import { GAMP_CATEGORIES } from '@/lib/qualipilot/constants'
import { PageHeader } from '@/components/qualipilot/PageHeader'
import { StatusBadge, RiskBadge } from '@/components/qualipilot/badges'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Project, DocumentRecord, Risk, Requirement } from '@/lib/qualipilot/types'

export const dynamic = 'force-dynamic'

function gampLabel(value: string | null): string {
  if (!value) return '—'
  return GAMP_CATEGORIES.find((g) => g.value === value)?.label ?? value
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <dt className="text-xs font-medium uppercase tracking-wide text-white/40">{label}</dt>
      <dd className="text-sm text-white/85">{children}</dd>
    </div>
  )
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireQpContext()
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('qp_projects')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!project) notFound()
  const p = project as Project

  const [{ data: documents }, { data: risks }, { data: requirements }] = await Promise.all([
    supabase
      .from('qp_documents')
      .select('id, title, document_type, status')
      .eq('project_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('qp_risks')
      .select('id, failure_mode, risk_class, rpn')
      .eq('project_id', id)
      .order('rpn', { ascending: false }),
    supabase
      .from('qp_requirements')
      .select('id, requirement_id, title, criticality')
      .eq('project_id', id)
      .order('created_at', { ascending: false }),
  ])

  const docs = (documents ?? []) as Pick<
    DocumentRecord,
    'id' | 'title' | 'document_type' | 'status'
  >[]
  const riskRows = (risks ?? []) as Pick<Risk, 'id' | 'failure_mode' | 'risk_class' | 'rpn'>[]
  const reqRows = (requirements ?? []) as Pick<
    Requirement,
    'id' | 'requirement_id' | 'title' | 'criticality'
  >[]

  const subtitle = [p.customer, p.site].filter(Boolean).join(' · ') || undefined

  return (
    <div className="space-y-6">
      <PageHeader
        title={p.name}
        description={subtitle}
        actions={<StatusBadge status={p.status} kind="project" />}
      />

      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="text-base text-white">Projektdaten</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Kunde">{p.customer ?? '—'}</Field>
            <Field label="Standort">{p.site ?? '—'}</Field>
            <Field label="System-Name">{p.system_name ?? '—'}</Field>
            <Field label="GMP-Relevanz">{p.gmp_relevance ?? '—'}</Field>
            <Field label="GAMP-Kategorie">{gampLabel(p.gamp_category)}</Field>
            <Field label="Risikoklasse">
              <RiskBadge riskClass={p.risk_class} />
            </Field>
            <Field label="Verantwortlicher">{p.owner_id ?? '—'}</Field>
            <Field label="Startdatum">{formatDate(p.start_date)}</Field>
            <Field label="Zieltermin">{formatDate(p.target_date)}</Field>
            <Field label="Erstellt">{formatDateTime(p.created_at)}</Field>
            <Field label="Aktualisiert">{formatDateTime(p.updated_at)}</Field>
            <div className="space-y-1 sm:col-span-2 lg:col-span-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-white/40">
                Systembeschreibung
              </dt>
              <dd className="whitespace-pre-wrap text-sm text-white/85">
                {p.system_description ?? '—'}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="text-base text-white">Verknüpfte Dokumente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {docs.length === 0 ? (
              <p className="text-sm text-white/40">Keine Dokumente verknüpft.</p>
            ) : (
              docs.map((d) => (
                <div
                  key={d.id}
                  className="flex items-start justify-between gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/qualipilot/documents/${d.id}`}
                      className="block truncate text-sm text-white hover:text-[#7FB4FF]"
                    >
                      {d.title}
                    </Link>
                    <p className="text-xs text-white/40">{d.document_type}</p>
                  </div>
                  <StatusBadge status={d.status} kind="document" />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="text-base text-white">Verknüpfte Risiken</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {riskRows.length === 0 ? (
              <p className="text-sm text-white/40">Keine Risiken verknüpft.</p>
            ) : (
              riskRows.map((r) => (
                <div
                  key={r.id}
                  className="flex items-start justify-between gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white/85">{r.failure_mode ?? '—'}</p>
                    <p className="text-xs text-white/40">RPZ: {r.rpn ?? '—'}</p>
                  </div>
                  <RiskBadge riskClass={r.risk_class} />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="text-base text-white">Verknüpfte Anforderungen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reqRows.length === 0 ? (
              <p className="text-sm text-white/40">Keine Anforderungen verknüpft.</p>
            ) : (
              reqRows.map((rq) => (
                <div
                  key={rq.id}
                  className="flex items-start justify-between gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white/85">{rq.title}</p>
                    <p className="text-xs text-white/40">{rq.requirement_id ?? '—'}</p>
                  </div>
                  {rq.criticality ? <RiskBadge riskClass={rq.criticality} /> : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
