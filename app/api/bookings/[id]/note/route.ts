import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminFromHeaders } from '@/lib/auth';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdminFromHeaders(request.headers)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const { adminNote } = await request.json();
  const booking = await prisma.booking.update({
    where: { id: parseInt(id) },
    data: { adminNote: adminNote || null },
  });
  return NextResponse.json(booking);
}
