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

export const orderVideosByIds = (
  videos: VimeoVideo[],
  orderedIds: string[]
) => {
  if (!orderedIds.length) return videos;
  const orderIndex = new Map<string, number>(
    orderedIds.map((id, index) => [id, index])
  );
  return videos
    .map((video, index) => ({
      video,
      index,
      order: orderIndex.get(video.id),
    }))
    .sort((a, b) => {
      if (a.order === undefined && b.order === undefined) {
        return a.index - b.index;
      }
      if (a.order === undefined) return 1;
      if (b.order === undefined) return -1;
      return a.order - b.order;
    })
    .map((item) => item.video);
};

const matchVideoTitle = (title: string, match: CourseMatch) =>
  isMatch(title, match);

const buildGroup = (
  meta: CourseMeta,
  items: VimeoVideo[],
  index: number,
  slugCounts: Map<string, number>
): CourseGroup => {
  const baseSlug =
    meta.slug ?? (toSlug(meta.title) || `course-${index + 1}`);
  const slug = ensureUniqueSlug(baseSlug, slugCounts);

  const totalSeconds = items.reduce(
    (sum, video) => sum + (Number.isFinite(video.duration) ? video.duration : 0),
    0
  );

  const totalDuration =
    totalSeconds > 0 ? formatTotalDuration(totalSeconds) : "0분";

  const coverImage =
    items.find((video) => video.thumbnail)?.thumbnail ?? null;

  return {
    slug,
    title: meta.title,
    meta,
    videos: items,
    totalLectures: items.length,
    totalDuration,
    coverImage,
  };
};

export const buildCourseGroups = (
  videos: VimeoVideo[],
  catalogOverride?: CourseMeta[]
): CourseGroup[] => {
  const catalog =
    catalogOverride && catalogOverride.length ? catalogOverride : courseCatalog;

  if (catalogOverride && catalogOverride.length) {
    const slugCounts = new Map<string, number>();
    const used = new Set<string>();
    const groups = catalog.map((meta, index) => {
      const match =
        meta.match ?? ({ type: "prefix", value: meta.title } as CourseMatch);
      const items = videos.filter(
        (video) => !used.has(video.id) && matchVideoTitle(video.title, match)
      );
      items.forEach((video) => used.add(video.id));
      const mergedMeta: CourseMeta = { ...defaultCourseMeta, ...meta };
      return buildGroup(mergedMeta, items, index, slugCounts);
    });

    const remaining = videos.filter((video) => !used.has(video.id));
    if (remaining.length) {
      const otherMeta: CourseMeta = {
        ...defaultCourseMeta,
        title: "기타",
        subtitle: "아직 분류되지 않은 강의입니다.",
        instructor: "담당 강사",
        level: "입문 - 초급",
        lastUpdated: defaultCourseMeta.lastUpdated,
        match: { type: "contains", value: "" },
      };
      groups.push(buildGroup(otherMeta, remaining, groups.length, slugCounts));
    }

    return groups;
  }

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
    const mergedMeta: CourseMeta = {
      ...defaultCourseMeta,
      ...meta,
      title: meta?.title ?? title,
    };
    return buildGroup(mergedMeta, items, index, slugCounts);
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
    preview: false,
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
