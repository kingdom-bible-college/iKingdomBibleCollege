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
              
              <div className={styles.greetingContainer}>
                {/* Top Section: Quote & Image */}
                <div className={styles.greetingTop}>
                  <div className={styles.greetingQuoteBox}>
                    <p className={styles.greetingQuote}>
                      킹덤바이블칼리지의 학생들은<br />
                      이 땅을 흔드시고 새 일을 행하시는<br />
                      하나님의 손에 붙들려 강하게 쓰임 받는<br />
                      사도행전적 사역자로 세워지게 됩니다.
                    </p>
                  </div>
                  <div className={styles.greetingImageWrapper}>
                    <div className={styles.greetingImagePlaceholder}>
                      <span>👤</span>
                    </div>
                  </div>
                </div>

                {/* Body Text */}
                <div className={styles.greetingBody}>
                  <p>
                    킹덤바이블칼리지는 사도행전적 사역자를 양성하는 선교훈련학교입니다.
                    그리고 각자의 영역에서 많은 열매를 맺고 사역자들을 배출한 교수진의 영성과
                    기름부으심을 통하여 우리를 풍성하고 균형 잡힌 하나님의 사람으로 세워갈 것입니다.
                  </p>
                  <p>
                    KBC의 훈련은 단순한 지식 전달이나 학문적 학습에 머무르지 않고,
                    말씀과 삶, 훈련과 사역이 하나로 연결되는 통전적 교육을 지향합니다.
                  </p>
                  <p>
                    이 과정은 국내와 국외 단기선교로 이어져,
                    훈련생들이 선교의 현장 속에서 복음을 삶으로 살아내며
                    자신의 부르심과 정체성을 더욱 분명히 세워가도록 돕습니다.
                  </p>
                  <p>
                    킹덤바이블칼리지는 끊임없이 선교의 영을 불어넣으며,
                    하나님 나라의 완성을 위한 사도행전적 사역자를 세우는 것을 꿈꿀 것입니다.
                    이 거룩한 부르심의 여정에 사도행전적 삶을 꿈꾸는 모든 분들을 초청합니다!
                  </p>
                  
                  <div className={styles.greetingSignature}>
                    <span className={styles.deanName}>킹덤바이블칼리지 학장 황성은 목사</span>
                    <span className={styles.deanRole}>오메가교회 담임<br />비전스테이션 미니스트리 대표</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* KBC 소개 */}
          {activeMenu === 'introduction' && (
            <div className={styles.contentSection}>
              <h2 className={styles.contentTitle}>KBC 소개</h2>
              
              {/* 1. Main Vision / Slogan */}
              <div className={styles.introHeader}>
                <h3 className={styles.sloganMain}>마지막 시대, 사도행전적 교회의 플랫폼</h3>
                <h4 className={styles.sloganSub}>End-time Platform for the Apostolic Church</h4>
                <div className={styles.sloganDivider}></div>
                <p className={styles.sloganDesc}>
                  영적 지도자와 평신도 사역자를 더욱 견고히 세워<br />
                  교회와 선교지의 영적 각성과 주의 길을 예비하는<br />
                  <strong>부흥의 도화선(Trigger)</strong>
                </p>
                <p className={styles.sloganDesc}>
                  지성·영성·야성을 겸비한 영적 지도자를<br />
                  전문적으로 양성하는 <strong>진리의 터전</strong>
                </p>
              </div>

              {/* 2. Mission & Vision */}
              <div className={styles.mvContainer}>
                <div className={styles.mvBox}>
                  <h3 className={styles.mvTitle}>MISSION</h3>
                  <p className={styles.mvText}>
                    성경 중심의 훈련과정을 통해<br />
                    “가서 모든 민족을 제자로 삼으라”(마 28:19)는<br />
                    예수님의 부르심에 순종하며<br />
                    현실적 삶 속에서 선교적 삶을 살도록 한다.
                  </p>
                </div>
                <div className={styles.mvBox}>
                  <h3 className={styles.mvTitle}>VISION</h3>
                  <ul className={styles.mvList}>
                    <li>1. 새로운 시대, 영적 각성을 선도하는 영적 지도자 배출</li>
                    <li>2. 다음 세대와 청년의 회복</li>
                    <li>3. 전 세계 캠퍼스 확립과 1,000개 교회 개척</li>
                  </ul>
                </div>
              </div>

              {/* 3. 인재상 & 교육 목표 */}
              <div className={styles.goalsContainer}>
                <div className={styles.goalCard}>
                  <h3 className={styles.goalTitle}>인재상</h3>
                  <p className={styles.goalText}>
                    지성, 영성, 야성을 겸비한<br />
                    <strong>하나님 나라의 사역자</strong>
                  </p>
                </div>
                <div className={styles.goalCard}>
                  <h3 className={styles.goalTitle}>교육 목표</h3>
                  <ul className={styles.goalList}>
                    <li>1. 사도행전적 <strong>목회자</strong> 양성</li>
                    <li>2. 사도행전적 <strong>선교사</strong> 양성</li>
                    <li>3. 사도행전적 <strong>평신도</strong> 양성</li>
                  </ul>
                </div>
              </div>

              {/* 4 & 5. Kingdom Definition & Core Values */}
              <div className={styles.valuesSection}>
                <h3 className={styles.commonTitle}>KINGDOM 핵심 가치</h3>
                <p className={styles.valuesIntro}>
                  Kingdom Bible College는 <strong>사도행전적 공동체</strong>를 추구합니다.<br />
                  왕(KING)의 부르심을 받은 자들이 하나님과의 친밀함(INTIMACY)을 누리며...
                </p>
                <div className={styles.valuesGrid}>
                  <div className={styles.valueItem}>
                    <span className={styles.valueKey}>K</span>
                    <span className={styles.valueWord}>KING</span>
                    <span className={styles.valueMeaning}>하나님의 통치</span>
                  </div>
                  <div className={styles.valueItem}>
                    <span className={styles.valueKey}>I</span>
                    <span className={styles.valueWord}>INTIMACY</span>
                    <span className={styles.valueMeaning}>하나님과의 친밀함</span>
                  </div>
                  <div className={styles.valueItem}>
                    <span className={styles.valueKey}>N</span>
                    <span className={styles.valueWord}>NETWORK</span>
                    <span className={styles.valueMeaning}>거룩한 연결</span>
                  </div>
                  <div className={styles.valueItem}>
                    <span className={styles.valueKey}>G</span>
                    <span className={styles.valueWord}>GATHERING</span>
                    <span className={styles.valueMeaning}>공동체적 모임</span>
                  </div>
                  <div className={styles.valueItem}>
                    <span className={styles.valueKey}>D</span>
                    <span className={styles.valueWord}>DELIGHT</span>
                    <span className={styles.valueMeaning}>기쁨</span>
                  </div>
                  <div className={styles.valueItem}>
                    <span className={styles.valueKey}>O</span>
                    <span className={styles.valueWord}>OBEDIENCE</span>
                    <span className={styles.valueMeaning}>순종</span>
                  </div>
                  <div className={styles.valueItem}>
                    <span className={styles.valueKey}>M</span>
                    <span className={styles.valueWord}>MISSION</span>
                    <span className={styles.valueMeaning}>선교적 삶</span>
                  </div>
                </div>
              </div>

              {/* 6. Target Audience */}
              <div className={styles.targetSection}>
                <h3 className={styles.commonTitle}>이런 분들을 위한 학교입니다</h3>
                <p className={styles.targetSub}>킹덤바이블칼리지는 누구를 위한 학교인가요?</p>
                <ul className={styles.targetList}>
                  <li>
                    <span className={styles.checkIcon}>✔</span>
                    <span className={styles.targetText}>학위나 목회가 목적은 아니지만<br />평신도로서 수준 높은 신학을 배우고 싶은 분</span>
                  </li>
                  <li>
                    <span className={styles.checkIcon}>✔</span>
                    <span className={styles.targetText}>자신의 진정한 부르심을 발견하고 싶은 분</span>
                  </li>
                  <li>
                    <span className={styles.checkIcon}>✔</span>
                    <span className={styles.targetText}>현재 삶의 자리에서<br />선교적 삶을 살아가고 싶은 분</span>
                  </li>
                  <li>
                    <span className={styles.checkIcon}>✔</span>
                    <span className={styles.targetText}>장차 선교사로 쓰임 받고 싶은<br />미래의 예비 선교사</span>
                  </li>
                </ul>
              </div>

              {/* 7. Organization Info */}
              <div className={styles.orgInfo}>
                <p>
                  <strong>킹덤바이블칼리지</strong>는<br />
                  비전스테이션 미니스트리에 소속된 평신도·예비선교사·사역자를 양성하는 선교훈련학교입니다.
                </p>
                <p>
                  이를 위해 각 분야에서 인정받는 교수진과 함께하며,<br />
                  비전스테이션 미니스트리와 KWMA(한국세계선교협의회)에 소속된 공식 회원 선교단체입니다.
                </p>
              </div>
            </div>
          )}

          {/* 2026학년도 모집요강 */}
          {activeMenu === 'admission' && (
            <div className={styles.contentSection}>
              <h2 className={styles.contentTitle}>2026학년도 모집요강</h2>
              
              <div className={styles.admissionContainer}>
                <div className={styles.admissionInfo}>
                  <div className={styles.admissionGrid}>
                    <div className={styles.infoColumn}>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>모집 학기</span>
                        <div className={styles.infoValue}>
                          <span className={styles.infoIcon}>📅</span>
                          2026학년도 봄학기 (18주 과정)
                        </div>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>지원 자격</span>
                        <div className={styles.infoValue}>
                          <span className={styles.infoIcon}>✅</span>
                          세례교인 이상, 사역에 헌신된 자
                        </div>
                      </div>
                    </div>
                    <div className={styles.infoColumn}>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>등록 기간</span>
                        <div className={styles.infoValue}>
                          <span className={styles.infoIcon}>⏰</span>
                          2025. 12. 01 ~ 2026. 02. 20
                        </div>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>등록금</span>
                        <div className={styles.infoValue}>
                          <span className={styles.infoIcon}>💰</span>
                          학기당 300,000원 (장학 혜택 별도)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.admissionSteps}>
                  <h3 className={styles.introTitle} style={{fontSize: '1.2rem', marginBottom: '20px'}}>전형 절차</h3>
                  <div className={styles.stepList}>
                    <div className={styles.stepItem}>
                      <div className={styles.stepCircle}>1</div>
                      <h4 className={styles.stepTitle}>원서 접수</h4>
                      <p className={styles.stepDesc}>온라인 지원서 작성</p>
                    </div>
                    <div className={styles.stepItem}>
                      <div className={styles.stepCircle}>2</div>
                      <h4 className={styles.stepTitle}>서류 심사</h4>
                      <p className={styles.stepDesc}>지원 자격 확인</p>
                    </div>
                    <div className={styles.stepItem}>
                      <div className={styles.stepCircle}>3</div>
                      <h4 className={styles.stepTitle}>면접</h4>
                      <p className={styles.stepDesc}>온라인/오프라인 면접</p>
                    </div>
                    <div className={styles.stepItem}>
                      <div className={styles.stepCircle}>4</div>
                      <h4 className={styles.stepTitle}>합격 발표</h4>
                      <p className={styles.stepDesc}>개별 통보</p>
                    </div>
                    <div className={styles.stepItem}>
                      <div className={styles.stepCircle}>5</div>
                      <h4 className={styles.stepTitle}>등록</h4>
                      <p className={styles.stepDesc}>등록금 납부</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 협력기관(MOU) 현황 */}
          {activeMenu === 'partners' && (
            <div className={styles.contentSection}>
              <h2 className={styles.contentTitle}>협력기관(MOU) 현황</h2>
              
              <div className={styles.partnersContainer}>
                <p className={styles.introText} style={{textAlign: 'center', marginBottom: '20px'}}>
                  킹덤바이블칼리지는 국내외 유수의 기관 및 교회와 협력하여<br />
                  하나님 나라 확장을 위한 거룩한 네트워크를 이루고 있습니다.
                </p>

                <div className={styles.partnersGrid}>
                  <div className={styles.partnerCard}>
                    <span className={styles.partnerIcon}>🏛️</span>
                    <span className={styles.partnerName}>비전스테이션</span>
                    <span className={styles.partnerCategory}>선교단체</span>
                  </div>
                  <div className={styles.partnerCard}>
                    <span className={styles.partnerIcon}>⛪</span>
                    <span className={styles.partnerName}>오메가교회</span>
                    <span className={styles.partnerCategory}>협력교회</span>
                  </div>
                  <div className={styles.partnerCard}>
                    <span className={styles.partnerIcon}>🎓</span>
                    <span className={styles.partnerName}>한빛제일교회</span>
                    <span className={styles.partnerCategory}>협력교회</span>
                  </div>
                  <div className={styles.partnerCard}>
                    <span className={styles.partnerIcon}>🌏</span>
                    <span className={styles.partnerName}>KWMA</span>
                    <span className={styles.partnerCategory}>선교연합</span>
                  </div>
                  <div className={styles.partnerCard}>
                    <span className={styles.partnerIcon}>🕊️</span>
                    <span className={styles.partnerName}>CTS 기독교TV</span>
                    <span className={styles.partnerCategory}>방송선교</span>
                  </div>
                  <div className={styles.partnerCard}>
                    <span className={styles.partnerIcon}>📚</span>
                    <span className={styles.partnerName}>두란노서원</span>
                    <span className={styles.partnerCategory}>문서선교</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
