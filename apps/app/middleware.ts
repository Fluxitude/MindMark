import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Simple in-memory rate limiting (FREE solution)
const rateLimitMap = new Map<string, number[]>()

function rateLimit(ip: string, limit = 50, window = 60000): boolean {
  const now = Date.now()
  const windowStart = now - window
  
  const requests = rateLimitMap.get(ip) || []
  const validRequests = requests.filter(time => time > windowStart)
  
  if (validRequests.length >= limit) {
    return false
  }
  
  validRequests.push(now)
  rateLimitMap.set(ip, validRequests)
  
  // Cleanup old entries to prevent memory leaks
  if (rateLimitMap.size > 10000) {
    const cutoff = now - window * 2
    const entries = Array.from(rateLimitMap.entries())
    for (const [key, times] of entries) {
      const validTimes = times.filter(time => time > cutoff)
      if (validTimes.length === 0) {
        rateLimitMap.delete(key)
      } else {
        rateLimitMap.set(key, validTimes)
      }
    }
  }
  
  return true
}

export async function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ??
             request.headers.get('x-real-ip') ??
             '127.0.0.1'
  const pathname = request.nextUrl.pathname
  
  // Rate limiting for API routes (FREE protection against abuse)
  if (pathname.startsWith('/api/')) {
    // More restrictive rate limiting for API routes
    if (!rateLimit(ip, 30, 60000)) {
      return new Response(JSON.stringify({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: 60
      }), {
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Limit': '30',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(Date.now() / 1000) + 60),
          'Content-Type': 'application/json'
        }
      })
    }
  }

  let response = NextResponse.next()

  // FREE Security Headers (Critical protection)
  const securityHeaders = {
    // Prevent clickjacking attacks
    'X-Frame-Options': 'DENY',
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Control referrer information
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // XSS protection (legacy but still useful)
    'X-XSS-Protection': '1; mode=block',
    
    // Force HTTPS in production
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    
    // Limit browser features
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    
    // Content Security Policy (basic but effective)
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://va.vercel-scripts.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
  }

  // Apply security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Auth handling for protected routes
  if (pathname.startsWith('/dashboard') || 
      (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/'))) {
    
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                request.cookies.set(name, value)
                response.cookies.set(name, value, options)
              })
            },
          },
        }
      )

      const { data: { user } } = await supabase.auth.getUser()
      
      // Redirect to login if not authenticated (dashboard routes)
      if (!user && pathname.startsWith('/dashboard')) {
        const loginUrl = new URL('/auth/login', request.url)
        loginUrl.searchParams.set('redirectTo', pathname)
        return NextResponse.redirect(loginUrl)
      }
      
      // Return 401 for API routes if not authenticated
      if (!user && pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
        return new Response(JSON.stringify({ 
          error: 'Unauthorized',
          message: 'Authentication required'
        }), { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }
    } catch (error) {
      console.error('Middleware auth error:', error)
      
      // On auth error, redirect to login for dashboard routes
      if (pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
      
      // Return 500 for API routes on auth error
      if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
        return new Response(JSON.stringify({ 
          error: 'Internal Server Error',
          message: 'Authentication service unavailable'
        }), { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
