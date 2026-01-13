import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

// 예시 테이블: users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 타입 추출 (Drizzle 자동 생성 타입 활용)
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// 단어 테이블
export const words = pgTable('words', {
  id: serial('id').primaryKey(),
  term: varchar('term', { length: 255 }).notNull(),
  definition: text('definition').notNull(),
  example: text('example'),
  category: varchar('category', { length: 50 }).default('기타'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 타입 추출
export type Word = typeof words.$inferSelect;
export type NewWord = typeof words.$inferInsert;

