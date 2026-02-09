import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./lesson.module.css";
import { Manrope } from "next/font/google";
import {
  defaultCourseMeta,
  courseCatalog,
} from "../../courseData";
import { getVimeoVideos } from "@/lib/vimeo";
import { buildCourseGroups, buildCurriculum } from "../../courseUtils";
import { requireUser } from "@/lib/auth/session";
import { getCourseBySlug } from "@/db/queries/courses";
import { getCourseVideoOrdersByCourseIds } from "@/db/queries/courseVideoOrders";

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type PageProps = {
  params: Promise<{ courseId: string; lessonId: string }>;
};

export default async function LessonDetailPage({ params }: PageProps) {
  await requireUser();
  const { courseId, lessonId } = await params;
  const slug = decodeURIComponent(courseId);
  const videos = await getVimeoVideos();
  const videoMap = new Map(videos.map((video) => [video.id, video]));

  const courseRow = await getCourseBySlug(slug);

  let course = defaultCourseMeta;
  let activeVideos: typeof videos = [];
  let activeCourseSlug = slug;

  if (courseRow) {
    const orderRows = await getCourseVideoOrdersByCourseIds([courseRow.id]);
    const orderedIds = orderRows.map((row) => row.vimeoId);
    activeVideos = orderedIds
      .map((id) => videoMap.get(id))
      .filter((video): video is NonNullable<typeof video> => Boolean(video));
    activeCourseSlug = courseRow.slug;
    course = {
      ...defaultCourseMeta,
      title: courseRow.title,
      subtitle: courseRow.subtitle || defaultCourseMeta.subtitle,
      instructor: courseRow.instructor || defaultCourseMeta.instructor,
      level: courseRow.level || defaultCourseMeta.level,
      lastUpdated: courseRow.lastUpdated || defaultCourseMeta.lastUpdated,
      heroVimeoId: courseRow.heroVimeoId || defaultCourseMeta.heroVimeoId,
    };
  } else {
    const courseGroups = buildCourseGroups(videos, courseCatalog);
    const activeGroup = courseGroups.find((group) => group.slug === slug);
    if (!activeGroup) notFound();
    course = activeGroup.meta;
    activeVideos = activeGroup.videos;
    activeCourseSlug = activeGroup.slug;
  }

  const { curriculum, totalLectures, heroVideoId, hasVimeo } =
    buildCurriculum(activeVideos, course.heroVimeoId);
  const coursePath = `/courses/${activeCourseSlug}`;

  const allLessons = curriculum.flatMap((section) => section.lessons);

  if (!allLessons.length) {
    return (
      <main className={`${styles.main} ${bodyFont.className}`}>
        <header className={styles.topBar}>
          <div className={styles.topLeft}>
            <Link href={coursePath} className={styles.backLink}>
              ← 강의 소개
            </Link>
            <span className={styles.topCourseTitle}>{course.title}</span>
          </div>
          <div className={styles.topRight}>
            <button type="button" className={styles.topButton}>
              수강평 작성하기
            </button>
            <button type="button" className={styles.iconButton} aria-label="공유">
              ↗
            </button>
          </div>
        </header>
        <section className={styles.emptyPanel}>
          <h1>Vimeo 영상이 없습니다.</h1>
          <p>
            Vimeo 토큰 권한을 확인하거나 업로드된 영상이 있는지 확인해 주세요.
          </p>
        </section>
      </main>
    );
  }

  const currentLesson =
    allLessons.find((lesson) => lesson.id === lessonId) ??
    allLessons[0];

  const currentIndex = Math.max(
    allLessons.findIndex((lesson) => lesson.id === currentLesson.id),
    0
  );

  const progress = Math.round(((currentIndex + 1) / allLessons.length) * 100);
  const nextLesson = allLessons[currentIndex + 1];
  const prevLesson = allLessons[currentIndex - 1];
  const videoId = hasVimeo ? currentLesson.id : heroVideoId;

  return (
    <main className={`${styles.main} ${bodyFont.className}`}>
      <header className={styles.topBar}>
        <div className={styles.topLeft}>
          <Link href={coursePath} className={styles.backLink}>
            ← 강의 소개
          </Link>
          <span className={styles.topCourseTitle}>{course.title}</span>
        </div>
        <div className={styles.topRight}>
          <button type="button" className={styles.topButton}>
            수강평 작성하기
          </button>
          <button type="button" className={styles.iconButton} aria-label="공유">
            ↗
          </button>
        </div>
      </header>

      <div className={styles.layout}>
        <section className={styles.playerPanel}>
          <div className={styles.playerFrame}>
            <iframe
              src={`https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`}
              title={course.title}
              allow="autoplay; fullscreen; picture-in-picture"
              loading="lazy"
              allowFullScreen
            />
          </div>
          <div className={styles.playerMeta}>
            <span className={styles.lessonBadge}>현재 강의</span>
            <h1 className={styles.lessonTitle}>{currentLesson.title}</h1>
            <p className={styles.lessonSub}>
              {course.instructor} · {currentLesson.duration}
            </p>
            <div className={styles.playerActions}>
              <Link
                href={
                  nextLesson
                    ? `${coursePath}/${nextLesson.id}`
                    : `${coursePath}/${currentLesson.id}`
                }
                className={`${styles.primaryBtn} ${
                  nextLesson ? "" : styles.disabled
                }`}
                aria-disabled={!nextLesson}
              >
                다음 강의
              </Link>
              <Link
                href={
                  prevLesson
                    ? `${coursePath}/${prevLesson.id}`
                    : `${coursePath}/${currentLesson.id}`
                }
                className={`${styles.secondaryBtn} ${
                  prevLesson ? "" : styles.disabled
                }`}
                aria-disabled={!prevLesson}
              >
                이전 강의
              </Link>
            </div>
          </div>
        </section>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div>
              <h2>커리큘럼</h2>
              <p>
                수강 기한 <strong>무제한</strong>
              </p>
            </div>
            <button type="button" className={styles.closeButton} aria-label="닫기">
              ×
            </button>
          </div>

          <div className={styles.progressBox}>
            <div className={styles.progressMeta}>
              <span>
                진도율 {progress}% · {currentIndex + 1}/{totalLectures}
              </span>
              <span className={styles.progressLabel}>진행중</span>
            </div>
            <div className={styles.progressBar}>
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className={styles.curriculumList}>
            {curriculum.map((section, sectionIndex) => (
              <details key={section.title} className={styles.sectionCard} open>
                <summary className={styles.sectionSummary}>
                  <span>
                    섹션 {sectionIndex + 1}. {section.title}
                  </span>
                  <span className={styles.sectionCount}>
                    {section.lessons.length}강 · {section.totalTime}
                  </span>
                </summary>
                <div className={styles.lessonList}>
                  {section.lessons.map((lesson, lessonIndex) => {
                    const isActive = lesson.id === currentLesson.id;
                    return (
                      <Link
                        key={lesson.id}
                        href={`${coursePath}/${lesson.id}`}
                        className={`${styles.lessonItem} ${
                          isActive ? styles.lessonActive : ""
                        }`}
                      >
                        <span className={styles.lessonIndex}>
                          {lessonIndex + 1}.
                        </span>
                        <div className={styles.lessonInfo}>
                          <span className={styles.lessonName}>{lesson.title}</span>
                          <span className={styles.lessonDuration}>
                            {lesson.duration}
                          </span>
                        </div>
                        <span className={styles.lessonStatus}>
                          {isActive ? "시청중" : lesson.preview ? "미리보기" : "잠김"}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </details>
            ))}
          </div>

          <div className={styles.sideNotice}>
            승인된 회원만 전체 강의를 시청할 수 있습니다.
          </div>
        </aside>
      </div>
    </main>
  );
}
