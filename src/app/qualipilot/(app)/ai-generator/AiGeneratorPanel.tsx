'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, AlertTriangle, ExternalLink, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ReviewRequiredBanner } from '@/components/qualipilot/ReviewRequiredBanner'
import { EmptyState } from '@/components/qualipilot/EmptyState'
import { AI_DOCUMENT_TYPES, GAMP_CATEGORIES } from '@/lib/qualipilot/constants'
import type { DocumentSection } from '@/lib/qualipilot/types'

const triggerCls = 'border-white/15 bg-white/5 text-white'
const inputCls = 'border-white/15 bg-white/5 text-white placeholder:text-white/30'

interface GenerateResult {
  ok: true
  documentId: string | null
  generationId: string | null
  content: { summary?: string; sections?: DocumentSection[]; disclaimer?: string }
  model: string
  reviewRequired: boolean
}

interface FormState {
  documentType: string
  projectId: string
  language: 'de' | 'en'
  systemDescription: string
  processDescription: string
  gmpCriticality: string
  gampCategory: string
  chapters: string
  additionalInfo: string
  saveAsDocument: boolean
  documentTitle: string
}

const initial: FormState = {
  documentType: '',
  projectId: '',
  language: 'de',
  systemDescription: '',
  processDescription: '',
  gmpCriticality: '',
  gampCategory: '',
  chapters: '',
  additionalInfo: '',
  saveAsDocument: true,
  documentTitle: '',
}

