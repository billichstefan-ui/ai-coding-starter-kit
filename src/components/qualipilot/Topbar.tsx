'use client'

import { useState } from 'react'
import { LogOut, Circle } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { QP_BASE } from '@/lib/qualipilot/constants'

export function Topbar({ email, orgName }: { email: string; orgName: string }) {
  const [signingOut, setSigningOut] = useState(false)

  async function signOut() {
    setSigningOut(true)
    try {
      await createClient().auth.signOut()
    } catch {
      // ignore
    }
    window.location.href = `${QP_BASE}/login`
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-[#0A0F24]/60 px-6 backdrop-blur">
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-white">{orgName}</span>
        <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300 sm:inline-flex">
          <Circle className="h-2 w-2 fill-emerald-400 text-emerald-400" />
          GMP-Modus
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden text-sm text-white/50 sm:inline">{email}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          disabled={signingOut}
          className="text-white/60 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="mr-1.5 h-4 w-4" />
          {signingOut ? 'Abmelden…' : 'Abmelden'}
        </Button>
      </div>
    </header>
  )
}
