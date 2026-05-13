"use client";

import { useEffect } from "react";
import styles from "./adminCourses.module.css";

export default function AdminCoursesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin courses page failed", error);
  }, [error]);

  return (
    <section className={styles.page}>
      <div className={styles.empty}>
        강의 관리 화면을 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.
        <div className={styles.formActions}>
          <button type="button" className={styles.primaryButton} onClick={reset}>
            다시 불러오기
          </button>
        </div>
      </div>
    </section>
  );
}
