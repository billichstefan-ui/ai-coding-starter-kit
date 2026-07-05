'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { saveOrganization } from '../actions'

export function OrgForm({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName)
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    startTransition(async () => {
      const result = await saveOrganization(name)
      if (result.ok) {
        setMsg({ ok: true, text: 'Organisation gespeichert.' })
      } else {
        setMsg({ ok: false, text: result.error })
      }
    })
  }

  return (
    <Card className="border-white/10 bg-white/[0.03]">
      <CardHeader>
        <CardTitle className="text-base text-white">Organisation umbenennen</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="org_name" className="text-white/80">
              Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="org_name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>

          {msg && (
            <p
              className={cn('text-sm', msg.ok ? 'text-emerald-300' : 'text-red-300')}
              role="alert"
            >
              {msg.text}
            </p>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={pending || name.trim() === initialName.trim()}
              className="bg-[#0078FF] text-white hover:bg-[#0067DB]"
            >
              {pending ? 'Wird gespeichert …' : 'Speichern'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
