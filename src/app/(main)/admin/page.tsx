import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import styles from "./adminLanding.module.css";

export default async function AdminLandingPage() {
  await requireAdmin();

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>KBC Admin</p>
          <h1 className={styles.title}>관리자 대시보드</h1>
          <p className={styles.subtitle}>
            회원 승인과 강의 운영을 한 곳에서 관리하세요.
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        <Link className={styles.card} href="/admin/users">
          <h2>회원 승인</h2>
          <p>승인 대기 목록을 확인하고 접근 권한을 부여합니다.</p>
          <span className={styles.cta}>승인 관리로 이동 →</span>
        </Link>
        <Link className={styles.card} href="/admin/courses">
          <h2>강의 관리</h2>
          <p>강의 업로드, 섹션 구성, 노출 여부를 관리합니다.</p>
          <span className={styles.cta}>강의 관리로 이동 →</span>
        </Link>
        <div className={`${styles.card} ${styles.disabled}`}>
          <h2>공지/알림</h2>
          <p>수강생에게 공지사항과 메시지를 발송합니다.</p>
          <span className={styles.cta}>준비 중</span>
        </div>
      </div>
    </section>
  );
}
