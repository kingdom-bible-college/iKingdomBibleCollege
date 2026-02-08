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

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  subtitle: text('subtitle').notNull().default(''),
  instructor: varchar('instructor', { length: 255 }).notNull().default(''),
  level: varchar('level', { length: 64 }).notNull().default('입문 - 초급'),
  lastUpdated: varchar('last_updated', { length: 32 }).notNull().default(''),
  heroVimeoId: varchar('hero_vimeo_id', { length: 64 }),
  matchType: varchar('match_type', { length: 16 }).notNull().default('prefix'),
  matchValue: varchar('match_value', { length: 255 }).notNull(),
  status: varchar('status', { length: 16 }).notNull().default('active'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;

export const courseVideoOrders = pgTable('course_video_orders', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id')
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),
  vimeoId: varchar('vimeo_id', { length: 64 }).notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type CourseVideoOrder = typeof courseVideoOrders.$inferSelect;
export type NewCourseVideoOrder = typeof courseVideoOrders.$inferInsert;

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
