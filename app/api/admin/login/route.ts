import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Валидация входных данных
    if (!username || !password) {
      return NextResponse.json(
        { error: "Логин и пароль обязательны" },
        { status: 400 }
      );
    }

    console.log('[Login] Attempting login for:', username);

    // Поиск админа по username или email
    const admin = await prisma.admin.findFirst({
      where: {
        OR: [
          { username: username },
          { email: username }
        ]
      },
    });

    // Проверка существования админа и пароля
    if (!admin) {
      console.log('[Login] Admin not found:', username);
      return NextResponse.json(
        { error: "Неверные данные" },
        { status: 401 }
      );
    }

    console.log('[Login] Admin found, verifying password...');

    // Проверка пароля с использованием bcrypt
    const isPasswordValid = await verifyPassword(password, admin.password);
    
    if (!isPasswordValid) {
      console.log('[Login] Invalid password for:', username);
      return NextResponse.json(
        { error: "Неверные данные" },
        { status: 401 }
      );
    }

    console.log('[Login] Password valid, generating token...');

    // Генерация JWT токена
    const token = generateToken({
      adminId: admin.id,
      username: admin.username,
    });

    console.log('[Login] Token generated, setting cookie...');
    
    // Создаем ответ с токеном
    const response = NextResponse.json({ 
      token, 
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      }
    });
    
    // Устанавливаем httpOnly cookie для дополнительной безопасности
    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Изменено с strict на lax для совместимости
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      path: '/'
    });

    console.log('[Login] Login successful for:', username);

    return response;
  } catch (error) {
    console.error('[Login] Login error:', error);
    return NextResponse.json(
      { error: "Ошибка авторизации" },
      { status: 500 }
    );
  }
}
