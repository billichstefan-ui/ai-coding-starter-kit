'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { QP_BASE } from '@/lib/qualipilot/constants'

export default function QualiPilotLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
        return
      }
      if (data.session) {
        window.location.href = `${QP_BASE}/dashboard`
        return
      }
      setError('Anmeldung fehlgeschlagen.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-white/10 bg-white/[0.03]">
      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80">E-Mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/80">Passwort</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>

          {error && (
            <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0078FF] text-white hover:bg-[#0067DB]"
          >
            {loading ? 'Anmelden…' : 'Anmelden'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          Noch kein Konto?{' '}
          <Link href={`${QP_BASE}/register`} className="text-[#38E5FF] hover:underline">
            Registrieren
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
