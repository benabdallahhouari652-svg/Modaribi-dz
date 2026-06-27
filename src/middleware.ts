import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected routes that require authentication
const protectedRoutes = [
  '/profile/edit',
  '/profile',
  '/messages',
  '/library/upload',
]

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtected && !session) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all protected routes:
     * - /profile, /profile/edit
     * - /messages
     * - /library/upload
     */
    '/profile/:path*',
    '/messages/:path*',
    '/library/upload/:path*',
  ],
}
