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
        if (!pending && !confirm("선택한 게시 상태로 강의를 저장하시겠습니까?")) {
          e.preventDefault();
        }
      }}
    >
      {pending ? "저장 중..." : "강의 저장"}
    </button>
  );
}
