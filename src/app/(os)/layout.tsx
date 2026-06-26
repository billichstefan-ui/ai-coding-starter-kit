import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { AppShell } from '@/components/os/AppShell'

/**
 * (os) route group layout — server component.
 * Auth guard (defense-in-depth; middleware already guards non-/api routes):
 * reuse the existing server Supabase client and redirect to the existing
 * /login route when there is no session. Same idiom as actions/suggestions.ts.
 */
export default async function OsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return <AppShell>{children}</AppShell>
}
