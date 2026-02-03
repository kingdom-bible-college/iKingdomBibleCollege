'use client';

import { useState } from 'react';
import styles from './page.module.css';

type MenuType = 'recommendation' | 'greeting' | 'introduction' | 'admission' | 'partners';

const menuItems: { id: MenuType; title: string }[] = [
  { id: 'recommendation', title: '이사장 · 자문위원 추천사' },
  { id: 'greeting', title: '학장 인사' },
  { id: 'introduction', title: 'KBC 소개' },
  { id: 'admission', title: '2026학년도 모집요강' },
  { id: 'partners', title: '협력기관(MOU) 현황' },
];

export default function AboutPage() {
  const [activeMenu, setActiveMenu] = useState<MenuType>('recommendation');

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>KBC 소개</h1>
        <p className={styles.heroSubtitle}>Kingdom Bible College</p>
      </section>

      {/* Sidebar + Content Layout */}
      <section className={styles.contentWrapper}>
        {/* Left Sidebar */}
        <aside className={styles.sidebar}>
          <ul className={styles.menuList}>
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`${styles.menuItem} ${activeMenu === item.id ? styles.active : ''}`}
                  onClick={() => setActiveMenu(item.id)}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Right Content Area */}
        <div className={styles.contentArea}>
          {/* 이사장 · 자문위원 추천사 */}
          {activeMenu === 'recommendation' && (
            <div className={styles.contentSection}>
              <h2 className={styles.contentTitle}>이사장 · 자문위원 추천사</h2>
              
              {/* 이사장 추천사 */}
              <div className={styles.recommendCard}>
                <h3 className={styles.recommendSubtitle}>이사장 추천사</h3>
                <div className={styles.recommendContent}>
                  <div className={styles.profileSection}>
                    <div className={styles.profileIcon}>👤</div>
                    <div className={styles.profileInfo}>
                      <strong>이영한 목사</strong>
                      <span>한빛제일교회 원로 / 강사사역원 대표</span>
                    </div>
                  </div>
                  <div className={styles.recommendText}>
                    <p>
                      우리가 살아가는 이 시대는 지구촌을 삼키려는 흑암의 세력들로 인한 영적인 절망과 탄식, 
                      포기와 타협의 소리로 짓눌려 있는 상황입니다. 이러한 긴박한 상황에서 비전스테이션 황성은 
                      목사님을 중심으로 킹덤바이블칼리지를 열어주신 주님께 감사와 영광과 찬양을 올려드립니다.
                    </p>
                    <p>
                      이 시대에 하나님의 꿈을 사역자들이 모여 급소하게 가르치는 가운데 영성, 지성, 
                      영적 야성을 함께 살려내야 한다는 거룩한 몸부리으로 매들이 되었습니다. 마지막 시대를 
                      살아가는 우리 시대의 젊은 사역자들, 그들의 문화 잊혀 달란트와 장차 오고 있는 에너지의 
                      원천을 성경과 담음으로 터트려야 한다는 절박함으로 발걸음을 내딛게 되었습니다.
                    </p>
                    <p>
                      우리 시대에 순수하고 뜨거운 영적 지도자들과 각 분야에서 공인하는 전문 지성인들을 
                      교수진으로 구성한 킹덤바이블칼리지, 이곳에서 영적인 자유를 만끽하며 주님 오심 때에 
                      부끄러움 없이 이 시대에 그 날을 기대합니다. 킹덤바이블칼리지가 다음세대를 살린 영적 사관 
                      학교에 함께 할 것을 권면하며 기쁨과 행복을 듬뿍 안고 추천합니다.
                    </p>
                  </div>
                  <p className={styles.signature}>킹덤바이블칼리지 이사장 이영한 목사</p>
                </div>
              </div>

              {/* 자문위원 대표 추천사 */}
              <div className={styles.recommendCard}>
                <h3 className={styles.recommendSubtitle}>자문위원 대표 추천사</h3>
                <div className={styles.recommendContent}>
                  <div className={styles.profileSection}>
                    <div className={styles.profileIcon}>👤</div>
                    <div className={styles.profileInfo}>
                      <strong>김상복 목사</strong>
                      <span>세계복음주의연맹(WEA) 명예회장 / 할렐루야교회 명예총장</span>
                    </div>
                  </div>
                  <div className={styles.recommendText}>
                    <p>
                      킹덤바이블칼리지가 신학은 어려운 학문이라는 인식을 전환해 예수님처럼 쉽고 단순하게 
                      하나님의 사람들을 가르치고 훈련시키는 데에 복음을 돕는다는 것에 희망을 갖습니다. 진리는 
                      어렵지 않습니다. 어려우면 타협한 소수의 사람만이 깨달을 것입니다.
                    </p>
                    <p>
                      그러나 누구나 알아들고 이해하고 누릴 수 있는 보편성이 있어야 참된 진리입니다. 
                      그래서 예수님은 "내가 곧 진리"(요14:6)라고 하셨고 또 "하나님의 말씀"(요17:17)이 
                      진리라고 하셨습니다. 누구나 예수 그리스도를 만나면 영원으로 가는 길과 우주의 모든 
                      신비를 하나씩 이해하기 시작합니다.
                    </p>
                    <p>
                      그 분을 알면 알수록 명령에 앞선 그 사이에 모든 것이 하나씩 풀립니다. 
                      우주의 통치자이신 하나님의 마음과 지혜에 합류하는 성경을 읽고 배우고 묵상함으로써 
                      하늘과 땅의 비밀을 매일 감탄하며 행복한 인생을 살 수 있습니다. 
                      킹덤바이블칼리지가 이 놀라운 진리들을 모두에게 가르치고 순종하도록 도와, 
                      진정한 그리스도의 제자들을 일으키는 학교가 되기 바랍니다.
                    </p>
                  </div>
                  <p className={styles.signature}>자문위원 대표 김상복 목사</p>
                </div>
              </div>
            </div>
          )}

          {/* 학장 인사 */}
          {activeMenu === 'greeting' && (
            <div className={styles.contentSection}>
              <h2 className={styles.contentTitle}>학장 인사</h2>
              <div className={styles.contentBody}>
                <p>콘텐츠가 준비 중입니다.</p>
              </div>
            </div>
          )}

          {/* KBC 소개 */}
          {activeMenu === 'introduction' && (
            <div className={styles.contentSection}>
              <h2 className={styles.contentTitle}>KBC 소개</h2>
              <div className={styles.contentBody}>
                <p>콘텐츠가 준비 중입니다.</p>
              </div>
            </div>
          )}

          {/* 2026학년도 모집요강 */}
          {activeMenu === 'admission' && (
            <div className={styles.contentSection}>
              <h2 className={styles.contentTitle}>2026학년도 모집요강</h2>
              <div className={styles.contentBody}>
                <p>콘텐츠가 준비 중입니다.</p>
              </div>
            </div>
          )}

          {/* 협력기관(MOU) 현황 */}
          {activeMenu === 'partners' && (
            <div className={styles.contentSection}>
              <h2 className={styles.contentTitle}>협력기관(MOU) 현황</h2>
              <div className={styles.contentBody}>
                <p>콘텐츠가 준비 중입니다.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
