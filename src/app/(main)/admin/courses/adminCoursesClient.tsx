"use client";

import { useMemo, useState } from "react";
import styles from "./adminCourses.module.css";

const MAX_THUMBNAIL_DIMENSION = 1440;
const THUMBNAIL_OUTPUT_TYPE = "image/jpeg";
const THUMBNAIL_QUALITY = 0.82;

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("이미지를 읽을 수 없습니다."));
    };
    reader.onerror = () => reject(new Error("이미지를 읽을 수 없습니다."));
    reader.readAsDataURL(file);
  });

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("이미지를 불러올 수 없습니다."));
    image.src = src;
  });

const resizeThumbnail = async (file: File) => {
  if (!file.type.startsWith("image/")) {
    throw new Error("이미지 파일만 업로드할 수 있습니다.");
  }

  const source = await readFileAsDataUrl(file);
  const image = await loadImage(source);
  const longestEdge = Math.max(image.width, image.height);
  const scale =
    longestEdge > MAX_THUMBNAIL_DIMENSION
      ? MAX_THUMBNAIL_DIMENSION / longestEdge
      : 1;

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("이미지 처리를 시작할 수 없습니다.");
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL(THUMBNAIL_OUTPUT_TYPE, THUMBNAIL_QUALITY);
};

type VideoItem = {
  id: string;
  title: string;
  durationLabel: string;
  thumbnail: string | null;
};

export type AdminCourseItem = {
  id: number;
  coverImage: string | null;
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

  const persistThumbnail = async (courseId: number, coverImage: string | null) => {
    setSaving(true);
    setSavedAt(null);
    try {
      const response = await fetch("/api/admin/courses/thumbnail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, coverImage }),
      });
      if (!response.ok) {
        alert("대표 썸네일 저장에 실패했습니다.");
        return false;
      }

      setSavedAt(new Date().toLocaleTimeString("ko-KR"));
      return true;
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

  const handleThumbnailUpload = async (courseId: number, file: File | null) => {
    if (!file) return;

    try {
      const coverImage = await resizeThumbnail(file);
      const updated = await persistThumbnail(courseId, coverImage);
      if (!updated) return;

      setCourses((prev) =>
        prev.map((course) =>
          course.id === courseId ? { ...course, coverImage } : course
        )
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "대표 썸네일 업로드에 실패했습니다.";
      alert(message);
    }
  };

  const handleThumbnailClear = async (courseId: number) => {
    const updated = await persistThumbnail(courseId, null);
    if (!updated) return;

    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId ? { ...course, coverImage: null } : course
      )
    );
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
            <div className={styles.heroPreview}>
              <div className={styles.heroPreviewThumb}>
                {course.coverImage ? (
                  <img
                    src={course.coverImage}
                    alt={`${course.title} 대표 썸네일`}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className={styles.heroPreviewFallback}>
                    대표 썸네일 없음
                  </div>
                )}
              </div>
              <div className={styles.heroPreviewInfo}>
                <span className={styles.heroPreviewLabel}>현재 대표 썸네일</span>
                <strong>
                  {course.coverImage
                    ? "업로드된 대표 이미지 사용 중"
                    : "업로드된 대표 이미지가 없습니다."}
                </strong>
                <p>강의 카드 목록에 사용됩니다. 16:9 비율 이미지를 권장합니다.</p>
                <div className={styles.heroPreviewActions}>
                  <label className={`${styles.ghostButton} ${styles.uploadLabel}`}>
                    이미지 업로드
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className={styles.hiddenFileInput}
                      onChange={(event) => {
                        const file = event.target.files?.[0] ?? null;
                        void handleThumbnailUpload(course.id, file);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>
                  {course.coverImage ? (
                    <button
                      type="button"
                      className={styles.ghostButton}
                      onClick={() => void handleThumbnailClear(course.id)}
                    >
                      삭제
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
            {course.videos.length ? (
              <div className={styles.videoList}>
                {course.videos.map((video) => {
                  return (
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
                    <div className={styles.videoMeta}>
                      <div className={styles.videoThumb}>
                        {video.thumbnail ? (
                          <img
                            src={video.thumbnail}
                            alt={`${video.title} 썸네일`}
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className={styles.videoThumbFallback}>썸네일</div>
                        )}
                      </div>
                      <div className={styles.videoCopy}>
                        <span className={styles.videoTitle}>{video.title}</span>
                        <span className={styles.videoDuration}>
                          {video.durationLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                  );
                })}
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
