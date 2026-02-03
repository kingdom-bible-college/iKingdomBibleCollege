import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            말씀으로 세워지는<br />
            <span className={styles.highlight}>Kingdom Bible College</span>
          </h1>
          <p className={styles.subtitle}>
            하나님 나라의 일꾼을 세우는 온라인 성경 대학입니다.
            체계적인 성경 공부와 신학 강의를 통해 믿음의 깊이를 더하세요.
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.primaryBtn}>강의 둘러보기</button>
            <button className={styles.secondaryBtn}>무료 체험하기</button>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.floatingCard}>
            <span className={styles.cardIcon}>📖</span>
            <span>성경 강의</span>
          </div>
          <div className={styles.floatingCard}>
            <span className={styles.cardIcon}>✝️</span>
            <span>신학 과정</span>
          </div>
          <div className={styles.floatingCard}>
            <span className={styles.cardIcon}>🙏</span>
            <span>경건 훈련</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>왜 Kingdom Bible College인가요?</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📱</div>
            <h3>언제 어디서나</h3>
            <p>모바일, 태블릿, PC 어디서든 말씀을 공부하세요.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📚</div>
            <h3>체계적인 커리큘럼</h3>
            <p>구약부터 신약까지, 단계별 성경 공부 과정을 제공합니다.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>�‍🏫</div>
            <h3>전문 강사진</h3>
            <p>신학교 출신 목사님과 전문 사역자들의 강의를 들으세요.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📜</div>
            <h3>수료증 발급</h3>
            <p>각 과정 수료 시 공식 수료증을 발급받으세요.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <h2>지금 바로 시작하세요</h2>
        <p>첫 달 무료로 모든 강의를 수강할 수 있습니다.</p>
        <button className={styles.primaryBtn}>무료로 시작하기</button>
      </section>
    </main>
  );
}