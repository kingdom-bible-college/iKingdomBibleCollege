import 'server-only';

import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import {
  createSession,
  deleteSessionByToken,
  getSessionWithUserByToken,
} from '@/db/queries/sessions';

const SESSION_COOKIE_NAME = 'kbc_session';
const SESSION_DAYS = 14;

export const createUserSession = async (userId: number) => {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await createSession({ userId, token, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });

  return token;
};

export const clearUserSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await deleteSessionByToken(token);
  }

  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
};

export const getSessionUser = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const result = await getSessionWithUserByToken(token);
  return result?.user ?? null;
});

export const requireUser = async () => {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  if (user.status !== 'approved') redirect('/login?status=pending');
  return user;
};

export const requireAdmin = async () => {
  const user = await requireUser();
  if (user.role !== 'admin') redirect('/courses');
  return user;
};
