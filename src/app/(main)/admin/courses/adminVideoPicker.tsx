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

  const selectedVideos = useMemo(
    () => selectedIds.map((id) => videos.find((v) => v.id === id)).filter(Boolean),
    [selectedIds, videos]
  );

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

      <div className={styles.videoPickerGrid}>
        <div className={styles.videoPickerList}>
          {filtered.map((video) => {
            const active = selectedIds.includes(video.id);
            return (
              <button
                key={video.id}
                type="button"
                className={`${styles.videoPickerItem} ${
                  active ? styles.videoPickerItemActive : ""
                }`}
                onClick={() => toggleVideo(video.id)}
              >
                <div>
                  <strong>{video.title}</strong>
                  <span>{video.durationLabel}</span>
                </div>
                <em>{active ? "제거" : "추가"}</em>
              </button>
            );
          })}
        </div>

        <div className={styles.videoPickerSelected}>
          <p>선택된 영상</p>
          {selectedVideos.length ? (
            <ul>
              {selectedVideos.map((video) => (
                <li key={video!.id}>
                  <span>{video!.title}</span>
                  <button
                    type="button"
                    onClick={() => toggleVideo(video!.id)}
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.matchListEmpty}>
              아직 선택된 영상이 없습니다.
            </div>
          )}
        </div>
      </div>

      <input
        type="hidden"
        name={inputName}
        value={JSON.stringify(selectedIds)}
      />
    </div>
  );
}
