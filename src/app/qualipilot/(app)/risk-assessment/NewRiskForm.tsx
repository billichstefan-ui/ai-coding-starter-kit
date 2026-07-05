'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { computeRpn, riskClassForRpn, requiresRecommendedAction } from '@/lib/qualipilot/fmea'
import { RISK_CLASS_LABELS, RISK_STATUS_LABELS } from '@/lib/qualipilot/constants'
import type { RiskClass, RiskStatus } from '@/lib/qualipilot/types'
import { createRisk } from './actions'

interface Project {
  id: string
  name: string
}

const INPUT_CLS = 'border-white/15 bg-white/5 text-white placeholder:text-white/30'
const TRIGGER_CLS = 'border-white/15 bg-white/5 text-white'
const SOD_RANGE = Array.from({ length: 10 }, (_, i) => i + 1)

const CLASS_TONE: Record<RiskClass, string> = {
  low: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
  medium: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
  high: 'border-red-500/40 bg-red-500/15 text-red-300',
  critical: 'border-red-500/50 bg-red-500/20 text-red-200 font-semibold',
}

const STATUS_OPTIONS = Object.keys(RISK_STATUS_LABELS) as RiskStatus[]

const emptyForm = {
  project_id: '',
  process_step: '',
  function: '',
  failure_mode: '',
  failure_effect: '',
  failure_cause: '',
  existing_control: '',
  severity: '5',
  occurrence: '5',
  detection: '5',
  recommended_action: '',
  status: 'open' as RiskStatus,
}

export function NewRiskForm({ projects }: { projects: Project[] }) {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const set = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    setSuccess(false)
  }

  const s = Number(form.severity)
  const o = Number(form.occurrence)
  const d = Number(form.detection)
  const rpn = useMemo(() => computeRpn(s, o, d), [s, o, d])
  const riskClass = useMemo(() => riskClassForRpn(rpn), [rpn])

  const actionMissing =
    requiresRecommendedAction(riskClass) && form.recommended_action.trim() === ''

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    if (actionMissing) {
      setError('Kritische Risiken benötigen eine empfohlene Maßnahme')
      return
    }
    setLoading(true)
    try {
      const res = await createRisk({
        project_id: form.project_id,
        process_step: form.process_step,
        function: form.function,
        failure_mode: form.failure_mode,
        failure_effect: form.failure_effect,
        failure_cause: form.failure_cause,
        existing_control: form.existing_control,
        severity: form.severity,
        occurrence: form.occurrence,
        detection: form.detection,
        recommended_action: form.recommended_action,
        status: form.status,
      })
      if (!res.ok) {
        setError(res.error)
        return
      }
      setForm(emptyForm)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label className="text-white/80">Projekt</Label>
          <Select
            value={form.project_id}
            onValueChange={(v) => set('project_id', v)}
          >
            <SelectTrigger className={TRIGGER_CLS}>
              <SelectValue placeholder="Projekt wählen (optional)" />
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
          <Label htmlFor="process_step" className="text-white/80">Prozessschritt</Label>
          <Input
            id="process_step"
            value={form.process_step}
            onChange={(e) => set('process_step', e.target.value)}
            className={INPUT_CLS}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="function" className="text-white/80">Funktion</Label>
          <Input
            id="function"
            value={form.function}
            onChange={(e) => set('function', e.target.value)}
            className={INPUT_CLS}
          />
        </div>

        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
          <Label htmlFor="failure_mode" className="text-white/80">
            Fehlermodus <span className="text-red-400">*</span>
          </Label>
          <Input
            id="failure_mode"
            required
            value={form.failure_mode}
            onChange={(e) => set('failure_mode', e.target.value)}
            className={INPUT_CLS}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="failure_effect" className="text-white/80">Fehlerauswirkung</Label>
          <Input
            id="failure_effect"
            value={form.failure_effect}
            onChange={(e) => set('failure_effect', e.target.value)}
            className={INPUT_CLS}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="failure_cause" className="text-white/80">Fehlerursache</Label>
          <Input
            id="failure_cause"
            value={form.failure_cause}
            onChange={(e) => set('failure_cause', e.target.value)}
            className={INPUT_CLS}
          />
        </div>

        <div className="space-y-2 sm:col-span-2 lg:col-span-3">
          <Label htmlFor="existing_control" className="text-white/80">
            Bestehende Kontrolle
          </Label>
          <Input
            id="existing_control"
            value={form.existing_control}
            onChange={(e) => set('existing_control', e.target.value)}
            className={INPUT_CLS}
          />
        </div>
      </div>

      {/* S / O / D + Live-RPN */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(
          [
            ['severity', 'Severity (S)'],
            ['occurrence', 'Occurrence (O)'],
            ['detection', 'Detection (D)'],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="space-y-2">
            <Label className="text-white/80">{label}</Label>
            <Select value={form[key]} onValueChange={(v) => set(key, v)}>
              <SelectTrigger className={TRIGGER_CLS}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOD_RANGE.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        <div className="space-y-2">
          <Label className="text-white/80">RPN = S×O×D</Label>
          <div
            className={cn(
              'flex h-10 items-center justify-between gap-2 rounded-md border px-3 text-sm',
              riskClass ? CLASS_TONE[riskClass] : 'border-white/15 bg-white/5 text-white/60'
            )}
          >
            <span className="font-mono text-base font-semibold">{rpn ?? '—'}</span>
            <span>{riskClass ? RISK_CLASS_LABELS[riskClass] : '—'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="recommended_action" className="text-white/80">
          Empfohlene Maßnahme
          {requiresRecommendedAction(riskClass) && <span className="text-red-400"> *</span>}
        </Label>
        <Textarea
          id="recommended_action"
          rows={3}
          value={form.recommended_action}
          onChange={(e) => set('recommended_action', e.target.value)}
          className={INPUT_CLS}
          placeholder="Maßnahme zur Risikominderung…"
        />
        {actionMissing && (
          <p className="flex items-center gap-2 text-sm text-red-300">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Kritische Risiken benötigen eine empfohlene Maßnahme
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label className="text-white/80">Status</Label>
          <Select value={form.status} onValueChange={(v) => set('status', v as RiskStatus)}>
            <SelectTrigger className={TRIGGER_CLS}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((st) => (
                <SelectItem key={st} value={st}>
                  {RISK_STATUS_LABELS[st]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          Risiko erfolgreich erfasst.
        </p>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading || actionMissing}
          className="bg-[#0078FF] text-white hover:bg-[#0067DB]"
        >
          {loading ? 'Speichern…' : 'Risiko erfassen'}
        </Button>
      </div>
    </form>
  )
}
