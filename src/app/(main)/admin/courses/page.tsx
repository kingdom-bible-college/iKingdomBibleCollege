import { revalidatePath } from "next/cache";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import {
  getVimeoProjectVideos,
  getVimeoProjects,
  getVimeoVideos,
} from "@/lib/vimeo";
import {
  createCourse,
  getCourseBySlug,
  getCourses,
} from "@/db/queries/courses";
import {
  getCourseVideoOrdersByCourseIds,
  replaceCourseVideoOrders,
} from "@/db/queries/courseVideoOrders";
import styles from "./adminCourses.module.css";
import AdminCoursesClient, {
  type AdminCourseItem,
} from "./adminCoursesClient";
import { formatLessonDuration } from "@/lib/time";
import AdminVideoPicker from "./adminVideoPicker";

const toSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/(^-|-$)/g, "") || "course";

const createCourseAction = async (formData: FormData) => {
  "use server";
  await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  if (!title) return;

  const baseSlug = toSlug(title);
  let slug = baseSlug;
  let attempt = 1;
  while (await getCourseBySlug(slug)) {
    slug = `${baseSlug}-${attempt}`;
    attempt += 1;
  }

  const selectedRaw = String(formData.get("selectedVideoIds") || "[]");
  let selectedIds: string[] = [];
  try {
    const parsed = JSON.parse(selectedRaw);
    if (Array.isArray(parsed)) {
      selectedIds = parsed.map((id) => String(id)).filter(Boolean);
    }
  } catch {
    selectedIds = [];
  }

  const created = await createCourse({
    title,
    slug,
    matchType: "manual",
    matchValue: title,
    status: "active",
    sortOrder: 0,
  });

  if (created) {
    await replaceCourseVideoOrders(created.id, selectedIds);
  }

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
};

type PageProps = {
  searchParams?: Promise<{ project?: string; view?: string }>;
};

export default async function AdminCoursesPage({ searchParams }: PageProps) {
  await requireAdmin();

  const resolvedSearch = (await searchParams) ?? {};
  const selectedProjectId = resolvedSearch.project ?? "all";
  const view = resolvedSearch.view === "added" ? "added" : "add";

  const [videos, projects, projectVideos] = await Promise.all([
    getVimeoVideos(),
    getVimeoProjects(),
    selectedProjectId !== "all"
      ? getVimeoProjectVideos(selectedProjectId)
      : Promise.resolve([]),
  ]);
  const courseRows = await getCourses();
  const orderRows = await getCourseVideoOrdersByCourseIds(
    courseRows.map((course) => course.id)
  );
  const orderMap = new Map<number, string[]>();
  orderRows.forEach((row) => {
    if (!orderMap.has(row.courseId)) {
      orderMap.set(row.courseId, []);
    }
    orderMap.get(row.courseId)?.push(row.vimeoId);
  });
  const videoMap = new Map(videos.map((video) => [video.id, video]));
  const courseItems: AdminCourseItem[] = courseRows.map((course) => {
    const orderedIds = orderMap.get(course.id) ?? [];
    const selectedVideos = orderedIds
      .map((id) => videoMap.get(id))
      .filter((video): video is NonNullable<typeof video> => Boolean(video));
    return {
      id: course.id,
      title: course.title,
      status: course.status,
      totalLectures: selectedVideos.length,
      videos: selectedVideos.map((video) => ({
        id: video.id,
        title: video.title,
        durationLabel: formatLessonDuration(video.duration),
      })),
    };
  });
  const pickerSource =
    selectedProjectId !== "all" ? projectVideos : videos;
  const pickerVideos = pickerSource.map((video) => ({
    id: video.id,
    title: video.title,
    durationLabel: formatLessonDuration(video.duration),
    thumbnail: video.thumbnail,
  }));
  const totalVideos = videos.length;
  const selectedProjectName =
    selectedProjectId === "all"
      ? "전체"
      : projects.find((project) => project.id === selectedProjectId)?.name ??
        "선택됨";

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>KBC Admin</p>
          <h1 className={styles.title}>강의 관리</h1>
          <p className={styles.subtitle}>
            Vimeo 업로드 영상 기준으로 강의를 구성하고 커리큘럼을 확인합니다.
          </p>
        </div>
        <div className={styles.actions}>
          <button className={styles.secondaryButton} type="button" disabled>
            강의 생성 (준비중)
          </button>
          <button className={styles.primaryButton} type="button" disabled>
            Vimeo 동기화
          </button>
        </div>
      </header>

      <div className={styles.stats}>
        <div>
          <span>전체 강의</span>
          <strong>{courseRows.length}</strong>
        </div>
        <div>
          <span>전체 영상</span>
          <strong>{totalVideos}</strong>
        </div>
      </div>

      <div className={styles.tabs}>
        <Link
          href={{
            pathname: "/admin/courses",
            query: {
              view: "add",
              ...(selectedProjectId !== "all"
                ? { project: selectedProjectId }
                : {}),
            },
          }}
          className={`${styles.tabButton} ${
            view === "add" ? styles.tabButtonActive : ""
          }`}
        >
          강의 추가
        </Link>
        <Link
          href={{
            pathname: "/admin/courses",
            query: { view: "added" },
          }}
          className={`${styles.tabButton} ${
            view === "added" ? styles.tabButtonActive : ""
          }`}
        >
          추가된 강의
        </Link>
      </div>

      {view === "add" ? (
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2>강의 추가</h2>
            <p>모든 Vimeo 영상을 검색해 선택한 뒤 강의를 생성합니다.</p>
          </div>
          <form className={styles.projectFilter} method="get">
            <input type="hidden" name="view" value="add" />
            <label>
              <span>폴더 선택</span>
              <select name="project" defaultValue={selectedProjectId}>
                <option value="all">전체 폴더</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>
            <button className={styles.secondaryButton} type="submit">
              적용
            </button>
            <span className={styles.projectHint}>
              현재 선택: {selectedProjectName}
            </span>
          </form>
          <form className={styles.form} action={createCourseAction}>
            <label className={`${styles.field} ${styles.fullRow}`}>
              <span>강의명</span>
              <input name="title" required placeholder="예: 포스트인카운터" />
            </label>
            <div className={styles.fullRow}>
              <p className={styles.projectHint}>
                {selectedProjectName === "전체"
                  ? "전체 폴더 영상이 표시됩니다."
                  : `${selectedProjectName} 폴더 영상이 표시됩니다.`}
              </p>
              <AdminVideoPicker
                videos={pickerVideos}
                inputName="selectedVideoIds"
              />
            </div>
            <div className={styles.formActions}>
              <button className={styles.primaryButton} type="submit">
                강의 등록
              </button>
            </div>
          </form>
        </div>
      ) : (
        <AdminCoursesClient initialCourses={courseItems} />
      )}
    </section>
  );
}
