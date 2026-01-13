import 'server-only';
import { db } from '@/db';
import { words } from '@/db/schema';
import { eq } from 'drizzle-orm';

// 전체 단어 조회
export async function getAllWords() {
  return db.select().from(words);
}

// 단일 단어 조회
export async function getWordById(id: number) {
  const result = await db.select().from(words).where(eq(words.id, id));
  return result[0] ?? null;
}

// 단어 생성
export async function createWord(term: string, definition: string, example?: string) {
  return db.insert(words).values({ term, definition, example }).returning();
}

// 단어 삭제
export async function deleteWord(id: number) {
  return db.delete(words).where(eq(words.id, id));
}