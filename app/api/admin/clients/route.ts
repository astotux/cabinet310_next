import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminFromHeaders } from '@/lib/auth';

export async function GET(request: NextRequest) {
  if (!await isAdminFromHeaders(request.headers)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const clients = await prisma.client.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json(clients);
}

export async function POST(request: NextRequest) {
  if (!await isAdminFromHeaders(request.headers)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { name, phone, vk, note } = await request.json();
  if (!name) return NextResponse.json({ error: 'Имя обязательно' }, { status: 400 });
  const client = await prisma.client.create({ data: { name, phone: phone || null, vk: vk || null, note: note || null } });
  return NextResponse.json(client, { status: 201 });
}
