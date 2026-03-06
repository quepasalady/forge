import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { session } } = await supabase.auth.getSession()

  const path = req.nextUrl.pathname

  // Routes protégées — redirige vers /login si pas connecté
  const protectedRoutes = ['/dashboard', '/workouts', '/nutrition', '/progress', '/settings', '/subscription', '/coach']
  const isProtected = protectedRoutes.some(r => path.startsWith(r))

  if (isProtected && !session) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(redirectUrl)
  }

  // Routes coach — vérifie le rôle
  if (path.startsWith('/coach') && session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'coach') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // Si déjà connecté, redirige depuis les pages auth
  const authRoutes = ['/login', '/signup']
  if (authRoutes.includes(path) && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook).*)',
  ],
}
