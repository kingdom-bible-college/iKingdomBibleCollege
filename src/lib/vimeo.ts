import "server-only";

import { unstable_cache } from "next/cache";

const VIMEO_API_BASE = "https://api.vimeo.com";
const VIMEO_REVALIDATE_SECONDS = 300;
// For larger sets, reusing the paged cache is usually faster than N detail calls.
const VIMEO_BATCH_LOOKUP_THRESHOLD = 8;
const VIMEO_PAGE_BATCH_SIZE = 4;

export type VimeoVideo = {
  id: string;
  title: string;
  duration: number;
  description: string | null;
  link: string | null;
  thumbnail: string | null;
  hash: string | null;
};

export type VimeoProject = {
  id: string;
  name: string;
};

type VimeoPicture = {
  base_link?: string;
  sizes?: Array<{ link?: string }>;
};

type VimeoApiVideo = {
  uri?: string;
  name?: string;
  duration?: number;
  description?: string | null;
  link?: string | null;
  pictures?: VimeoPicture | null;
};

type VimeoApiProject = {
  uri?: string;
  name?: string;
};

type VimeoPagedResponse = {
  data?: unknown[];
  paging?: {
    next?: string | null;
  };
};

const getThumbnail = (pictures?: VimeoPicture | null): string | null => {
  if (!pictures) return null;
  if (pictures.base_link) return pictures.base_link;
  const sizes = pictures.sizes ?? [];
  return sizes.length ? sizes[sizes.length - 1]?.link ?? null : null;
};

const mapVimeoVideo = (video: VimeoApiVideo): VimeoVideo => ({
  id: parseVideoId(video.uri),
  title: video.name ?? "Untitled",
  duration: Number(video.duration ?? 0),
  description: video.description ?? null,
  link: video.link ?? null,
  thumbnail: getThumbnail(video.pictures),
  hash: parseHash(video.link),
});

const parseVideoId = (uri?: string): string => {
  if (!uri) return "";
  const parts = uri.split("/");
  return parts[parts.length - 1] ?? "";
};

const parseHash = (link?: string | null): string | null => {
  if (!link) return null;
  const parts = link.split("/");
  const last = parts[parts.length - 1] ?? "";
  return /^[a-f0-9]+$/i.test(last) ? last : null;
};

const parseProjectId = (uri?: string): string => {
  if (!uri) return "";
  const parts = uri.split("/");
  return parts[parts.length - 1] ?? "";
};

const getAuthHeaders = (): HeadersInit | null => {
  const token = process.env.VIMEO_ACCESS_TOKEN;
  if (!token) return null;

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.vimeo.*+json;version=3.4",
  };
};

