import styles from '../page.module.css';

export default function AdmissionPage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>2026학년도 모집요강</h1>
        <p className={styles.heroSubtitle}>KBC 소개</p>
      </section>

      <section className={styles.contentPlaceholder}>
        <p>콘텐츠가 준비 중입니다.</p>
      </section>
    </main>
  );
}
