import { notFound } from 'next/navigation'
import { requireQpContext } from '@/lib/qualipilot/db'
import { createClient } from '@/lib/supabase-server'
import { PageHeader } from '@/components/qualipilot/PageHeader'
import { StatusBadge } from '@/components/qualipilot/badges'
import { ReviewRequiredBanner } from '@/components/qualipilot/ReviewRequiredBanner'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatDate, formatDateTime } from '@/lib/qualipilot/format'
import type { DocumentContent, DocumentRecord, DocumentVersion } from '@/lib/qualipilot/types'
import { approveDocument, markInReview, markReviewed } from '../actions'

// Server component — Dokument-Detail inkl. Versionshistorie & Freigabe.
export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireQpContext()
  const supabase = await createClient()

  const { data } = await supabase
    .from('qp_documents')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!data) notFound()
  const doc = data as DocumentRecord

  const { data: versionData } = await supabase
    .from('qp_document_versions')
    .select('*')
    .eq('document_id', id)
    .order('version', { ascending: false })
  const versions = (versionData ?? []) as DocumentVersion[]

  // Beteiligte Profile für die Meta-Karte auflösen.
  const profileIds = [doc.author_id, doc.reviewer_id, doc.approver_id].filter(
    (v): v is string => Boolean(v)
  )
  const nameById = new Map<string, string>()
  if (profileIds.length > 0) {
    const { data: profiles } = await supabase
      .from('qp_profiles')
      .select('id, full_name')
      .in('id', profileIds)
    for (const p of profiles ?? []) {
      nameById.set(p.id as string, (p.full_name as string | null) ?? '—')
    }
  }
  const nameFor = (uid: string | null) => (uid ? nameById.get(uid) ?? '—' : '—')

  const content = (doc.content ?? {}) as DocumentContent
  const sections = Array.isArray(content.sections) ? content.sections : []
  const hasSections = sections.length > 0
  const canApprove = Boolean(doc.title && doc.document_type && doc.project_id && hasSections)
  const isFinal = doc.status === 'approved' || doc.status === 'obsolete'

  // Inline-Server-Actions (Rückgabe void, sauber an <form action> bindbar).
  async function onApprove() {
    'use server'
    await approveDocument(id)
  }
  async function onInReview() {
    'use server'
    await markInReview(id)
  }
  async function onReviewed() {
    'use server'
    await markReviewed(id)
  }

  return (
    <div className="space-y-8">
      {(doc.ai_generated || doc.review_required) && <ReviewRequiredBanner />}

      <PageHeader
        title={doc.title}
        description={`${doc.document_type} · v${doc.version}${
          doc.document_number ? ` · ${doc.document_number}` : ''
        }`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={doc.status} kind="document" />
            {!isFinal && (
              <form action={onInReview}>
                <Button
                  type="submit"
                  variant="outline"
                  className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                >
                  In Prüfung
                </Button>
              </form>
            )}
            {!isFinal && (
              <form action={onReviewed}>
                <Button
                  type="submit"
                  variant="outline"
                  className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                >
                  Geprüft
                </Button>
              </form>
            )}
            {!isFinal &&
              (canApprove ? (
                <form action={onApprove}>
                  <Button
                    type="submit"
                    className="bg-[#0078FF] text-white hover:bg-[#0067DB]"
                  >
                    Freigeben
                  </Button>
                </form>
              ) : (
                <span className="text-xs text-white/45">
                  Pflichtangaben fehlen für Freigabe
                </span>
              ))}
          </div>
        }
      />

      {/* Inhalt */}
      <div className="space-y-4">
        {content.summary && (
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader>
              <CardTitle className="text-white">Zusammenfassung</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-sm leading-relaxed text-white/70">
                {content.summary}
              </p>
            </CardContent>
          </Card>
        )}

        {hasSections ? (
          sections.map((section, i) => (
            <Card key={i} className="border-white/10 bg-white/[0.03]">
              <CardHeader>
                <CardTitle className="text-white">{section.heading}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-sm leading-relaxed text-white/70">
                  {section.body}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-white/10 bg-white/[0.03]">
            <CardContent className="py-8">
              <p className="text-sm text-white/50">Dieses Dokument hat noch keine Inhalte.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Versionshistorie */}
      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="text-white">Versionshistorie</CardTitle>
        </CardHeader>
        <CardContent>
          {versions.length === 0 ? (
            <p className="text-sm text-white/50">Nur die aktuelle Version vorhanden.</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {versions.map((v) => (
                <li
                  key={v.id}
                  className="flex items-center justify-between gap-3 py-2.5 text-sm"
                >
                  <div className="min-w-0">
                    <span className="font-medium tabular-nums text-white">v{v.version}</span>
                    <span className="text-white/40">
                      {' '}
                      · {v.change_reason ?? 'Ohne Angabe'}
                    </span>
                  </div>
                  <span className="shrink-0 tabular-nums text-white/45">
                    {formatDateTime(v.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Meta */}
      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="text-white">Metadaten</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            <Meta label="Autor" value={nameFor(doc.author_id)} />
            <Meta label="Reviewer" value={nameFor(doc.reviewer_id)} />
            <Meta label="Approver" value={nameFor(doc.approver_id)} />
            <Meta label="Freigegeben am" value={formatDateTime(doc.approved_at)} />
            <Meta label="Erstellt" value={formatDate(doc.created_at)} />
            <Meta label="Aktualisiert" value={formatDate(doc.updated_at)} />
          </dl>
          <Separator className="my-4 bg-white/10" />
          <p className="text-xs text-white/40">
            Freigegebene Dokumente sind unveränderlich — Änderungen erzeugen eine neue Version.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs uppercase tracking-wide text-white/40">{label}</dt>
      <dd className="text-sm text-white/80">{value}</dd>
    </div>
  )
}
