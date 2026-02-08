import type { VimeoVideo } from "@/lib/vimeo";
import { formatTotalDuration, formatLessonDuration } from "@/lib/time";
import {
  courseCatalog,
  defaultCourseMeta,
  type CourseMeta,
  type CourseMatch,
} from "./courseData";

export type CourseGroup = {
  slug: string;
  title: string;
  meta: CourseMeta;
  videos: VimeoVideo[];
  totalLectures: number;
  totalDuration: string;
  coverImage: string | null;
};

export type CurriculumLesson = {
  id: string;
  title: string;
  duration: string;
  preview: boolean;
  type?: "자료";
};

export type CurriculumSection = {
  title: string;
  totalTime: string;
  lessons: CurriculumLesson[];
};

const normalize = (value: string) => value.trim().toLowerCase();

const isMatch = (title: string, match: CourseMatch) => {
  const source = normalize(title);
  const target = normalize(match.value);

  if (match.type === "prefix") return source.startsWith(target);
  if (match.type === "contains") return source.includes(target);
  return source === target;
};

const findCourseMeta = (seriesTitle: string): CourseMeta | undefined =>
  courseCatalog.find((meta) => {
    if (meta.match) return isMatch(seriesTitle, meta.match);
    return normalize(meta.title) === normalize(seriesTitle);
  });

const extractSeriesTitle = (title: string): string => {
  const cleaned = title.trim();
  if (!cleaned) return "기타";

  const lectureMatch = cleaned.match(/^(.+?)\s*\d+\s*강/);
  if (lectureMatch?.[1]) return lectureMatch[1].trim();

  const separators = ["_", " - ", " | ", " / "];
  for (const separator of separators) {
    const index = cleaned.indexOf(separator);
    if (index > 0) {
      const head = cleaned.slice(0, index).trim();
      if (head.length >= 2) return head;
    }
  }

  return cleaned;
};

const toSlug = (value: string): string => {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/(^-|-$)/g, "");

  return cleaned || "course";
};

const ensureUniqueSlug = (slug: string, counts: Map<string, number>) => {
  const current = counts.get(slug) ?? 0;
  counts.set(slug, current + 1);
  return current === 0 ? slug : `${slug}-${current + 1}`;
};

export const buildCourseGroups = (videos: VimeoVideo[]): CourseGroup[] => {
  const grouped = new Map<string, VimeoVideo[]>();
  const order: string[] = [];

  videos.forEach((video) => {
    const seriesTitle = extractSeriesTitle(video.title);
    if (!grouped.has(seriesTitle)) {
      grouped.set(seriesTitle, []);
      order.push(seriesTitle);
    }
    grouped.get(seriesTitle)?.push(video);
  });

  const slugCounts = new Map<string, number>();

  return order.map((title, index) => {
    const items = grouped.get(title) ?? [];
    const meta = findCourseMeta(title);
    const baseSlug =
      meta?.slug ?? (toSlug(title) || `course-${index + 1}`);
    const slug = ensureUniqueSlug(baseSlug, slugCounts);

    const totalSeconds = items.reduce(
      (sum, video) => sum + (Number.isFinite(video.duration) ? video.duration : 0),
      0
    );

    const totalDuration =
      totalSeconds > 0 ? formatTotalDuration(totalSeconds) : "0분";

    const coverImage =
      items.find((video) => video.thumbnail)?.thumbnail ?? null;

    const mergedMeta: CourseMeta = {
      ...defaultCourseMeta,
      ...meta,
      title: meta?.title ?? title,
    };

    return {
      slug,
      title: mergedMeta.title,
      meta: mergedMeta,
      videos: items,
      totalLectures: items.length,
      totalDuration,
      coverImage,
    };
  });
};

export const buildCurriculum = (
  videos: VimeoVideo[],
  fallbackHeroId?: string
) => {
  if (!videos.length) {
    return {
      curriculum: [],
      totalLectures: 0,
      totalDuration: "0분",
      heroVideoId: fallbackHeroId ?? "",
      hasVimeo: false,
    };
  }

  const lessons: CurriculumLesson[] = videos.map((video, index) => ({
    id: video.id,
    title: video.title,
    duration: formatLessonDuration(video.duration),
    preview: index < 2,
  }));

  const totalSeconds = videos.reduce(
    (sum, video) => sum + (Number.isFinite(video.duration) ? video.duration : 0),
    0
  );

  const computedDuration =
    totalSeconds > 0 ? formatTotalDuration(totalSeconds) : "0분";

  return {
    curriculum: [
      {
        title: "전체 커리큘럼",
        totalTime: computedDuration,
        lessons,
      },
    ] as CurriculumSection[],
    totalLectures: lessons.length,
    totalDuration: computedDuration,
    heroVideoId: lessons[0]?.id || fallbackHeroId || "",
    hasVimeo: true,
  };
};
