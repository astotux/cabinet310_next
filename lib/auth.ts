import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface JWTPayload {
  adminId: number;
  username: string;
}

/**
 * Хеширует пароль с использованием bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Проверяет соответствие пароля хешу
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Генерирует JWT токен для админа (Node.js runtime)
 */
export function generateToken(payload: JWTPayload, isMobile: boolean = false): string {
  const options: jwt.SignOptions = isMobile ? {} : { expiresIn: JWT_EXPIRES_IN as any };
  return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Проверяет и декодирует JWT токен (Node.js runtime)
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    console.error('JWT verification failed:', error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Проверяет и декодирует JWT токен (Edge runtime compatible)
 */
export async function verifyTokenEdge(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    return {
      adminId: payload.adminId as number,
      username: payload.username as string,
    };
  } catch (error) {
    console.error('JWT verification failed (Edge):', error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Извлекает токен из заголовков или cookies
 */
export function extractToken(
  authHeader?: string | null,
  cookieToken?: string | null
): string | null {
  // Проверяем Bearer токен в заголовке
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Проверяем токен в cookie
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}

/**
 * Проверяет, является ли пользователь админом по токену из заголовков
 */
export async function isAdminFromHeaders(headers: Headers): Promise<boolean> {
  try {
    const adminId = headers.get('x-admin-id');
    const adminUsername = headers.get('x-admin-username');

    // Если заголовки установлены middleware, значит пользователь админ
    return !!(adminId && adminUsername);
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}
