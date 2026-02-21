import Link from "next/link";
import CountUp from "@/components/CountUp";
import styles from "./page.module.css";

// Force deployment update

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section - 3 Split */}
      <section className={styles.hero}>
        <div className={`${styles.heroPanel} ${styles.panel1}`}>
          <span className={styles.panelBgText}>IDENTITY</span>
          <div className={styles.panelContent}>
            <span className={styles.panelNumber}>01</span>
            <h2 className={styles.panelTitle}>
              정체성의<br />뿌리
            </h2>
            <div className={styles.panelDivider}></div>
            <p className={styles.panelText}>
              KBC는 사역 이전에<br />정체성의 뿌리를 깊이 내리기 위한<br />훈련입니다.
            </p>
          </div>
        </div>
        <div className={`${styles.heroPanel} ${styles.panel2}`}>
          <span className={styles.panelBgText}>MISSION</span>
          <div className={styles.panelContent}>
            <span className={styles.panelNumber}>02</span>
            <h2 className={styles.panelTitle}>
              선교에<br />동참
            </h2>
            <div className={styles.panelDivider}></div>
            <p className={styles.panelText}>
              KBC는 하나님의 선교를<br />이해하고 동참하기 위한<br />자리입니다.
            </p>
          </div>
        </div>
        <div className={`${styles.heroPanel} ${styles.panel3}`}>
          <span className={styles.panelBgText}>FAITH</span>
          <div className={styles.panelContent}>
            <span className={styles.panelNumber}>03</span>
            <h2 className={styles.panelTitle}>
              믿음의<br />정렬
            </h2>
            <div className={styles.panelDivider}></div>
            <p className={styles.panelText}>
              KBC는 파송받기 전에<br />반드시 거쳐야 할<br />믿음의 정렬 과정입니다.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.about}>
        <div className={styles.aboutInner}>
          <div className={styles.aboutLeft}>
            <span className={styles.aboutLabel}>ABOUT KBC</span>
            <h2 className={styles.aboutTitle}>
              킹덤바이블칼리지는<br />
              어떤 학교인가?
            </h2>
            <p className={styles.aboutDesc}>
              국내 사역 현장 그리고 해외 단기 선교 실습으로 구성된
              새로운 시대의 영성과 현장성을 겸비한
              사도행전적 사역자를 양성하는데 그 목적이 있습니다.
            </p>
            <Link href="/about?menu=introduction" className={styles.aboutBtn}>
              자세히 보기
            </Link>
          </div>
          <div className={styles.aboutRight}>
            <div className={styles.aboutCardGrid}>
              <div className={styles.aboutCard}>
                <span className={styles.aboutCardNumber}>01</span>
                <h3 className={styles.aboutCardTitle}>성경</h3>
                <p className={styles.aboutCardDesc}>BIBLE COLLEGE</p>
              </div>
              <div className={styles.aboutCard}>
                <span className={styles.aboutCardNumber}>02</span>
                <h3 className={styles.aboutCardTitle}>상담</h3>
                <p className={styles.aboutCardDesc}>COUNSELING COLLEGE</p>
              </div>
              <div className={styles.aboutCard}>
                <span className={styles.aboutCardNumber}>03</span>
                <h3 className={styles.aboutCardTitle}>영성</h3>
                <p className={styles.aboutCardDesc}>SPIRITUALITY COLLEGE</p>
              </div>
              <div className={styles.aboutCard}>
                <span className={styles.aboutCardNumber}>04</span>
                <h3 className={styles.aboutCardTitle}>선교</h3>
                <p className={styles.aboutCardDesc}>MISSION FIELD COLLEGE</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className={styles.stats}>
        <div className={styles.statItem}>
          <CountUp end={484} suffix="+" className={styles.statNumber} />
          <span className={styles.statLabel}>전체 수강생</span>
        </div>
        <div className={styles.statItem}>
          <CountUp end={250} suffix="+" className={styles.statNumber} />
          <span className={styles.statLabel}>수료자</span>
        </div>
        <div className={styles.statItem}>
          <CountUp end={4} className={styles.statNumber} />
          <span className={styles.statLabel}>기수 운영</span>
        </div>
        <div className={styles.statItem}>
          <CountUp end={24} className={styles.statNumber} />
          <span className={styles.statLabel}>강좌 수</span>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <p className={styles.sectionLabel}>TESTIMONIALS</p>
        <h2 className={styles.sectionTitle}>수강 후기</h2>
        <div className={styles.testimonialGrid}>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>
              &ldquo;막연하게만 생각하던 선교가 더 이상 추상적인 개념이 아니게 되었습니다. 선교는 특별한 사람의 일이 아니라, 복음을 받은 모든 성도의 사명임을 깨닫는 시간이었습니다.&rdquo;
            </p>
          </div>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>
              &ldquo;선교에 대한 편견이 깨지고, 하나님 나라를 향한 시야가 넓어졌습니다.&rdquo;
            </p>
          </div>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>
              &ldquo;다양한 강사진을 통해 성경, 선교, 영성, 리더십을 체계적으로 배울 수 있어 유익했습니다.&rdquo;
            </p>
          </div>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>
              &ldquo;소극적인 신앙에서 벗어나, 적극적으로 하나님 나라를 살아내는 삶을 꿈꾸게 되었습니다.&rdquo;
            </p>
          </div>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>
              &ldquo;예배를 드리는 차원을 넘어, 배우고 적용하며 삶으로 연결되는 시간이었습니다.&rdquo;
            </p>
          </div>
        </div>
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
              <li>
                <a href="#">성경대학</a>
              </li>
              <li>
                <a href="#">상담대학</a>
              </li>
              <li>
                <a href="#">영성대학</a>
              </li>
              <li>
                <a href="#">선교대학</a>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>바로가기</h4>
            <ul className={styles.footerLinks}>
              <li>
                <a href="#">KBC 소개</a>
              </li>
              <li>
                <a href="#">강의 목록</a>
              </li>
              <li>
                <a href="#">수강 신청</a>
              </li>
              <li>
                <a href="#">자주 묻는 질문</a>
              </li>
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
