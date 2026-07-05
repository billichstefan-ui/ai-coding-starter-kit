'use client'

import { useState, useTransition } from 'react'
import { PageHeader } from '@/components/qualipilot/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
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
import {
  GAMP_CATEGORIES,
  GMP_RELEVANCE,
  RISK_CLASSES,
  PROJECT_STATUS_LABELS,
  RISK_CLASS_LABELS,
} from '@/lib/qualipilot/constants'
import type { ProjectStatus } from '@/lib/qualipilot/types'
import { createProject, type ProjectInput } from '../actions'

const triggerCls = 'border-white/15 bg-white/5 text-white'

const initialState: ProjectInput = {
  name: '',
  customer: '',
  site: '',
  system_name: '',
  system_description: '',
  gmp_relevance: '',
  gamp_category: '',
  risk_class: '',
  status: 'draft',
  start_date: '',
  target_date: '',
}

export default function NewProjectPage() {
  const [form, setForm] = useState<ProjectInput>(initialState)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function set<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await createProject(form)
      // Bei Erfolg redirectet die Server-Action; hier kommen wir nur bei Fehlern an.
      if (result && !result.ok) {
        setError(result.error || 'Projekt konnte nicht angelegt werden')
      }
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Neues Projekt" description="GMP-Qualifizierungsprojekt anlegen" />

      <Card className="border-white/10 bg-white/[0.03]">
        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name" className="text-white/80">
                  Projektname <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  required
                  value={form.name ?? ''}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="z. B. Qualifizierung LIMS-System"
                  className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer" className="text-white/80">
                  Kunde
                </Label>
                <Input
                  id="customer"
                  value={form.customer ?? ''}
                  onChange={(e) => set('customer', e.target.value)}
                  className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site" className="text-white/80">
                  Standort
                </Label>
                <Input
                  id="site"
                  value={form.site ?? ''}
                  onChange={(e) => set('site', e.target.value)}
                  className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="system_name" className="text-white/80">
                  System-Name
                </Label>
                <Input
                  id="system_name"
                  value={form.system_name ?? ''}
                  onChange={(e) => set('system_name', e.target.value)}
                  className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="system_description" className="text-white/80">
                  Systembeschreibung
                </Label>
                <Textarea
                  id="system_description"
                  rows={4}
                  value={form.system_description ?? ''}
                  onChange={(e) => set('system_description', e.target.value)}
                  className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">GMP-Relevanz</Label>
                <Select
                  value={form.gmp_relevance || undefined}
                  onValueChange={(v) => set('gmp_relevance', v)}
                >
                  <SelectTrigger className={triggerCls}>
                    <SelectValue placeholder="Auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {GMP_RELEVANCE.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">GAMP-Kategorie</Label>
                <Select
                  value={form.gamp_category || undefined}
                  onValueChange={(v) => set('gamp_category', v)}
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

              <div className="space-y-2">
                <Label className="text-white/80">Risikoklasse</Label>
                <Select
                  value={form.risk_class || undefined}
                  onValueChange={(v) => set('risk_class', v)}
                >
                  <SelectTrigger className={triggerCls}>
                    <SelectValue placeholder="Auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {RISK_CLASSES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {RISK_CLASS_LABELS[r]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => set('status', v as ProjectStatus)}
                >
                  <SelectTrigger className={triggerCls}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {PROJECT_STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date" className="text-white/80">
                  Startdatum
                </Label>
                <Input
                  id="start_date"
                  type="date"
                  value={form.start_date ?? ''}
                  onChange={(e) => set('start_date', e.target.value)}
                  className="border-white/15 bg-white/5 text-white [color-scheme:dark]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_date" className="text-white/80">
                  Zieltermin
                </Label>
                <Input
                  id="target_date"
                  type="date"
                  value={form.target_date ?? ''}
                  onChange={(e) => set('target_date', e.target.value)}
                  className="border-white/15 bg-white/5 text-white [color-scheme:dark]"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-300" role="alert">
                {error}
              </p>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={pending}
                className="bg-[#0078FF] text-white hover:bg-[#0067DB]"
              >
                {pending ? 'Wird angelegt …' : 'Projekt anlegen'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
