import styles from "./adminCourses.module.css";

export default function AdminCoursesLoading() {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>KBC Admin</p>
          <h1 className={styles.title}>강의 관리</h1>
          <p className={styles.subtitle}>
            Vimeo 강의 데이터를 불러오는 중입니다. 잠시만 기다려 주세요.
          </p>
        </div>
        <div className={styles.actions}>
          <button className={styles.secondaryButton} type="button" disabled>
            강의 생성
          </button>
          <button className={styles.primaryButton} type="button" disabled>
            Vimeo 동기화
          </button>
        </div>
      </header>

      <div className={styles.stats}>
        <div>
          <span>전체 강의</span>
          <strong>...</strong>
        </div>
        <div>
          <span>영상</span>
          <strong>...</strong>
        </div>
      </div>

      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h2>강의 정보를 준비하는 중입니다</h2>
          <p>Vimeo 응답을 받아오면 목록이 바로 표시됩니다.</p>
        </div>
        <div className={styles.projectFilter}>
          <span className={styles.projectHint}>
            폴더와 영상 목록을 불러오는 중입니다.
          </span>
        </div>
      </div>
    </section>
  );
}
