import 'server-only';

import { eq } from 'drizzle-orm';
import { db } from '../index';
import { users, type NewUser } from '../schema';

// DAL 패턴: 재사용 가능한 쿼리 함수들

export async function getAllUsers() {
  return db.select().from(users);
}

export async function getUserById(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0] ?? null;
}

export async function getUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0] ?? null;
}

export async function createUser(data: NewUser) {
  const result = await db.insert(users).values(data).returning();
  return result[0];
}

export async function updateUser(id: number, data: Partial<NewUser>) {
  const result = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return result[0] ?? null;
}

export async function deleteUser(id: number) {
  const result = await db.delete(users).where(eq(users.id, id)).returning();
  return result[0] ?? null;
}
