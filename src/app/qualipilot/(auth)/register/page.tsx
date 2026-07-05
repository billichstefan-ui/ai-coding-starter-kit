'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { QP_BASE } from '@/lib/qualipilot/constants'
import { registerAction, onboardAction } from '../actions'

function RegisterForm() {
  const params = useSearchParams()
  const onboarding = params.get('onboarding') === '1'

  const [fullName, setFullName] = useState('')
  const [orgName, setOrgName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (onboarding) {
        const res = await onboardAction({ fullName, orgName })
        if (!res.ok) {
          setError(res.error)
          return
        }
        window.location.href = `${QP_BASE}/dashboard`
        return
      }

      const res = await registerAction({ fullName, orgName, email, password })
      if (!res.ok) {
        setError(res.error)
        return
      }
      // Registrierung ok → direkt anmelden.
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error || !data.session) {
        // Konto angelegt, aber Auto-Login schlug fehl → zum Login schicken.
        window.location.href = `${QP_BASE}/login`
        return
      }
      window.location.href = `${QP_BASE}/dashboard`
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-white/10 bg-white/[0.03]">
      <CardContent className="pt-6">
        {onboarding && (
          <p className="mb-4 rounded-md border border-[#0078FF]/40 bg-[#0078FF]/10 px-3 py-2 text-sm text-[#7FB4FF]">
            Dein Konto hat noch keine QualiPilot-Organisation. Lege sie jetzt an.
          </p>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-white/80">Vollständiger Name</Label>
            <Input
              id="fullName"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="orgName" className="text-white/80">Organisation</Label>
            <Input
              id="orgName"
              required
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>

          {!onboarding && (
            <>
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
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
                />
              </div>
            </>
          )}

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
            {loading
              ? 'Bitte warten…'
              : onboarding
                ? 'Organisation anlegen'
                : 'Konto erstellen'}
          </Button>
        </form>

        {!onboarding && (
          <p className="mt-6 text-center text-sm text-white/50">
            Schon registriert?{' '}
            <Link href={`${QP_BASE}/login`} className="text-[#38E5FF] hover:underline">
              Anmelden
            </Link>
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default function QualiPilotRegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  )
}
