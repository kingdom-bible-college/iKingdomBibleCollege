import Link from "next/link";
import { Manrope } from "next/font/google";
import styles from "./list.module.css";
import { getVimeoVideos } from "@/lib/vimeo";
import { buildCourseGroups } from "./courseUtils";
import { requireUser } from "@/lib/auth/session";
import { getCourses } from "@/db/queries/courses";
import { getCourseVideoOrdersByCourseIds } from "@/db/queries/courseVideoOrders";
import { courseCatalog, defaultCourseMeta } from "./courseData";
import { formatTotalDuration } from "@/lib/time";

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default async function CoursesListPage() {
  await requireUser();
  const [videos, courseRows] = await Promise.all([
    getVimeoVideos(),
    getCourses(),
  ]);
  const activeCourses = courseRows.filter((course) => course.status === "active");
  const orderRows = await getCourseVideoOrdersByCourseIds(
    activeCourses.map((course) => course.id)
  );
  const orderMap = new Map<number, string[]>();
  orderRows.forEach((row) => {
    if (!orderMap.has(row.courseId)) {
      orderMap.set(row.courseId, []);
    }
    orderMap.get(row.courseId)?.push(row.vimeoId);
  });
  const videoMap = new Map(videos.map((video) => [video.id, video]));

  const manualGroups = activeCourses.map((course) => {
    const orderedIds = orderMap.get(course.id) ?? [];
    const selectedVideos = orderedIds
      .map((id) => videoMap.get(id))
      .filter((video): video is NonNullable<typeof video> => Boolean(video));
    const totalSeconds = selectedVideos.reduce(
      (sum, video) => sum + (Number.isFinite(video.duration) ? video.duration : 0),
      0
    );
    const totalDuration = formatTotalDuration(totalSeconds);
    const coverImage =
      selectedVideos.find((video) => video.thumbnail)?.thumbnail ?? null;

    return {
      slug: course.slug,
      title: course.title,
      meta: {
        ...defaultCourseMeta,
        title: course.title,
        subtitle: course.subtitle || defaultCourseMeta.subtitle,
        instructor: course.instructor || defaultCourseMeta.instructor,
        level: course.level || defaultCourseMeta.level,
        lastUpdated: course.lastUpdated || defaultCourseMeta.lastUpdated,
        heroVimeoId: course.heroVimeoId || defaultCourseMeta.heroVimeoId,
      },
      videos: selectedVideos,
      totalLectures: selectedVideos.length,
      totalDuration,
      coverImage,
    };
  });

  const courseGroups =
    activeCourses.length > 0 ? manualGroups : buildCourseGroups(videos, courseCatalog);

  return (
    <main className={`${styles.main} ${bodyFont.className}`}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>회원 전용 강의</span>
          <h1 className={styles.heroTitle}>강의 선택</h1>
          <p className={styles.heroSub}>
            승인된 회원은 아래 강의를 선택해 커리큘럼을 확인할 수 있습니다.
          </p>
        </div>
      </section>

      <section className={styles.gridSection}>
        {courseGroups.length ? (
          <div className={styles.grid}>
            {courseGroups.map((group) => (
              <Link
                key={group.slug}
                href={`/courses/${group.slug}`}
                className={styles.card}
              >
                <div className={styles.cover}>
                  {group.coverImage ? (
                    <img
                      src={group.coverImage}
                      alt={`${group.title} 대표 이미지`}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className={styles.coverFallback}>
                      <span>{group.title}</span>
                    </div>
                  )}
                  <span className={styles.coverBadge}>회원 전용</span>
                </div>
                <div className={styles.cardBody}>
                  <h2 className={styles.cardTitle}>{group.meta.title}</h2>
                  <p className={styles.cardSub}>{group.meta.subtitle}</p>
                  <div className={styles.cardMeta}>
                    <span>{group.meta.instructor}</span>
                    <span>{group.totalLectures}개 강의</span>
                    <span>{group.totalDuration}</span>
                  </div>
                  <div className={styles.cardAction}>커리큘럼 보기</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h3>Vimeo 영상이 없습니다.</h3>
            <p>토큰 권한 또는 업로드 여부를 확인해 주세요.</p>
          </div>
        )}
      </section>
    </main>
  );
}
