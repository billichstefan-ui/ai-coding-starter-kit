import Link from 'next/link'
import { FileText } from 'lucide-react'
import { requireQpContext } from '@/lib/qualipilot/db'
import { createClient } from '@/lib/supabase-server'
import { PageHeader } from '@/components/qualipilot/PageHeader'
import { EmptyState } from '@/components/qualipilot/EmptyState'
import { StatusBadge } from '@/components/qualipilot/badges'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { formatDate } from '@/lib/qualipilot/format'
import type { DocumentRecord } from '@/lib/qualipilot/types'

// Server component — RLS-gescopte Dokumentliste der Org.
export default async function DocumentsPage() {
  await requireQpContext()
  const supabase = await createClient()

  const { data } = await supabase
    .from('qp_documents')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(100)

  const documents = (data ?? []) as DocumentRecord[]

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dokumente"
        description="URS, IQ/OQ/PQ, FMEA, Checklisten …"
        actions={
          <Button asChild className="bg-[#0078FF] text-white hover:bg-[#0067DB]">
            <Link href="/qualipilot/ai-generator">AI Draft generieren</Link>
          </Button>
        }
      />

      {documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Noch keine Dokumente"
          description="Erzeuge einen ersten Entwurf mit dem AI Draft Generator."
          actionLabel="AI Draft generieren"
          actionHref="/qualipilot/ai-generator"
        />
      ) : (
        <Card className="border-white/10 bg-white/[0.03]">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60">Titel</TableHead>
                <TableHead className="text-white/60">Typ</TableHead>
                <TableHead className="text-white/60">Version</TableHead>
                <TableHead className="text-white/60">KI</TableHead>
                <TableHead className="text-white/60">Status</TableHead>
                <TableHead className="text-right text-white/60">Aktualisiert</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id} className="border-white/5 hover:bg-white/[0.04]">
                  <TableCell>
                    <Link
                      href={`/qualipilot/documents/${doc.id}`}
                      className="font-medium text-white hover:text-[#7FB4FF]"
                    >
                      {doc.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-white/70">{doc.document_type}</TableCell>
                  <TableCell className="tabular-nums text-white/70">v{doc.version}</TableCell>
                  <TableCell>
                    {doc.ai_generated && (
                      <Badge
                        variant="outline"
                        className="border-[#A720FF]/40 bg-[#A720FF]/15 font-medium text-[#D69BFF]"
                      >
                        KI
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={doc.status} kind="document" />
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-white/50">
                    {formatDate(doc.updated_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
