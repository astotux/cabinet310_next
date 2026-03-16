import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminFromHeaders } from '@/lib/auth';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdminFromHeaders(request.headers)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const { name, phone, note } = await request.json();
  const client = await prisma.client.update({
    where: { id: parseInt(id) },
    data: { name, phone: phone || null, note: note || null },
  });
  return NextResponse.json(client);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdminFromHeaders(request.headers)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  await prisma.client.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
