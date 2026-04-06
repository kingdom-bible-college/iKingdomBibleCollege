import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
} from "@/db/queries/courseVideoOrders";
import {
  dedupeCourseVideoRows,
  hasMissingCourseVideoMetadata,
  syncAllCourseVideoMetadata,
  syncCourseVideoMetadata,
  syncCourseVideoMetadataByCourseIds,
} from "@/lib/courseVideoMetadata";
import styles from "./adminCourses.module.css";
import AdminCoursesClient, {
  type AdminCourseItem,
} from "./adminCoursesClient";
import { formatLessonDuration } from "@/lib/time";
import AdminVideoPicker from "./adminVideoPicker";
import SubmitButton from "./submitButton";
import SyncCoursesButton from "./syncCoursesButton";

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
    heroVimeoId: selectedIds[0] ?? null,
    matchType: "manual",
    matchValue: title,
    status: "active",
    sortOrder: 0,
  });

  if (created) {
    await syncCourseVideoMetadata(created.id, selectedIds);
  }

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  redirect("/admin/courses?view=added");
};

const syncCourseMetadataAction = async () => {
  "use server";
  await requireAdmin();

  await syncAllCourseVideoMetadata();

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  redirect("/admin/courses?view=added&synced=1");
};

type PageProps = {
  searchParams?: Promise<{ project?: string; view?: string; synced?: string }>;
};

export default async function AdminCoursesPage({ searchParams }: PageProps) {
  await requireAdmin();

  const resolvedSearch = (await searchParams) ?? {};
  const selectedProjectId = resolvedSearch.project ?? "all";
  const synced = resolvedSearch.synced === "1";

  const courseRows = await getCourses();
  const view =
    resolvedSearch.view === "add"
      ? "add"
      : courseRows.length === 0
        ? "add"
        : "added";

  let orderRows = await getCourseVideoOrdersByCourseIds(
    courseRows.map((course) => course.id)
  );
  const needsPicker = view === "add";

  if (!needsPicker && hasMissingCourseVideoMetadata(orderRows)) {
    await syncCourseVideoMetadataByCourseIds(courseRows.map((course) => course.id));
    orderRows = await getCourseVideoOrdersByCourseIds(
      courseRows.map((course) => course.id)
    );
  }

  const orderedVideoIds = Array.from(
    new Set(orderRows.map((row) => row.vimeoId))
  );

  const shouldLoadAllVideos = needsPicker && selectedProjectId === "all";
  const shouldLoadProjectVideos = needsPicker && selectedProjectId !== "all";
  const [videos, projects, projectVideos] = await Promise.all([
    shouldLoadAllVideos
      ? getVimeoVideos()
      : Promise.resolve([]),
    needsPicker ? getVimeoProjects() : Promise.resolve([]),
    shouldLoadProjectVideos
      ? getVimeoProjectVideos(selectedProjectId)
      : Promise.resolve([]),
  ]);

  const rowsByCourseId = new Map<number, typeof orderRows>();
  orderRows.forEach((row) => {
    if (!rowsByCourseId.has(row.courseId)) {
      rowsByCourseId.set(row.courseId, []);
    }
    rowsByCourseId.get(row.courseId)?.push(row);
  });
  const courseItems: AdminCourseItem[] = courseRows.map((course) => {
    const selectedRows = dedupeCourseVideoRows(rowsByCourseId.get(course.id) ?? []);
    return {
      id: course.id,
      coverImage: course.coverImage ?? null,
      title: course.title,
      status: course.status,
      totalLectures: selectedRows.length,
      videos: selectedRows.map((row) => ({
        id: row.vimeoId,
        title: row.displayTitle ?? (row.originalTitle || "Untitled"),
        originalTitle: row.originalTitle || "Untitled",
        durationLabel: formatLessonDuration(row.durationSeconds),
        thumbnail: row.thumbnailUrl ?? null,
      })),
    };
  });
  const pickerSource = selectedProjectId !== "all" ? projectVideos : videos;
  const pickerVideos = pickerSource.map((video) => ({
    id: video.id,
    title: video.title,
    durationLabel: formatLessonDuration(video.duration),
    thumbnail: video.thumbnail,
  }));
  const totalVideos = needsPicker ? pickerSource.length : orderedVideoIds.length;
  const totalVideosLabel = needsPicker
    ? selectedProjectId === "all"
      ? "전체 영상"
      : "선택 폴더 영상"
    : "등록 영상";
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
            className={styles.secondaryButton}
            prefetch={false}
          >
            강의 생성
          </Link>
          <form action={syncCourseMetadataAction}>
            <SyncCoursesButton />
          </form>
        </div>
      </header>

      {synced ? (
        <div className={styles.noticeBanner}>
          Vimeo 메타데이터 동기화가 완료되었습니다.
        </div>
      ) : null}

      <div className={styles.stats}>
        <div>
          <span>전체 강의</span>
          <strong>{courseRows.length}</strong>
        </div>
        <div>
          <span>{totalVideosLabel}</span>
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
          prefetch={false}
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
          prefetch={false}
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
                key={selectedProjectId}
                videos={pickerVideos}
                inputName="selectedVideoIds"
              />
            </div>
            <div className={styles.formActions}>
              <SubmitButton />
            </div>
          </form>
        </div>
      ) : (
        <AdminCoursesClient initialCourses={courseItems} />
      )}
    </section>
  );
}
