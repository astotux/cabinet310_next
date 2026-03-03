import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Выход выполнен успешно' });
  
  // Удаляем cookie с токеном
  response.cookies.set('adminToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/'
  });
  
  return response;
}
