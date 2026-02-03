import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            KINGDOM<br />
            BIBLE<br />
            COLLEGE
          </h1>
          <button className={styles.heroBtn}>KBC 소개</button>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.about}>
        <div className={styles.emblem}>🏛️</div>
        <p className={styles.aboutLabel}>• 킹덤바이블칼리지 소개 •</p>
        <div className={styles.aboutContent}>
          <p>
            KINGDOM BIBLE COLLEGE는 <strong>성경, 상담, 영성, 선교</strong><br />
            4개의 단과대학으로 구성되어 있으며 24개 과목을 18주 동안 집중 강의합니다.
          </p>
          <p>
            국내 사역 현장 그리고 해외 단기 선교 실습으로 구성된 새로운 시대의 영성과<br />
            현장성을 겸비한 사도행전적 사역자를 양성하는데 그 목적이 있습니다.
          </p>
        </div>
      </section>

      {/* Colleges Section */}
      <section className={styles.colleges}>
        <div className={styles.collegeCard} style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400")'}}>
          <div className={styles.collegeInfo}>
            <h3>BIBLE<br />COLLEGE</h3>
            <div className={styles.divider}></div>
            <span className={styles.collegeKr}>성경</span>
          </div>
        </div>
        <div className={styles.collegeCard} style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400")'}}>
          <div className={styles.collegeInfo}>
            <h3>COUNSELING<br />COLLEGE</h3>
            <div className={styles.divider}></div>
            <span className={styles.collegeKr}>상담</span>
          </div>
        </div>
        <div className={styles.collegeCard} style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400")'}}>
          <div className={styles.collegeInfo}>
            <h3>SPIRITUALITY<br />COLLEGE</h3>
            <div className={styles.divider}></div>
            <span className={styles.collegeKr}>영성</span>
          </div>
        </div>
        <div className={styles.collegeCard} style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400")'}}>
          <div className={styles.collegeInfo}>
            <h3>MISSION FIELD<br />COLLEGE</h3>
            <div className={styles.divider}></div>
            <span className={styles.collegeKr}>선교</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>🏛️ KINGDOM BIBLE COLLEGE</div>
      </footer>
    </main>
  );
}