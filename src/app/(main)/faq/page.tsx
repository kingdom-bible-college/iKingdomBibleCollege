import styles from './page.module.css';
import FaqContent from './FaqContent';

export default function FaqPage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>FAQ</h1>
        <p className={styles.heroSubtitle}>자주 묻는 질문</p>
      </section>

      <FaqContent />

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>원하는 답변을 찾지 못하셨나요?</h2>
        <p className={styles.ctaText}>
          아래 연락처로 문의해주시면 친절히 안내해드리겠습니다.
        </p>
        <div className={styles.ctaContacts}>
          <div className={styles.ctaItem}>
            <span className={styles.ctaLabel}>이메일</span>
            <span className={styles.ctaValue}>ikingdombiblecollege@gmail.com</span>
          </div>
          <div className={styles.ctaItem}>
            <span className={styles.ctaLabel}>대표전화</span>
            <span className={styles.ctaValue}>042-824-3242</span>
          </div>
          <div className={styles.ctaItem}>
            <span className={styles.ctaLabel}>사무처장</span>
            <span className={styles.ctaValue}>도현우 010-3542-3703</span>
          </div>
        </div>
      </section>
    </main>
  );
}
