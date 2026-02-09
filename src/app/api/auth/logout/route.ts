import { NextResponse } from 'next/server';
import { clearUserSession } from '@/lib/auth/session';

export async function POST(request: Request) {
  await clearUserSession();

  const accept = request.headers.get('accept') ?? '';
  if (accept.includes('application/json')) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.redirect(new URL('/login', request.url));
}
