"use client";

import { useMemo, useState } from "react";
import styles from "./adminCourses.module.css";

type PickerVideo = {
  id: string;
  title: string;
  durationLabel: string;
  thumbnail?: string | null;
};

export default function AdminVideoPicker({
  videos,
  inputName,
}: {
  videos: PickerVideo[];
  inputName: string;
}) {
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return videos;
    return videos.filter((video) =>
      video.title.toLowerCase().includes(keyword)
    );
  }, [query, videos]);

  const toggleVideo = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const removeVideo = (id: string) => {
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const selectedVideos = useMemo(
    () =>
      selectedIds
        .map((id) => videos.find((v) => v.id === id))
        .filter((v): v is PickerVideo => Boolean(v)),
    [selectedIds, videos]
  );

  const handleDrop = (targetId: string) => {
    if (draggingId === null || draggingId === targetId) return;
    setSelectedIds((prev) => {
      const fromIndex = prev.indexOf(draggingId);
      const toIndex = prev.indexOf(targetId);
      if (fromIndex < 0 || toIndex < 0) return prev;
      const updated = [...prev];
      const [item] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, item);
      return updated;
    });
    setDraggingId(null);
  };

  return (
    <div className={styles.videoPicker}>
      <div className={styles.videoPickerHeader}>
        <h3>영상 선택</h3>
        <span>{selectedIds.length}개 선택됨</span>
      </div>
      <div className={styles.videoPickerSearch}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="영상 제목으로 검색하세요"
        />
      </div>

      <div className={styles.videoPickerList}>
        {filtered.map((video) => {
          const checked = selectedIds.includes(video.id);
          return (
            <label
              key={video.id}
              className={`${styles.videoPickerItem} ${
                checked ? styles.videoPickerItemActive : ""
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleVideo(video.id)}
                className={styles.videoCheckbox}
              />
              <div>
                <strong>{video.title}</strong>
                <span>{video.durationLabel}</span>
              </div>
            </label>
          );
        })}
      </div>

      <div className={styles.videoPickerSelected}>
        <p>선택된 영상 순서 (드래그해서 순서 변경)</p>
        {selectedVideos.length ? (
          <div className={styles.videoList}>
            {selectedVideos.map((video) => (
              <div
                key={video.id}
                className={`${styles.videoItem} ${
                  draggingId === video.id ? styles.videoDragging : ""
                }`}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleDrop(video.id);
                }}
              >
                <button
                  type="button"
                  className={styles.dragHandle}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = "move";
                    event.stopPropagation();
                    setDraggingId(video.id);
                  }}
                  onDragEnd={() => setDraggingId(null)}
                  aria-label="영상 순서 변경"
                >
                  ⋮⋮
                </button>
                <span className={styles.videoTitle}>{video.title}</span>
                <span className={styles.videoDuration}>
                  {video.durationLabel}
                </span>
                <button
                  type="button"
                  className={styles.videoRemoveButton}
                  onClick={() => removeVideo(video.id)}
                >
                  제거
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.matchListEmpty}>
            아직 선택된 영상이 없습니다.
          </div>
        )}
      </div>

      <input
        type="hidden"
        name={inputName}
        value={JSON.stringify(selectedIds)}
      />
    </div>
  );
}
