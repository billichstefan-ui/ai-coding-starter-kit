'use client'

import { useState, useTransition } from 'react'
import { Loader2, Check, X, Plug, CheckCircle2, XCircle, Pencil } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { PROVIDER_TYPE_LABELS } from '@/lib/qualipilot/constants'
import type { AIProviderConfig, ProviderType } from '@/lib/qualipilot/types'
import type { AIConnectionTestResult } from '@/lib/qualipilot/ai/types'
import { saveProvider, type ProviderInput } from '../actions'

const triggerCls = 'border-white/15 bg-white/5 text-white'
const inputCls = 'border-white/15 bg-white/5 text-white placeholder:text-white/30'

interface FormState {
  id: string | null
  name: string
  provider_type: ProviderType
  base_url: string
  api_key: string
  model_name: string
  embedding_model_name: string
  temperature: string
  max_tokens: string
  enabled: boolean
  is_default: boolean
}

const emptyForm: FormState = {
  id: null,
  name: '',
  provider_type: 'openai-compatible',
  base_url: '',
  api_key: '',
  model_name: '',
  embedding_model_name: '',
  temperature: '0.2',
  max_tokens: '4000',
  enabled: true,
  is_default: false,
}

function baseUrlPlaceholder(type: ProviderType): string {
  if (type === 'ollama') return 'http://localhost:11434'
  return 'http://localhost:1234/v1'
}

type TestPayload = {
  type: ProviderType
  name?: string
  baseUrl?: string
  apiKey?: string
  model?: string
  embeddingModel?: string
  temperature?: number
  maxTokens?: number
}

