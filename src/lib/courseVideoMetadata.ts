import "server-only";

import { getCourses } from "@/db/queries/courses";
import {
  getCourseVideoOrdersByCourseIds,
  replaceCourseVideoOrders,
  type ReplaceCourseVideoOrderInput,
} from "@/db/queries/courseVideoOrders";
import type { CourseVideoOrder } from "@/db/schema";
import { getVimeoVideosByIds, type VimeoVideo } from "@/lib/vimeo";

type StoredCourseVideoRow = Pick<
  CourseVideoOrder,
  | "vimeoId"
  | "displayTitle"
  | "originalTitle"
  | "durationSeconds"
  | "thumbnailUrl"
  | "vimeoHash"
>;

export const dedupeOrderedVideoIds = (orderedVideoIds: string[]) => {
  const seen = new Set<string>();

  return orderedVideoIds.filter((videoId) => {
    if (seen.has(videoId)) {
      return false;
    }

    seen.add(videoId);
    return true;
  });
};

export const dedupeCourseVideoRows = <T extends StoredCourseVideoRow>(rows: T[]) => {
  const seen = new Set<string>();

  return rows.filter((row) => {
    if (seen.has(row.vimeoId)) {
      return false;
    }

    seen.add(row.vimeoId);
    return true;
  });
};

const toStoredVideoInputs = (
  orderedVideoIds: string[],
  videoMap: Map<string, VimeoVideo>
): ReplaceCourseVideoOrderInput[] =>
  orderedVideoIds.map((vimeoId) => {
    const video = videoMap.get(vimeoId);

    return {
      vimeoId,
      originalTitle: video?.title ?? "",
      durationSeconds: Number(video?.duration ?? 0),
      thumbnailUrl: video?.thumbnail ?? null,
      vimeoHash: video?.hash ?? null,
    };
  });

export const hasMissingCourseVideoMetadata = (rows: StoredCourseVideoRow[]) =>
  rows.some((row) => !row.originalTitle);

export const mapCourseVideoRowsToVimeoVideos = (
  rows: StoredCourseVideoRow[]
): VimeoVideo[] =>
  dedupeCourseVideoRows(rows).map((row) => ({
    id: row.vimeoId,
    title: row.displayTitle ?? (row.originalTitle || "Untitled"),
    duration: row.durationSeconds,
    description: null,
    link: null,
    thumbnail: row.thumbnailUrl ?? null,
    hash: row.vimeoHash ?? null,
  }));

export async function syncCourseVideoMetadata(
  courseId: number,
  orderedVideoIds: string[]
) {
  const normalizedIds = dedupeOrderedVideoIds(
    orderedVideoIds.map((id) => String(id)).filter(Boolean)
  );
  if (!normalizedIds.length) {
    return replaceCourseVideoOrders(courseId, []);
  }

  const videos = await getVimeoVideosByIds(normalizedIds);
  const videoMap = new Map(videos.map((video) => [video.id, video]));

  return replaceCourseVideoOrders(
    courseId,
    toStoredVideoInputs(normalizedIds, videoMap)
  );
}

export async function syncCourseVideoMetadataByCourseIds(courseIds: number[]) {
  const normalizedCourseIds = Array.from(
    new Set(
      courseIds
        .map((courseId) => Number(courseId))
        .filter((courseId) => Number.isFinite(courseId) && courseId > 0)
    )
  );

  if (!normalizedCourseIds.length) return;

  const orderRows = await getCourseVideoOrdersByCourseIds(normalizedCourseIds);
  const rowsByCourseId = new Map<number, string[]>();

  orderRows.forEach((row) => {
    if (!rowsByCourseId.has(row.courseId)) {
      rowsByCourseId.set(row.courseId, []);
    }
    rowsByCourseId.get(row.courseId)?.push(row.vimeoId);
  });

  for (const [courseId, orderedVideoIds] of rowsByCourseId) {
    await syncCourseVideoMetadata(courseId, orderedVideoIds);
  }
}

export async function syncAllCourseVideoMetadata() {
  const courses = await getCourses();
  await syncCourseVideoMetadataByCourseIds(courses.map((course) => course.id));
}
