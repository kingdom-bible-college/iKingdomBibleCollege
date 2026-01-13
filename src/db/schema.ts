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
