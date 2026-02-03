import styles from '../page.module.css';

export default function IntroductionPage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>KBC 소개</h1>
        <p className={styles.heroSubtitle}>Kingdom Bible College</p>
      </section>

      <section className={styles.contentPlaceholder}>
        <p>콘텐츠가 준비 중입니다.</p>
      </section>
    </main>
  );
}
