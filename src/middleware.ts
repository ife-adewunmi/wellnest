import { NextRequest, NextResponse } from 'next/server'
import { Endpoints } from './shared/enums/endpoints'

// Routes that require authentication
const PROTECTED_ROUTES = [
  Endpoints.COUNSELORS.DASHBOARD,
  Endpoints.COUNSELORS.MANAGE_STUDENT,
  Endpoints.STUDENTS.DASHBOARD,
  '/profile',
  '/settings',
]

// Routes that should redirect authenticated users
const AUTH_ROUTES = [
  Endpoints.AUTH_PAGE.SIGNIN,
  Endpoints.AUTH_PAGE.SIGNUP,
]

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/about', '/contact', '/help', '/privacy', '/terms']

const isProtectedRoute = (pathname: string): boolean => {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route))
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(route => pathname === route)
}

const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.some(route => pathname === route) ||
         pathname.startsWith('/api/') ||
         pathname.startsWith('/_next/') ||
         pathname.startsWith('/favicon') ||
         pathname.includes('.')
}

// Simplified session check - just verify token exists
// Actual validation happens client-side and in API routes
const hasSessionToken = (request: NextRequest): boolean => {
  const sessionToken = request.cookies.get('session-token')?.value
  return !!sessionToken
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public routes and API routes (except auth check)
  if (isPublicRoute(pathname) && !isAuthRoute(pathname)) {
    return NextResponse.next()
  }

  const isAuthenticated = hasSessionToken(request)

  // Handle protected routes
  if (isProtectedRoute(pathname)) {
    if (!isAuthenticated) {
      // Redirect unauthenticated users to signin
      const url = request.nextUrl.clone()
      url.pathname = Endpoints.AUTH_PAGE.SIGNIN
      url.searchParams.set('redirect', pathname) // Store intended destination
      return NextResponse.redirect(url)
    }
    
    return NextResponse.next()
  }

  // Handle auth routes (signin, signup)
  if (isAuthRoute(pathname)) {
    if (isAuthenticated) {
      // Redirect authenticated users away from auth pages
      const url = request.nextUrl.clone()
      
      // Check for a redirect parameter first
      const redirectTo = request.nextUrl.searchParams.get('redirect')
      if (redirectTo && redirectTo.startsWith('/') && isProtectedRoute(redirectTo)) {
        url.pathname = redirectTo
        url.searchParams.delete('redirect')
      } else {
        // Default redirect to dashboard (role-based routing will handle the final destination)
        url.pathname = Endpoints.COUNSELORS.DASHBOARD
      }
      
      return NextResponse.redirect(url)
    }
    
    return NextResponse.next()
  }

  // Default behavior for other routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
