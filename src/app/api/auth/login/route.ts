import { NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validations/auth';
import { getUserByEmail } from '@/db/queries/users';
import { verifyPassword } from '@/lib/auth/password';
import { createUserSession } from '@/lib/auth/session';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;
  const user = await getUserByEmail(email);

  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
  }

  if (user.status !== 'approved') {
    return NextResponse.json({ error: '승인 대기 중입니다.' }, { status: 403 });
  }

  await createUserSession(user.id);

  return NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
}
