import styles from "./list.module.css";

const placeholders = Array.from({ length: 6 }, (_, index) => index);

export default function CoursesLoading() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>회원 전용 강의</span>
          <h1 className={styles.heroTitle}>강의 선택</h1>
          <p className={styles.heroSub}>강의 목록을 불러오는 중입니다.</p>
        </div>
      </section>

      <section className={styles.gridSection}>
        <div className={styles.grid}>
          {placeholders.map((index) => (
            <div key={index} className={styles.card} aria-hidden="true">
              <div className={styles.cover}>
                <div className={styles.coverFallback}>
                  <span>불러오는 중</span>
                </div>
              </div>
              <div className={styles.cardBody}>
                <h2 className={styles.cardTitle}>강의 정보를 불러오는 중입니다</h2>
                <p className={styles.cardSub}>
                  잠시만 기다려 주세요. 강의 목록을 준비하고 있습니다.
                </p>
                <div className={styles.cardMeta}>
                  <span>킹덤바이블칼리지</span>
                  <span>강의 준비중</span>
                </div>
                <div className={styles.cardAction}>불러오는 중</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