export function AiProvidersManager({ providers }: { providers: AIProviderConfig[] }) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, startSaving] = useTransition()
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null)

  // Test-Zustände je Schlüssel ('form' oder Provider-ID).
  const [testing, setTesting] = useState<Record<string, boolean>>({})
  const [results, setResults] = useState<Record<string, AIConnectionTestResult>>({})
  const [testError, setTestError] = useState<Record<string, string>>({})

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function runTest(key: string, payload: TestPayload) {
    setTesting((t) => ({ ...t, [key]: true }))
    setTestError((e) => ({ ...e, [key]: '' }))
    try {
      const res = await fetch('/qualipilot/api/ai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data || typeof data.ok !== 'boolean') {
        setTestError((e) => ({
          ...e,
          [key]: data?.error ?? 'Verbindungstest fehlgeschlagen (Local AI unavailable).',
        }))
        setResults((r) => {
          const next = { ...r }
          delete next[key]
          return next
        })
        return
      }
      setResults((r) => ({ ...r, [key]: data as AIConnectionTestResult }))
    } catch {
      setTestError((e) => ({ ...e, [key]: 'Netzwerkfehler — Server nicht erreichbar.' }))
    } finally {
      setTesting((t) => ({ ...t, [key]: false }))
    }
  }

  function testForm() {
    runTest('form', {
      type: form.provider_type,
      name: form.name || 'Test',
      baseUrl: form.base_url || undefined,
      apiKey: form.api_key || undefined,
      model: form.model_name || undefined,
      embeddingModel: form.embedding_model_name || undefined,
      temperature: Number(form.temperature) || 0.2,
      maxTokens: Number(form.max_tokens) || 4000,
    })
  }

  function testExisting(p: AIProviderConfig) {
    runTest(p.id, {
      type: p.provider_type,
      name: p.name,
      baseUrl: p.base_url ?? undefined,
      apiKey: p.api_key_encrypted ?? undefined,
      model: p.model_name ?? undefined,
      embeddingModel: p.embedding_model_name ?? undefined,
      temperature: p.temperature,
      maxTokens: p.max_tokens,
    })
  }

  function editProvider(p: AIProviderConfig) {
    setForm({
      id: p.id,
      name: p.name,
      provider_type: p.provider_type,
      base_url: p.base_url ?? '',
      api_key: p.api_key_encrypted ?? '',
      model_name: p.model_name ?? '',
      embedding_model_name: p.embedding_model_name ?? '',
      temperature: String(p.temperature ?? '0.2'),
      max_tokens: String(p.max_tokens ?? '4000'),
      enabled: p.enabled,
      is_default: p.is_default,
    })
    setSaveMsg(null)
    if (typeof window !== 'undefined') window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  function onSave(e: React.FormEvent) {
    e.preventDefault()
    setSaveMsg(null)
    const payload: ProviderInput = {
      id: form.id,
      name: form.name,
      provider_type: form.provider_type,
      base_url: form.base_url,
      api_key: form.api_key,
      model_name: form.model_name,
      embedding_model_name: form.embedding_model_name,
      temperature: form.temperature,
      max_tokens: form.max_tokens,
      enabled: form.enabled,
      is_default: form.is_default,
    }
    startSaving(async () => {
      const result = await saveProvider(payload)
      if (result.ok) {
        setSaveMsg({ ok: true, text: 'Provider gespeichert.' })
        setForm(emptyForm)
      } else {
        setSaveMsg({ ok: false, text: result.error })
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* ── Vorhandene Provider ────────────────────────────── */}
      {providers.length === 0 ? (
        <p className="text-sm text-white/50">
          Noch kein KI-Provider konfiguriert. Lege unten einen an, um lokale KI anzubinden.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {providers.map((p) => (
            <Card key={p.id} className="border-white/10 bg-white/[0.03]">
              <CardHeader className="space-y-2 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base text-white">{p.name}</CardTitle>
                  <div className="flex flex-wrap gap-1.5">
                    {p.is_default && (
                      <Badge
                        variant="outline"
                        className="border-[#0078FF]/40 bg-[#0078FF]/15 text-[#7FB4FF]"
                      >
                        Standard
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={cn(
                        p.enabled
                          ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                          : 'border-white/15 bg-white/5 text-white/50'
                      )}
                    >
                      {p.enabled ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-white/50">{PROVIDER_TYPE_LABELS[p.provider_type]}</p>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <dl className="space-y-1 text-white/70">
                  <div className="flex justify-between gap-3">
                    <dt className="text-white/40">Base URL</dt>
                    <dd className="truncate">{p.base_url ?? '—'}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-white/40">Modell</dt>
                    <dd className="truncate">{p.model_name ?? '—'}</dd>
                  </div>
                </dl>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={testing[p.id]}
                    onClick={() => testExisting(p)}
                    className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                  >
                    {testing[p.id] ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plug className="mr-2 h-4 w-4" />
                    )}
                    Verbindung testen
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editProvider(p)}
                    className="text-white/60 hover:text-white"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Bearbeiten
                  </Button>
                </div>

                {testError[p.id] && (
                  <p className="text-xs text-red-300" role="alert">
                    {testError[p.id]}
                  </p>
                )}
                {results[p.id] && <AIConnectionStatus result={results[p.id]} />}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Separator className="bg-white/10" />

      {/* ── Formular ───────────────────────────────────────── */}
      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="text-base text-white">
            {form.id ? 'Provider bearbeiten' : 'Provider hinzufügen'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSave} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white/80">
                  Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="z. B. LM Studio (lokal)"
                  className={inputCls}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Provider-Typ</Label>
                <Select
                  value={form.provider_type}
                  onValueChange={(v) => set('provider_type', v as ProviderType)}
                >
                  <SelectTrigger className={triggerCls}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(PROVIDER_TYPE_LABELS) as ProviderType[]).map((t) => (
                      <SelectItem key={t} value={t}>
                        {PROVIDER_TYPE_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="base_url" className="text-white/80">
                  Base URL
                </Label>
                <Input
                  id="base_url"
                  value={form.base_url}
                  onChange={(e) => set('base_url', e.target.value)}
                  placeholder={baseUrlPlaceholder(form.provider_type)}
                  className={inputCls}
                />
              </div>

              {form.provider_type === 'openai-compatible' && (
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="api_key" className="text-white/80">
                    API-Key
                  </Label>
                  <Input
                    id="api_key"
                    type="password"
                    value={form.api_key}
                    onChange={(e) => set('api_key', e.target.value)}
                    placeholder="local-not-required"
                    className={inputCls}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="model_name" className="text-white/80">
                  Modell
                </Label>
                <Input
                  id="model_name"
                  value={form.model_name}
                  onChange={(e) => set('model_name', e.target.value)}
                  placeholder="z. B. llama-3.1-8b-instruct"
                  className={inputCls}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="embedding_model_name" className="text-white/80">
                  Embedding-Modell
                </Label>
                <Input
                  id="embedding_model_name"
                  value={form.embedding_model_name}
                  onChange={(e) => set('embedding_model_name', e.target.value)}
                  placeholder="z. B. nomic-embed-text"
                  className={inputCls}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature" className="text-white/80">
                  Temperature
                </Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={form.temperature}
                  onChange={(e) => set('temperature', e.target.value)}
                  className={inputCls}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_tokens" className="text-white/80">
                  Max Tokens
                </Label>
                <Input
                  id="max_tokens"
                  type="number"
                  min="1"
                  value={form.max_tokens}
                  onChange={(e) => set('max_tokens', e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3">
                <Label htmlFor="enabled" className="text-white/80">
                  Aktiv
                </Label>
                <Switch
                  id="enabled"
                  checked={form.enabled}
                  onCheckedChange={(v) => set('enabled', v)}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3">
                <Label htmlFor="is_default" className="text-white/80">
                  Standard-Provider
                </Label>
                <Switch
                  id="is_default"
                  checked={form.is_default}
                  onCheckedChange={(v) => set('is_default', v)}
                />
              </div>
            </div>

            {/* Test der aktuellen (auch ungespeicherten) Konfiguration */}
            <div className="space-y-3 rounded-lg border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-white/80">Verbindung prüfen</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={testing['form']}
                  onClick={testForm}
                  className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                >
                  {testing['form'] ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plug className="mr-2 h-4 w-4" />
                  )}
                  Test AI Connection
                </Button>
              </div>
              {testError['form'] && (
                <p className="text-xs text-red-300" role="alert">
                  {testError['form']}
                </p>
              )}
              {results['form'] && <AIConnectionStatus result={results['form']} />}
            </div>

            {saveMsg && (
              <p
                className={cn('text-sm', saveMsg.ok ? 'text-emerald-300' : 'text-red-300')}
                role="alert"
              >
                {saveMsg.text}
              </p>
            )}

            <div className="flex items-center justify-end gap-2">
              {form.id && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setForm(emptyForm)
                    setSaveMsg(null)
                  }}
                  className="text-white/60 hover:text-white"
                >
                  Abbrechen
                </Button>
              )}
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#0078FF] text-white hover:bg-[#0067DB]"
              >
                {saving ? 'Wird gespeichert …' : 'Speichern'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// ── Inline: Verbindungsstatus-Anzeige ─────────────────────────
function CheckRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <li className="flex items-center gap-2">
      {ok ? (
        <Check className="h-4 w-4 text-emerald-400" />
      ) : (
        <X className="h-4 w-4 text-red-400" />
      )}
      <span className={ok ? 'text-white/70' : 'text-white/40'}>{label}</span>
    </li>
  )
}

function AIConnectionStatus({ result }: { result: AIConnectionTestResult }) {
  return (
    <div
      className={cn(
        'space-y-3 rounded-lg border p-3',
        result.ok
          ? 'border-emerald-500/40 bg-emerald-500/10'
          : 'border-red-500/40 bg-red-500/10'
      )}
      role="status"
    >
      <div className="flex items-start gap-2">
        {result.ok ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
        ) : (
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
        )}
        <div className="space-y-0.5">
          <p
            className={cn(
              'text-sm font-medium',
              result.ok ? 'text-emerald-200' : 'text-red-200'
            )}
          >
            {result.message}
          </p>
          {typeof result.latencyMs === 'number' && (
            <p className="text-xs text-white/40">Latenz: {result.latencyMs} ms</p>
          )}
        </div>
      </div>

      <ul className="space-y-1 text-xs">
        <CheckRow label="Server erreichbar" ok={result.checks.reachable} />
        <CheckRow label="Modell konfiguriert" ok={result.checks.modelConfigured} />
        <CheckRow label="Chat-Completion" ok={result.checks.chatCompletion} />
        {result.checks.embedding !== undefined && (
          <CheckRow label="Embedding" ok={result.checks.embedding} />
        )}
      </ul>

      {result.error && (
        <p className="text-xs leading-relaxed text-red-200/80">{result.error}</p>
      )}
    </div>
  )
}
