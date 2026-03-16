import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyTokenEdge, extractToken } from '@/lib/auth'

const ALLOWED_ORIGINS = [
  'https://cabinet310.ru',
  'http://localhost:3000',
  'http://localhost:5173',
  'capacitor://localhost',
  'https://localhost',
  'http://localhost',
]

function setCorsHeaders(response: NextResponse, origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  response.headers.set('Access-Control-Allow-Origin', allowed)
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  return response
}

export async function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return setCorsHeaders(new NextResponse(null, { status: 204 }), origin)
  }

  // Защита админ-панели и добавление заголовков для API
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin') && 
                      !request.nextUrl.pathname.startsWith('/admin/secure-entry');
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  
  if (isAdminPage || isApiRoute) {
    // Извлекаем токен из cookie или заголовка
    const cookieToken = request.cookies.get('adminToken')?.value
    const authHeader = request.headers.get('authorization')
    const token = extractToken(authHeader, cookieToken)
    
    // Для админ-страниц требуем токен
    if (isAdminPage && !token) {
      console.log('[Middleware] No token found, showing 404');
      return NextResponse.rewrite(new URL('/not-found', request.url))
    }

    // Если токен есть, верифицируем его
    if (token) {
      const payload = await verifyTokenEdge(token)
      
      if (!payload && isAdminPage) {
        // Токен невалиден для админ-страницы - удаляем cookie и показываем 404
        console.log('[Middleware] Invalid token, showing 404');
        const response = NextResponse.rewrite(new URL('/not-found', request.url))
        response.cookies.delete('adminToken')
        return response
      }

      if (payload) {
        // Токен валиден - добавляем информацию об админе в заголовки
        console.log('[Middleware] Valid token for admin:', payload.username, 'path:', request.nextUrl.pathname);
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-admin-id', payload.adminId.toString())
        requestHeaders.set('x-admin-username', payload.username)

        const response = NextResponse.next({
          request: { headers: requestHeaders },
        })
        if (isApiRoute) setCorsHeaders(response, origin)
        return response
      }
    }
  }

  const response = NextResponse.next()
  if (isApiRoute) setCorsHeaders(response, origin)
  return response
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
}
