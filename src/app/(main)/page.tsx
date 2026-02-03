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

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>24</span>
          <span className={styles.statLabel}>과목 수</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>18</span>
          <span className={styles.statLabel}>주 과정</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>500+</span>
          <span className={styles.statLabel}>수료생</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>4</span>
          <span className={styles.statLabel}>단과대학</span>
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

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <h2 className={styles.sectionTitle}>수강생 후기</h2>
        <div className={styles.testimonialGrid}>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>
              "KBC를 통해 성경을 체계적으로 배울 수 있었습니다. 
              단순한 지식이 아닌, 삶을 변화시키는 말씀의 능력을 경험했습니다."
            </p>
            <div className={styles.testimonialAuthor}>
              <span className={styles.authorName}>김OO 집사</span>
              <span className={styles.authorInfo}>성경대학 3기 수료</span>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>
              "상담대학 과정을 통해 사람들의 아픔에 더 깊이 다가갈 수 있게 되었습니다. 
              현장 실습이 특히 도움이 되었습니다."
            </p>
            <div className={styles.testimonialAuthor}>
              <span className={styles.authorName}>이OO 권사</span>
              <span className={styles.authorInfo}>상담대학 2기 수료</span>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>
              "해외 단기 선교 실습을 통해 선교의 열정을 다시 불태울 수 있었습니다. 
              실제적인 사역 훈련이 큰 도움이 됩니다."
            </p>
            <div className={styles.testimonialAuthor}>
              <span className={styles.authorName}>박OO 목사</span>
              <span className={styles.authorInfo}>선교대학 1기 수료</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <h2>지금 바로 시작하세요</h2>
        <p>하나님 나라의 일꾼으로 세워지는 여정에 함께하세요</p>
        <button className={styles.ctaBtn}>수강 신청하기</button>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>KINGDOM BIBLE COLLEGE</h4>
            <p className={styles.footerDesc}>
              말씀으로 세워지는 하나님 나라의 일꾼을 양성합니다.
            </p>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>단과대학</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#">성경대학</a></li>
              <li><a href="#">상담대학</a></li>
              <li><a href="#">영성대학</a></li>
              <li><a href="#">선교대학</a></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>바로가기</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#">KBC 소개</a></li>
              <li><a href="#">강의 목록</a></li>
              <li><a href="#">수강 신청</a></li>
              <li><a href="#">자주 묻는 질문</a></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>연락처</h4>
            <ul className={styles.footerContact}>
              <li>📧 info@kingdombible.org</li>
              <li>📞 02-1234-5678</li>
              <li>📍 서울특별시 강남구</li>
            </ul>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>© 2026 Kingdom Bible College. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}