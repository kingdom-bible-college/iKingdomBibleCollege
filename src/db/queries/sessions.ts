import 'server-only';

import { and, eq, gt } from 'drizzle-orm';
import { db } from '../index';
import { sessions, users, type NewSession } from '../schema';

export async function createSession(data: NewSession) {
  const result = await db.insert(sessions).values(data).returning();
  return result[0];
}

export async function getSessionByToken(token: string) {
  const result = await db.select().from(sessions).where(eq(sessions.token, token));
  return result[0] ?? null;
}

export async function getSessionWithUserByToken(token: string) {
  const result = await db
    .select({ session: sessions, user: users })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
    .limit(1);

  return result[0] ?? null;
}

export async function deleteSessionByToken(token: string) {
  const result = await db.delete(sessions).where(eq(sessions.token, token)).returning();
  return result[0] ?? null;
}
