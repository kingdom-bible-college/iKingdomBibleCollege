"use client";

import { useFormStatus } from "react-dom";
import styles from "./adminCourses.module.css";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className={styles.primaryButton}
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!pending && !confirm("강의를 등록하시겠습니까?")) {
          e.preventDefault();
        }
      }}
    >
      {pending ? "등록 중..." : "강의 등록"}
    </button>
  );
}