export function AiGeneratorPanel({ projects }: { projects: { id: string; name: string }[] }) {
  const [form, setForm] = useState<FormState>(initial)
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<GenerateResult | null>(null)
  const [error, setError] = useState<{ message: string; detail?: string } | null>(null)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.documentType) {
      setError({ message: 'Bitte einen Dokumenttyp auswählen.' })
      return
    }
    setPending(true)
    setError(null)
    setResult(null)

    const selectedProject = projects.find((p) => p.id === form.projectId)
    const payload = {
      documentType: form.documentType,
      language: form.language,
      projectId: form.projectId || undefined,
      projectName: selectedProject?.name || undefined,
      systemDescription: form.systemDescription || undefined,
      processDescription: form.processDescription || undefined,
      gmpCriticality: form.gmpCriticality || undefined,
      gampCategory: form.gampCategory || undefined,
      chapters: form.chapters || undefined,
      additionalInfo: form.additionalInfo || undefined,
      saveAsDocument: form.saveAsDocument,
      documentTitle: form.documentTitle || undefined,
    }

    try {
      const res = await fetch('/qualipilot/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => null)

      if (!res.ok || !data?.ok) {
        setError({
          message: data?.error ?? 'Local AI unavailable',
          detail: data?.detail ?? data?.details ? JSON.stringify(data?.details) : undefined,
        })
        return
      }
      setResult(data as GenerateResult)
    } catch {
      setError({
        message: 'Netzwerkfehler',
        detail: 'Der Server konnte nicht erreicht werden. Bitte erneut versuchen.',
      })
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* ── Formular ─────────────────────────────────────────── */}
      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="text-base text-white">Entwurf konfigurieren</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-white/80">
                Dokumenttyp <span className="text-red-400">*</span>
              </Label>
              <Select
                value={form.documentType || undefined}
                onValueChange={(v) => set('documentType', v)}
              >
                <SelectTrigger className={triggerCls}>
                  <SelectValue placeholder="Auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {AI_DOCUMENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-white/80">Projekt</Label>
                <Select
                  value={form.projectId || undefined}
                  onValueChange={(v) => set('projectId', v)}
                >
                  <SelectTrigger className={triggerCls}>
                    <SelectValue placeholder="Optional" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.length === 0 ? (
                      <SelectItem value="none" disabled>
                        Keine Projekte
                      </SelectItem>
                    ) : (
                      projects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Sprache</Label>
                <Select
                  value={form.language}
                  onValueChange={(v) => set('language', v as 'de' | 'en')}
                >
                  <SelectTrigger className={triggerCls}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="en">Englisch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="systemDescription" className="text-white/80">
                Systembeschreibung
              </Label>
              <Textarea
                id="systemDescription"
                rows={3}
                value={form.systemDescription}
                onChange={(e) => set('systemDescription', e.target.value)}
                placeholder="Was für ein System wird qualifiziert?"
                className={inputCls}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="processDescription" className="text-white/80">
                Prozessbeschreibung
              </Label>
              <Textarea
                id="processDescription"
                rows={3}
                value={form.processDescription}
                onChange={(e) => set('processDescription', e.target.value)}
                placeholder="Relevante Prozesse / Anwendungsfälle"
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gmpCriticality" className="text-white/80">
                  GMP-Kritikalität
                </Label>
                <Input
                  id="gmpCriticality"
                  value={form.gmpCriticality}
                  onChange={(e) => set('gmpCriticality', e.target.value)}
                  placeholder="z. B. hoch"
                  className={inputCls}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">GAMP-Kategorie</Label>
                <Select
                  value={form.gampCategory || undefined}
                  onValueChange={(v) => set('gampCategory', v)}
                >
                  <SelectTrigger className={triggerCls}>
                    <SelectValue placeholder="Auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {GAMP_CATEGORIES.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chapters" className="text-white/80">
                Kapitel / Gliederung
              </Label>
              <Input
                id="chapters"
                value={form.chapters}
                onChange={(e) => set('chapters', e.target.value)}
                placeholder="z. B. Zweck, Umfang, Anforderungen …"
                className={inputCls}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInfo" className="text-white/80">
                Zusätzliche Hinweise
              </Label>
              <Textarea
                id="additionalInfo"
                rows={3}
                value={form.additionalInfo}
                onChange={(e) => set('additionalInfo', e.target.value)}
                className={inputCls}
              />
            </div>

            <Separator className="bg-white/10" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="saveAsDocument" className="text-white/80">
                  Als Dokument speichern
                </Label>
                <p className="text-xs text-white/40">Legt einen KI-Entwurf (Review Required) an.</p>
              </div>
              <Switch
                id="saveAsDocument"
                checked={form.saveAsDocument}
                onCheckedChange={(v) => set('saveAsDocument', v)}
              />
            </div>

            {form.saveAsDocument && (
              <div className="space-y-2">
                <Label htmlFor="documentTitle" className="text-white/80">
                  Dokumenttitel
                </Label>
                <Input
                  id="documentTitle"
                  value={form.documentTitle}
                  onChange={(e) => set('documentTitle', e.target.value)}
                  placeholder="Optional — sonst automatisch"
                  className={inputCls}
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={pending}
              className="w-full bg-[#0078FF] text-white hover:bg-[#0067DB]"
            >
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  KI generiert Entwurf …
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Entwurf generieren
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ── Ergebnis ─────────────────────────────────────────── */}
      <div className="space-y-4">
        {pending && (
          <Card className="border-white/10 bg-white/[0.03]">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-[#7FB4FF]" />
              <p className="text-sm text-white/60">KI generiert Entwurf …</p>
            </CardContent>
          </Card>
        )}

        {!pending && error && (
          <Card className="border-red-500/40 bg-red-500/10">
            <CardContent className="space-y-3 pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-red-200">{error.message}</p>
                  {error.detail && (
                    <p className="text-xs leading-relaxed text-red-100/80">{error.detail}</p>
                  )}
                </div>
              </div>
              <p className="text-xs text-red-100/70">
                Kein aktiver lokaler KI-Server? Prüfe die{' '}
                <Link
                  href="/qualipilot/settings/ai-providers"
                  className="font-medium text-red-100 underline hover:text-white"
                >
                  KI-Provider-Einstellungen
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        )}

        {!pending && !error && !result && (
          <EmptyState
            icon={Sparkles}
            title="Noch kein Entwurf"
            description="Konfiguriere links den Dokumenttyp und starte die Generierung. Der Entwurf erscheint hier — immer als Review-Required-Entwurf."
          />
        )}

        {!pending && result && (
          <>
            <ReviewRequiredBanner />
            <Card className="border-white/10 bg-white/[0.03]">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
                <CardTitle className="text-base text-white">Generierter Entwurf</CardTitle>
                <span className="text-xs text-white/40">Modell: {result.model || '—'}</span>
              </CardHeader>
              <CardContent className="space-y-5">
                {result.documentId && (
                  <Link
                    href={`/qualipilot/documents/${result.documentId}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#7FB4FF] hover:text-white"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Als Dokument geöffnet
                  </Link>
                )}

                {result.content.summary && (
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-semibold text-white">Zusammenfassung</h3>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-white/70">
                      {result.content.summary}
                    </p>
                  </div>
                )}

                {(result.content.sections ?? []).map((section, i) => (
                  <div key={i} className="space-y-1.5">
                    <h3 className="text-sm font-semibold text-white">{section.heading}</h3>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-white/70">
                      {section.body}
                    </p>
                  </div>
                ))}

                {result.content.disclaimer && (
                  <p className="border-t border-white/10 pt-4 text-xs italic text-white/40">
                    {result.content.disclaimer}
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
