import { createClient } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // Protected paths that require authentication
  const protectedPaths = ['/dashboard', '/projects', '/assessment', '/roadmap', '/chat', '/admin']
  const authPaths = ['/login', '/register']
  const { pathname } = request.nextUrl

  // Check if current path is protected
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path))
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path))

  // Get NextAuth token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Redirect authenticated users away from auth pages
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect unauthenticated users from protected pages
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // For API routes, also check Supabase session
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    try {
      const { supabase, response } = createClient(request)
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // You can add additional Supabase-specific checks here
      return response
    } catch (error) {
      console.error('Middleware Supabase error:', error)
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/projects/:path*',
    '/assessment/:path*',
    '/roadmap/:path*',
    '/chat/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/api/:path*',
  ],
}
