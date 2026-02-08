import Link from "next/link";
import styles from "./course.module.css";
import { Manrope } from "next/font/google";
import {
  resources,
  tabs,
  defaultCourseMeta,
  courseCatalog,
} from "../courseData";
import { getVimeoVideos } from "@/lib/vimeo";
import { buildCourseGroups, buildCurriculum } from "../courseUtils";
import { requireUser } from "@/lib/auth/session";
import { getCourses } from "@/db/queries/courses";
import { getCourseVideoOrdersByCourseIds } from "@/db/queries/courseVideoOrders";
import { formatTotalDuration } from "@/lib/time";

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type PageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function CourseDetailPage({ params }: PageProps) {
  await requireUser();
  const resolvedParams = await params;
  const videos = await getVimeoVideos();
  const courseRows = await getCourses();
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
    activeCourses.length > 0
      ? manualGroups
      : buildCourseGroups(videos, courseCatalog);
  const activeGroup =
    courseGroups.find((group) => group.slug === resolvedParams.courseId) ??
    courseGroups[0];
  const course = activeGroup?.meta ?? defaultCourseMeta;
  const activeVideos = activeGroup ? activeGroup.videos : [];
  const activeCourseId = activeGroup?.slug ?? resolvedParams.courseId;
  const { curriculum, totalLectures, totalDuration, heroVideoId, hasVimeo } =
    buildCurriculum(activeVideos, course.heroVimeoId);

  return (
    <main className={`${styles.main} ${bodyFont.className}`}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroInfo}>
            <p className={styles.breadcrumb}>강의 &gt; 리더십 트랙</p>
            <h1 className={styles.heroTitle}>{course.title}</h1>
            <p className={styles.heroSubtitle}>{course.subtitle}</p>
            <div className={styles.heroMeta}>
              <span className={styles.badgePrimary}>회원 전용</span>
              <span className={styles.metaItem}>강사: {course.instructor}</span>
              <span className={styles.metaItem}>난이도: {course.level}</span>
              <span className={styles.metaItem}>업데이트: {course.lastUpdated}</span>
            </div>
            <div className={styles.resourceRow}>
              <span className={styles.resourceLabel}>제공 자료</span>
              <div className={styles.resourceTags}>
                {resources.map((item) => (
                  <span key={item} className={styles.resourceTag}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.heroVideo}>
            <div className={styles.videoFrame}>
              <iframe
                src={`https://player.vimeo.com/video/${heroVideoId}?title=0&byline=0&portrait=0`}
                title={course.title}
                allow="autoplay; fullscreen; picture-in-picture"
                loading="lazy"
                allowFullScreen
              />
            </div>
            <div className={styles.videoNotice}>
              승인된 회원만 전체 강의를 시청할 수 있습니다.
            </div>
          </div>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.contentInner}>
          <div className={styles.curriculum}>
            <div className={styles.tabs}>
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  type="button"
                  className={`${styles.tab} ${index === 0 ? styles.tabActive : ""}`}
                >
                  {tab}
                </button>
              ))}
            </div>

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
                            {lesson.preview && (
                              <span className={styles.previewBadge}>미리보기</span>
                            )}
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
              <div className={styles.enrollCard}>
                <span className={styles.approvalBadge}>회원 승인 필요</span>
                <h3 className={styles.enrollTitle}>승인된 계정만 시청 가능</h3>
                <p className={styles.enrollDesc}>
                  강의 신청 후 운영진 승인 완료 시 모든 Vimeo 강의를
                  시청할 수 있습니다.
                </p>
                <button type="button" className={styles.primaryBtn}>
                  승인 요청하기
                </button>
                <button type="button" className={styles.secondaryBtn}>
                  문의하기
                </button>
                <div className={styles.enrollMeta}>
                  <div>
                    <span>강사</span>
                    <strong>{course.instructor}</strong>
                  </div>
                  <div>
                    <span>수업 구성</span>
                    <strong>{totalLectures}개 강의</strong>
                  </div>
                  <div>
                    <span>총 학습 시간</span>
                    <strong>{totalDuration}</strong>
                  </div>
                  <div>
                    <span>난이도</span>
                    <strong>{course.level}</strong>
                  </div>
                </div>
              </div>

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
