import { NextResponse } from 'next/server';
import { signupSchema } from '@/lib/validations/auth';
import { getUserByEmail, createUser } from '@/db/queries/users';
import { hashPassword } from '@/lib/auth/password';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;
  const existing = await getUserByEmail(email);
  if (existing) {
    return NextResponse.json(
      { error: '이미 사용 중인 이메일입니다.' },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser({
    name,
    email,
    passwordHash,
    status: 'pending',
    role: 'member',
  });

  return NextResponse.json({ ok: true, userId: user.id });
}
