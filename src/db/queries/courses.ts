import "server-only";

import { asc, eq } from "drizzle-orm";
import { db } from "../index";
import { courses, type NewCourse } from "../schema";

export async function getCourses() {
  return db.select().from(courses).orderBy(asc(courses.sortOrder), asc(courses.id));
}

export async function getCourseBySlug(slug: string) {
  const result = await db.select().from(courses).where(eq(courses.slug, slug));
  return result[0] ?? null;
}

export async function createCourse(data: NewCourse) {
  const result = await db.insert(courses).values(data).returning();
  return result[0];
}

export async function updateCourse(id: number, data: Partial<NewCourse>) {
  const result = await db
    .update(courses)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(courses.id, id))
    .returning();
  return result[0] ?? null;
}

export async function deleteCourse(id: number) {
  const result = await db.delete(courses).where(eq(courses.id, id)).returning();
  return result[0] ?? null;
}
