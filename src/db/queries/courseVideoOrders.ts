import "server-only";

import { and, asc, eq, inArray } from "drizzle-orm";
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
  const existingRows = await db
    .select({
      vimeoId: courseVideoOrders.vimeoId,
      displayTitle: courseVideoOrders.displayTitle,
    })
    .from(courseVideoOrders)
    .where(eq(courseVideoOrders.courseId, courseId));

  const titleMap = new Map(
    existingRows.map((row) => [row.vimeoId, row.displayTitle ?? null])
  );

  await db.delete(courseVideoOrders).where(eq(courseVideoOrders.courseId, courseId));
  if (!orderedVideoIds.length) return [];
  const rows: NewCourseVideoOrder[] = orderedVideoIds.map((vimeoId, index) => ({
    courseId,
    vimeoId,
    displayTitle: titleMap.get(vimeoId) ?? null,
    sortOrder: index + 1,
  }));
  return db.insert(courseVideoOrders).values(rows).returning();
}

export async function updateCourseVideoOrderTitle(
  courseId: number,
  vimeoId: string,
  displayTitle: string | null
) {
  const result = await db
    .update(courseVideoOrders)
    .set({ displayTitle, updatedAt: new Date() })
    .where(
      and(
        eq(courseVideoOrders.courseId, courseId),
        eq(courseVideoOrders.vimeoId, vimeoId)
      )
    )
    .returning();

  return result[0] ?? null;
}
