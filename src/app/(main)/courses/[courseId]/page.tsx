import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./course.module.css";
import { Manrope } from "next/font/google";
import {
  defaultCourseMeta,
  courseCatalog,
} from "../courseData";
import { getVimeoVideos } from "@/lib/vimeo";
import { buildCourseGroups, buildCurriculum } from "../courseUtils";
import { requireUser } from "@/lib/auth/session";
import { getCourseBySlug } from "@/db/queries/courses";
import { getCourseVideoOrdersByCourseIds } from "@/db/queries/courseVideoOrders";

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type PageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function CourseDetailPage({ params }: PageProps) {
  await requireUser();
  const { courseId } = await params;
  const slug = decodeURIComponent(courseId);
  const videos = await getVimeoVideos();
  const videoMap = new Map(videos.map((video) => [video.id, video]));

  // 1) DB에서 slug로 직접 조회
  const courseRow = await getCourseBySlug(slug);

  let course = defaultCourseMeta;
  let activeVideos: typeof videos = [];
  let activeCourseId = slug;

  if (courseRow) {
    // DB 강의 → 해당 강의의 비디오만 로드
    const orderRows = await getCourseVideoOrdersByCourseIds([courseRow.id]);
    const orderedIds = orderRows.map((row) => row.vimeoId);
    activeVideos = orderedIds
      .map((id) => videoMap.get(id))
      .filter((video): video is NonNullable<typeof video> => Boolean(video));
    activeCourseId = courseRow.slug;
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
    // 2) DB에 없으면 catalog 기반 폴백
    const courseGroups = buildCourseGroups(videos, courseCatalog);
    const activeGroup = courseGroups.find((group) => group.slug === slug);
    if (!activeGroup) notFound();
    course = activeGroup.meta;
    activeVideos = activeGroup.videos;
    activeCourseId = activeGroup.slug;
  }

  const { curriculum, totalLectures, totalDuration, heroVideoId, hasVimeo } =
    buildCurriculum(activeVideos, course.heroVimeoId);
  const hashMap = new Map(activeVideos.map((v) => [v.id, v.hash]));
  const heroHash = hashMap.get(heroVideoId);
  const heroEmbedSrc = `https://player.vimeo.com/video/${heroVideoId}${heroHash ? `?h=${heroHash}&` : '?'}title=0&byline=0&portrait=0`;

  return (
    <main className={`${styles.main} ${bodyFont.className}`}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroInfo}>
            <p className={styles.breadcrumb}>강의 &gt; 리더십 트랙</p>
            <h1 className={styles.heroTitle}>{course.title}</h1>
            <p className={styles.heroSubtitle}>{course.subtitle}</p>
          </div>

          <div className={styles.heroVideo}>
            <div className={styles.videoFrame}>
              <iframe
                src={heroEmbedSrc}
                title={course.title}
                allow="autoplay; fullscreen; picture-in-picture"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.contentInner}>
          <div className={styles.curriculum}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>커리큘럼</h2>
                <p className={styles.sectionSub}>
                  해당 강의에서 제공:{" "}
                  <span className={styles.inlineTag}>수업자료</span>
                </p>
              </div>
              <div className={styles.sectionActions}>
                <span className={styles.sectionTotal}>
                  전체 {totalLectures}개 · ({totalDuration})
                </span>
                <button type="button" className={styles.expandButton}>
                  모두 펼치기
                </button>
              </div>
            </div>

            <div className={styles.sectionList}>
              {hasVimeo ? (
                curriculum.map((section, index) => (
                  <details
                    key={section.title}
                    className={styles.sectionCard}
                    open={index === 0}
                  >
                    <summary className={styles.sectionSummary}>
                      <span>
                        섹션 {index + 1}. {section.title}
                      </span>
                      <span className={styles.sectionCount}>
                        {section.lessons.length}개 · ({section.totalTime})
                      </span>
                    </summary>
                    <div className={styles.lessonList}>
                      {section.lessons.map((lesson, lessonIndex) => (
                        <Link
                          key={lesson.id}
                          href={`/courses/${activeCourseId}/${lesson.id}`}
                          className={styles.lessonRow}
                        >
                          <div className={styles.lessonTitle}>
                            <span className={styles.lessonIndex}>
                              {lessonIndex + 1}.
                            </span>
                            <span>{lesson.title}</span>
                            {lesson.type === "자료" && (
                              <span className={styles.fileBadge}>자료</span>
                            )}
                          </div>
                          <div className={styles.lessonMeta}>
                            <span>{lesson.duration}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </details>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <h3 className={styles.emptyTitle}>Vimeo 영상이 없습니다.</h3>
                  <p className={styles.emptyDesc}>
                    토큰 권한을 확인하거나 Vimeo에 업로드된 영상이 있는지 확인해
                    주세요.
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.stickyCard}>
              <div className={styles.noticeCard}>
                <h4>학습 안내</h4>
                <p>
                  수강 승인 후 강의 자료와 Q&A 공간이 제공됩니다. 학습 진행 중
                  문의가 있으면 담당자에게 바로 요청하세요.
                </p>
                <ul>
                  <li>승인된 회원만 전체 영상 열람</li>
                  <li>학습 자료 상시 다운로드</li>
                  <li>질문/피드백 세션 제공</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
