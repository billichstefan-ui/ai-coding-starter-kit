import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const path = request.nextUrl.pathname
  const isQualiPilot = path.startsWith('/qualipilot')

  // Öffentliche Seiten: Company-OS-Login + QualiPilots eigener Login/Registrierung.
  const publicPaths = ['/login', '/qualipilot/login', '/qualipilot/register']
  const isPublic = publicPaths.includes(path)

  // Ziel-Login je nach Produkt.
  const loginTarget = isQualiPilot ? '/qualipilot/login' : '/login'

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Supabase nicht erreichbar — kein White Screen erzwingen.
    // Öffentliche Seiten normal weitermachen; geschützte Seiten zum Login leiten.
    if (!isPublic) {
      const url = request.nextUrl.clone()
      url.pathname = loginTarget
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = loginTarget
    return NextResponse.redirect(url)
  }

  // Eingeloggte Nutzer von der Login-Seite wegleiten (Registrierung bleibt für
  // das QualiPilot-Onboarding erreichbar).
  if (user && path === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }
  if (user && path === '/qualipilot/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/qualipilot/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  // /api ausgenommen: API-Routen machen eigene Auth (Session ODER Cron-Secret).
  // Ein Redirect zu /login würde den Vercel-Cron blockieren, der nie Cookies hat.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
