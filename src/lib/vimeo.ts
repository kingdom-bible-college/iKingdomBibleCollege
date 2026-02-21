import "server-only";

const VIMEO_API_BASE = "https://api.vimeo.com";

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
    next: { revalidate: 60 },
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

  let page = 1;
  while (page <= maxPages) {
    const data = (await fetchVimeo(
      `${pathBase}?per_page=${perPage}&page=${page}&sort=date&direction=desc`
    )) as VimeoPagedResponse | null;

    if (!data || !Array.isArray(data.data)) break;

    all.push(...data.data);

    const hasNext = Boolean(data.paging?.next);
    if (!hasNext || data.data.length < perPage) break;

    page += 1;
  }

  return all;
};

export const getVimeoVideos = async (): Promise<VimeoVideo[]> => {
  const all = (await fetchPaged("/me/videos")) as VimeoApiVideo[];

  return all.map((video) => ({
    id: parseVideoId(video.uri),
    title: video.name ?? "Untitled",
    duration: Number(video.duration ?? 0),
    description: video.description ?? null,
    link: video.link ?? null,
    thumbnail: getThumbnail(video.pictures),
    hash: parseHash(video.link),
  }));
};

export const getVimeoProjectVideos = async (
  projectId: string
): Promise<VimeoVideo[]> => {
  if (!projectId) return [];
  const all = (await fetchPaged(
    `/me/projects/${projectId}/videos`
  )) as VimeoApiVideo[];

  return all.map((video) => ({
    id: parseVideoId(video.uri),
    title: video.name ?? "Untitled",
    duration: Number(video.duration ?? 0),
    description: video.description ?? null,
    link: video.link ?? null,
    thumbnail: getThumbnail(video.pictures),
    hash: parseHash(video.link),
  }));
};

export const getVimeoProjects = async (): Promise<VimeoProject[]> => {
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
};

export const getVimeoVideoById = async (
  id: string
): Promise<VimeoVideo | null> => {
  if (!id) return null;
  const data = await fetchVimeo(`/videos/${id}`);
  if (!data) return null;

  const video = data as VimeoApiVideo;
  return {
    id: parseVideoId(video.uri) || id,
    title: video.name ?? "Untitled",
    duration: Number(video.duration ?? 0),
    description: video.description ?? null,
    link: video.link ?? null,
    thumbnail: getThumbnail(video.pictures),
    hash: parseHash(video.link),
  };
};
