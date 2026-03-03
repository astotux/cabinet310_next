import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyTokenEdge, extractToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  // Защита админ-панели
  if (request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    
    // Извлекаем токен из cookie или заголовка
    const cookieToken = request.cookies.get('adminToken')?.value
    const authHeader = request.headers.get('authorization')
    const token = extractToken(authHeader, cookieToken)
    
    // Проверяем наличие и валидность токена
    if (!token) {
      console.log('[Middleware] No token found, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Верифицируем JWT токен (Edge-совместимая версия)
    const payload = await verifyTokenEdge(token)
    
    if (!payload) {
      // Токен невалиден или истек - удаляем cookie и редиректим
      console.log('[Middleware] Invalid token, redirecting to login');
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('adminToken')
      return response
    }

    // Токен валиден - добавляем информацию об админе в заголовки
    console.log('[Middleware] Valid token for admin:', payload.username);
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-admin-id', payload.adminId.toString())
    requestHeaders.set('x-admin-username', payload.username)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