const fetchVimeo = async (path: string) => {
  const headers = getAuthHeaders();
  if (!headers) return null;

  const response = await fetch(`${VIMEO_API_BASE}${path}`, {
    headers,
    next: { revalidate: VIMEO_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    console.error(`Vimeo API error: ${response.status} ${response.statusText}`);
    return null;
  }

  return response.json();
};

const fetchPaged = async (pathBase: string) => {
  const perPage = Number(process.env.VIMEO_PER_PAGE || "50");
  const maxPages = Number(process.env.VIMEO_MAX_PAGES || "50");
  const all: unknown[] = [];

  const fetchPage = async (page: number) =>
    (await fetchVimeo(
      `${pathBase}?per_page=${perPage}&page=${page}&sort=date&direction=desc`
    )) as VimeoPagedResponse | null;

  const firstPage = await fetchPage(1);
  if (!firstPage || !Array.isArray(firstPage.data)) return all;

  all.push(...firstPage.data);

  const hasMorePages =
    Boolean(firstPage.paging?.next) && firstPage.data.length >= perPage;
  if (!hasMorePages) return all;

  let nextPage = 2;
  while (nextPage <= maxPages) {
    const pages = Array.from(
      { length: Math.min(VIMEO_PAGE_BATCH_SIZE, maxPages - nextPage + 1) },
      (_, index) => nextPage + index
    );
    const responses = await Promise.all(pages.map((page) => fetchPage(page)));

    let reachedEnd = false;
    responses.forEach((response) => {
      if (reachedEnd || !response || !Array.isArray(response.data)) {
        reachedEnd = true;
        return;
      }

      all.push(...response.data);

      if (!response.paging?.next || response.data.length < perPage) {
        reachedEnd = true;
      }
    });

    if (reachedEnd) {
      break;
    }

    nextPage += VIMEO_PAGE_BATCH_SIZE;
  }

  return all;
};

const getOrderedVideosFromMap = (
  orderedIds: string[],
  videoMap: Map<string, VimeoVideo>
) =>
  orderedIds
    .map((id) => videoMap.get(id))
    .filter((video): video is VimeoVideo => Boolean(video));

const getCachedVimeoVideos = unstable_cache(
  async (): Promise<VimeoVideo[]> => {
    const all = (await fetchPaged("/me/videos")) as VimeoApiVideo[];
    return all.map(mapVimeoVideo);
  },
  ["vimeo-videos"],
  { revalidate: VIMEO_REVALIDATE_SECONDS }
);

export const getVimeoVideos = async (): Promise<VimeoVideo[]> => {
  return getCachedVimeoVideos();
};

const getCachedVimeoProjectVideos = unstable_cache(
  async (projectId: string): Promise<VimeoVideo[]> => {
    const all = (await fetchPaged(
      `/me/projects/${projectId}/videos`
    )) as VimeoApiVideo[];

    return all.map(mapVimeoVideo);
  },
  ["vimeo-project-videos"],
  { revalidate: VIMEO_REVALIDATE_SECONDS }
);

export const getVimeoProjectVideos = async (
  projectId: string
): Promise<VimeoVideo[]> => {
  if (!projectId) return [];
  return getCachedVimeoProjectVideos(projectId);
};

const getCachedVimeoProjects = unstable_cache(
  async (): Promise<VimeoProject[]> => {
    const perPage = Number(process.env.VIMEO_PER_PAGE || "50");
    const maxPages = Number(process.env.VIMEO_MAX_PAGES || "50");
    const all: VimeoApiProject[] = [];

    let page = 1;
    while (page <= maxPages) {
      const data = (await fetchVimeo(
        `/me/projects?per_page=${perPage}&page=${page}`
      )) as VimeoPagedResponse | null;

      if (!data || !Array.isArray(data.data)) break;

      const batch = data.data as VimeoApiProject[];
      all.push(...batch);

      const hasNext = Boolean(data.paging?.next);
      if (!hasNext || batch.length < perPage) break;

      page += 1;
    }

    return all
      .map((project) => ({
        id: parseProjectId(project.uri),
        name: project.name ?? "Untitled",
      }))
      .filter((project) => project.id);
  },
  ["vimeo-projects"],
  { revalidate: VIMEO_REVALIDATE_SECONDS }
);

export const getVimeoProjects = async (): Promise<VimeoProject[]> => {
  return getCachedVimeoProjects();
};

export const getVimeoVideosByIds = async (
  ids: string[]
): Promise<VimeoVideo[]> => {
  if (!ids.length) return [];

  const orderedIds = ids.map((id) => String(id)).filter(Boolean);
  const uniqueIds = Array.from(new Set(orderedIds));

  if (uniqueIds.length >= VIMEO_BATCH_LOOKUP_THRESHOLD) {
    const allVideos = await getCachedVimeoVideos();
    const videoMap = new Map(allVideos.map((video) => [video.id, video]));
    const missingIds = uniqueIds.filter((id) => !videoMap.has(id));

    if (missingIds.length) {
      const missingVideos = await Promise.all(
        missingIds.map((id) => getVimeoVideoById(id))
      );

      missingVideos
        .filter((video): video is VimeoVideo => video !== null)
        .forEach((video) => {
          videoMap.set(video.id, video);
        });
    }

    return getOrderedVideosFromMap(orderedIds, videoMap);
  }

  const results = await Promise.all(uniqueIds.map((id) => getVimeoVideoById(id)));
  const videoMap = new Map(
    results
      .filter((video): video is VimeoVideo => video !== null)
      .map((video) => [video.id, video])
  );

  return getOrderedVideosFromMap(orderedIds, videoMap);
};

const getCachedVimeoVideoById = unstable_cache(
  async (id: string): Promise<VimeoVideo | null> => {
    const data = await fetchVimeo(`/videos/${id}`);
    if (!data) return null;

    return mapVimeoVideo(data as VimeoApiVideo);
  },
  ["vimeo-video-by-id"],
  { revalidate: VIMEO_REVALIDATE_SECONDS }
);

export const getVimeoVideoById = async (
  id: string
): Promise<VimeoVideo | null> => {
  if (!id) return null;
  const video = await getCachedVimeoVideoById(id);
  if (!video) return null;

  return {
    ...video,
    id: video.id || id,
  };
};
