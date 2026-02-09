"use client";

import { useMemo, useState } from "react";
import styles from "./adminCourses.module.css";

type VideoItem = {
  id: string;
  title: string;
  durationLabel: string;
};

export type AdminCourseItem = {
  id: number;
  title: string;
  status: string;
  totalLectures: number;
  videos: VideoItem[];
};

const moveItem = <T,>(list: T[], fromIndex: number, toIndex: number) => {
  const updated = [...list];
  const [item] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, item);
  return updated;
};

export default function AdminCoursesClient({
  initialCourses,
}: {
  initialCourses: AdminCourseItem[];
}) {
  const [courses, setCourses] = useState(initialCourses);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [draggingVideo, setDraggingVideo] = useState<{
    courseId: number;
    videoId: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const courseIndexById = useMemo(() => {
    const map = new Map<number, number>();
    courses.forEach((course, index) => map.set(course.id, index));
    return map;
  }, [courses]);

  const persistOrder = async (nextCourses: AdminCourseItem[]) => {
    setSaving(true);
    setSavedAt(null);
    try {
      await fetch("/api/admin/courses/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderedIds: nextCourses.map((course) => course.id),
        }),
      });
      setSavedAt(new Date().toLocaleTimeString("ko-KR"));
    } finally {
      setSaving(false);
    }
  };

  const handleDrop = async (targetId: number) => {
    if (draggingId === null || draggingId === targetId) return;
    const fromIndex = courseIndexById.get(draggingId);
    const toIndex = courseIndexById.get(targetId);
    if (fromIndex === undefined || toIndex === undefined) return;
    const next = moveItem(courses, fromIndex, toIndex);
    setCourses(next);
    setDraggingId(null);
    await persistOrder(next);
  };

  const persistVideoOrder = async (
    courseId: number,
    orderedVideoIds: string[]
  ) => {
    setSaving(true);
    setSavedAt(null);
    try {
      await fetch("/api/admin/courses/videos/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, orderedVideoIds }),
      });
      setSavedAt(new Date().toLocaleTimeString("ko-KR"));
    } finally {
      setSaving(false);
    }
  };

  const handleVideoDrop = async (courseId: number, targetVideoId: string) => {
    if (!draggingVideo || draggingVideo.courseId !== courseId) return;
    const courseIndex = courseIndexById.get(courseId);
    if (courseIndex === undefined) return;
    const course = courses[courseIndex];
    const fromIndex = course.videos.findIndex(
      (video) => video.id === draggingVideo.videoId
    );
    const toIndex = course.videos.findIndex(
      (video) => video.id === targetVideoId
    );
    if (fromIndex < 0 || toIndex < 0) return;

    const reorderedVideos = moveItem(course.videos, fromIndex, toIndex);
    const nextCourses = courses.map((item) =>
      item.id === courseId
        ? { ...item, videos: reorderedVideos, totalLectures: reorderedVideos.length }
        : item
    );
    setCourses(nextCourses);
    setDraggingVideo(null);
    await persistVideoOrder(
      courseId,
      reorderedVideos.map((video) => video.id)
    );
  };

  const handleDelete = async (courseId: number) => {
    const ok = confirm("해당 강의를 삭제할까요? (매칭 규칙만 삭제됩니다)");
    if (!ok) return;
    await fetch("/api/admin/courses/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: courseId }),
    });
    setCourses((prev) => prev.filter((course) => course.id !== courseId));
  };

  if (!courses.length) {
    return (
      <div className={styles.empty}>
        등록된 강의가 없습니다. 위에서 강의를 추가해 주세요.
      </div>
    );
  }

  return (
    <div className={styles.table}>
      <div className={styles.rowHeader}>
        <span>강의명</span>
        <span>영상 수</span>
        <span>상태</span>
        <span>액션</span>
      </div>

      <div className={styles.orderHint}>
        드래그해서 순서를 변경하면 자동 저장됩니다.
        {saving && <span>저장 중...</span>}
        {savedAt && !saving && <span>저장 완료 · {savedAt}</span>}
      </div>

      {courses.map((course) => {
        return (
          <div
            key={course.id}
            className={`${styles.rowGroup} ${
              draggingId === course.id ? styles.dragging : ""
            }`}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => handleDrop(course.id)}
          >
          <div className={styles.row}>
            <div className={styles.rowDrag}>
              <button
                type="button"
                className={styles.dragHandle}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = "move";
                  setDraggingId(course.id);
                }}
                onDragEnd={() => setDraggingId(null)}
                aria-label="강의 순서 변경"
              >
                ⋮⋮
              </button>
            </div>
            <div>
              <strong>{course.title}</strong>
            </div>
            <div>{course.totalLectures}개</div>
            <div>{course.status}</div>
            <div className={styles.rowActions}>
              <button
                className={styles.ghostButton}
                type="button"
                onClick={() => handleDelete(course.id)}
              >
                삭제
              </button>
            </div>
          </div>
          <div className={styles.rowDetails}>
            <div className={styles.detailHeader}>
              <span>선택된 영상</span>
              <strong>{course.videos.length}개</strong>
              <em>드래그해서 순서 변경</em>
            </div>
            {course.videos.length ? (
              <div className={styles.videoList}>
                {course.videos.map((video) => (
                  <div
                    key={video.id}
                    className={`${styles.videoItem} ${
                      draggingVideo?.videoId === video.id ? styles.videoDragging : ""
                    }`}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      void handleVideoDrop(course.id, video.id);
                    }}
                  >
                    <button
                      type="button"
                      className={styles.dragHandle}
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = "move";
                        event.stopPropagation();
                        setDraggingVideo({ courseId: course.id, videoId: video.id });
                      }}
                      onDragEnd={() => setDraggingVideo(null)}
                      aria-label="영상 순서 변경"
                    >
                      ⋮⋮
                    </button>
                    <span className={styles.videoTitle}>{video.title}</span>
                    <span className={styles.videoDuration}>
                      {video.durationLabel}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.matchListEmpty}>
                선택된 영상이 없습니다.
              </div>
            )}
          </div>
        </div>
        );
      })}
    </div>
  );
}
