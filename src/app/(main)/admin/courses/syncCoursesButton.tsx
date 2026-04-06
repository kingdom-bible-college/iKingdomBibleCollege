"use client";

import { useFormStatus } from "react-dom";
import styles from "./adminCourses.module.css";

export default function SyncCoursesButton() {
  const { pending } = useFormStatus();

  return (
    <button className={styles.primaryButton} type="submit" disabled={pending}>
      {pending ? "동기화 중..." : "Vimeo 동기화"}
    </button>
  );
}
