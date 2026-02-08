import "server-only";

const VIMEO_API_BASE = "https://api.vimeo.com";

export type VimeoVideo = {
  id: string;
  title: string;
  duration: number;
  description: string | null;
  link: string | null;
  thumbnail: string | null;
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

export const getVimeoVideos = async (): Promise<VimeoVideo[]> => {
  const perPage = Number(process.env.VIMEO_PER_PAGE || "50");
  const data = await fetchVimeo(
    `/me/videos?per_page=${perPage}&sort=date&direction=desc`
  );

  if (!data || !Array.isArray(data.data)) return [];

  return (data.data as VimeoApiVideo[]).map((video) => ({
    id: parseVideoId(video.uri),
    title: video.name ?? "Untitled",
    duration: Number(video.duration ?? 0),
    description: video.description ?? null,
    link: video.link ?? null,
    thumbnail: getThumbnail(video.pictures),
  }));
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
  };
};
