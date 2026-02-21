import styles from "./loading.module.css";

export default function CourseDetailLoading() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroInfo}>
            <div className={`${styles.skeleton} ${styles.breadcrumb}`} />
            <div className={`${styles.skeleton} ${styles.title}`} />
            <div className={`${styles.skeleton} ${styles.subtitle}`} />
          </div>
          <div className={styles.heroVideo}>
            <div className={`${styles.skeleton} ${styles.videoFrame}`} />
          </div>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.contentInner}>
          <div className={styles.curriculum}>
            <div className={styles.sectionHeader}>
              <div>
                <div className={`${styles.skeleton} ${styles.sectionTitle}`} />
                <div className={`${styles.skeleton} ${styles.sectionSub}`} />
              </div>
            </div>
            <div className={styles.sectionList}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`${styles.skeleton} ${styles.lessonRow}`} />
              ))}
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={`${styles.skeleton} ${styles.noticeCard}`} />
          </aside>
        </div>
      </section>
    </main>
  );
}
