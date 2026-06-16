'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setError('E-Mail oder Passwort ungültig.')
        return
      }

      if (data.session) {
        window.location.href = '/dashboard'
      }
    } catch {
      setError('Verbindungsfehler. Bitte versuche es erneut.')
    } finally {
      setLoading(false)
    }
  }

  const isDisabled = !email || !password || loading

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: '#070B1E', fontFamily: 'var(--font-sora), sans-serif' }}
    >
      {/* Neon splatter background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            'radial-gradient(420px circle at 18% 22%, rgba(56,229,255,0.16), transparent 60%),' +
            'radial-gradient(380px circle at 82% 28%, rgba(255,45,156,0.16), transparent 60%),' +
            'radial-gradient(360px circle at 70% 88%, rgba(166,255,60,0.12), transparent 60%)',
        }}
      />

      <div className="relative z-10 w-full max-w-[420px]">
        <div
          className="rounded-2xl border p-10"
          style={{ background: '#0E1430', borderColor: '#1C2340' }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Image
              src="/brand/kicasso-mascot.png"
              alt="KIcasso"
              width={72}
              height={72}
              priority
              className="mx-auto mb-3"
            />
            <div className="text-3xl font-extrabold tracking-[1px] mb-1">
              <span style={{ color: '#38E5FF', textShadow: '0 0 7px #38E5FF, 0 0 18px rgba(56,229,255,0.6)' }}>KI</span>
              <span style={{ color: '#FF2D9C', textShadow: '0 0 7px #FF2D9C, 0 0 18px rgba(255,45,156,0.6)' }}>casso</span>
            </div>
            <div className="text-[10px] tracking-[3px] uppercase" style={{ color: '#A6FF3C' }}>
              Intelligence · Compliance · Impact
            </div>
          </div>

          {/* NORA badge */}
          <div className="flex justify-center mb-6">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs"
              style={{ background: '#38E5FF12', borderColor: '#38E5FF40', color: '#38E5FF' }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: '#A6FF3C', boxShadow: '0 0 6px #A6FF3C' }}
              />
              NORA ist bereit
            </div>
          </div>

          <p className="text-center text-sm mb-8" style={{ color: '#8892B0' }}>
            Melde dich an, um deine täglichen BizDev-Vorschläge zu sehen.
          </p>

          {error && (
            <Alert
              className="mb-4 border"
              style={{ background: '#FF3D7118', borderColor: '#FF3D7144', color: '#FF8FA3' }}
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-[11px] tracking-widest uppercase"
                style={{ color: '#3D4A6B' }}
              >
                E-Mail
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="stefan@kicasso.ai"
                required
                autoComplete="email"
                className="border text-white placeholder:text-[#3D4A6B] focus-visible:ring-1 focus-visible:ring-[#38E5FF] focus-visible:ring-offset-0"
                style={{ background: '#070B1E', borderColor: '#1C2340' }}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-[11px] tracking-widest uppercase"
                style={{ color: '#3D4A6B' }}
              >
                Passwort
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="border text-white placeholder:text-[#3D4A6B] focus-visible:ring-1 focus-visible:ring-[#38E5FF] focus-visible:ring-offset-0"
                style={{ background: '#070B1E', borderColor: '#1C2340' }}
              />
            </div>

            <Button
              type="submit"
              disabled={isDisabled}
              className="w-full mt-2 font-bold tracking-wider border-0 transition-opacity hover:opacity-90"
              style={{
                background: isDisabled
                  ? '#1C2340'
                  : 'linear-gradient(135deg, #38E5FF, #FF2D9C)',
                color: isDisabled ? '#3D4A6B' : '#070B1E',
                boxShadow: isDisabled ? 'none' : '0 0 18px rgba(56,229,255,0.35)',
              }}
            >
              {loading ? 'Anmelden…' : 'Anmelden'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
