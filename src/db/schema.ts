import { pgTable, serial, text, timestamp, varchar, integer } from 'drizzle-orm/pg-core';

// 예시 테이블: users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  status: varchar('status', { length: 32 }).notNull().default('pending'),
  role: varchar('role', { length: 32 }).notNull().default('member'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 타입 추출 (Drizzle 자동 생성 타입 활용)
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

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
