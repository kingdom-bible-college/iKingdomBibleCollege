import "server-only";

import { asc, eq, inArray } from "drizzle-orm";
import { db } from "../index";
import { courseVideoOrders, type NewCourseVideoOrder } from "../schema";

export async function getCourseVideoOrdersByCourseIds(courseIds: number[]) {
  if (!courseIds.length) return [];
  return db
    .select()
    .from(courseVideoOrders)
    .where(inArray(courseVideoOrders.courseId, courseIds))
    .orderBy(asc(courseVideoOrders.sortOrder), asc(courseVideoOrders.id));
}

export async function replaceCourseVideoOrders(
  courseId: number,
  orderedVideoIds: string[]
) {
  await db.delete(courseVideoOrders).where(eq(courseVideoOrders.courseId, courseId));
  if (!orderedVideoIds.length) return [];
  const rows: NewCourseVideoOrder[] = orderedVideoIds.map((vimeoId, index) => ({
    courseId,
    vimeoId,
    sortOrder: index + 1,
  }));
  return db.insert(courseVideoOrders).values(rows).returning();
}
