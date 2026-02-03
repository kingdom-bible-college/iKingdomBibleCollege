'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const menuParam = searchParams.get('menu');
  
  const [activeMenu, setActiveMenu] = useState<MenuType>('recommendation');

  useEffect(() => {
    if (menuParam && menuItems.some(item => item.id === menuParam)) {
      setActiveMenu(menuParam as MenuType);
    }
  }, [menuParam]);

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
              
              {/* 1. 학사 일정 및 등록 안내 */}
              <div className={styles.admissionGroup}>
                <h3 className={styles.admissionSubTitle}>1. 학사 일정 및 등록 안내</h3>
                
                <div className={styles.infoBox}>
                  <h4 className={styles.boxTitle}>학사 일정</h4>
                  <ul className={styles.infoList}>
                    <li><strong>등록 마감</strong><span>3월 6일(금)</span></li>
                    <li><strong>개강 예배</strong><span>3월 17일(화) (OT 포함)</span></li>
                    <li><strong>종강 예배</strong><span>6월 18일(목)</span></li>
                  </ul>
                  <p className={styles.infoNote}>
                    * 하반기 실습 훈련: 비정기적 현장 실습 훈련이 7월–10월 중 진행될 예정입니다.
                  </p>
                </div>

                <div className={styles.twoColGrid}>
                  <div className={styles.infoBox}>
                    <h4 className={styles.boxTitle}>등록금 안내</h4>
                    <ul className={styles.infoList}>
                      <li><strong>일반 등록</strong><span>48만 원 (VAT 포함)</span></li>
                      <li><strong>사전 등록</strong><span>40만 원 (VAT 포함)</span></li>
                    </ul>
                    <p style={{fontSize: '0.85rem', color: '#888', marginTop: '8px'}}>
                      (리빙캠퍼스 기간 내 등록 / 오메가교회 성도)
                    </p>
                  </div>
                  <div className={styles.infoBox}>
                    <h4 className={styles.boxTitle}>등록 계좌</h4>
                    <ul className={styles.infoList}>
                      <li><strong>국민은행</strong><span>461301-04-610726</span></li>
                      <li><strong>예금주</strong><span>비전스테이션미니스트리</span></li>
                    </ul>
                  </div>
                </div>

                <div className={styles.infoBox}>
                  <h4 className={styles.boxTitle}>등록 문의 및 연락처</h4>
                  <div className={styles.twoColGrid} style={{marginBottom: 0}}>
                    <ul className={styles.infoList}>
                      <li><strong>이메일</strong><span>ikingdombiblecollege@gmail.com</span></li>
                      <li><strong>홈페이지</strong><span>www.ikingdombiblecollege.com</span></li>
                      <li><strong>주소</strong><span>대전 서구 도안중로 304-10 (도안동 1483)</span></li>
                    </ul>
                    <ul className={styles.infoList}>
                      <li><strong>KBC 본교</strong><span>042-824-3242</span></li>
                      <li><strong>사무처장</strong><span>도현우 (010-3542-3703)</span></li>
                      <li><strong>간사</strong><span>전미라 (010-8966-0558)</span></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2. 강좌 및 강사 소개 */}
              <div className={styles.admissionGroup}>
                <h3 className={styles.admissionSubTitle}>2. 강좌 및 강사 소개</h3>
                
                <div className={styles.twoColGrid}>
                  <div className={styles.instructorCard}>
                    <div className={styles.profileIcon} style={{width: '60px', height: '60px', fontSize: '2rem'}}>👤</div>
                    <div className={styles.instructorInfo}>
                      <h5>황성은 목사</h5>
                      <ul>
                        <li>오메가교회 담임</li>
                        <li>킹덤바이블칼리지 학장</li>
                      </ul>
                    </div>
                  </div>
                  <div className={styles.instructorCard}>
                    <div className={styles.profileIcon} style={{width: '60px', height: '60px', fontSize: '2rem'}}>👤</div>
                    <div className={styles.instructorInfo}>
                      <h5>김태현 목사</h5>
                      <ul>
                        <li>오메가교회 선교목사</li>
                        <li>킹덤바이블칼리지 부학장</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className={styles.infoBox}>
                  <h4 className={styles.boxTitle}>전체 강좌 구성</h4>
                  <table className={styles.curriculumTable}>
                    <tbody>
                      <tr>
                        <th>현장 강의</th>
                        <td>
                          <strong>황성은 목사</strong> (복음 전도와 제자도 / 사도행전적 교회 개척 운동)<br />
                          <strong>김태현 목사</strong> (이스라엘 선교 / 선교개론)
                        </td>
                      </tr>
                      <tr>
                        <th>온라인 강의</th>
                        <td>
                          <strong>파송 선교사</strong> (특강)<br />
                          <strong>이재환 선교사</strong> (요나선교학교)<br />
                          <strong>조수아 선교사</strong> (이슬람 선교)<br />
                          <strong>윤성철 목사</strong> (예배와 선교)<br />
                          <strong>함철홍 교수</strong> (요한계시록)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p className={styles.infoNote}>
                    * 수강생 특전: 필수 온라인 강의 외에도 다양한 강의를 자유롭게 선택 수강 가능
                  </p>
                </div>
              </div>

              {/* 3. 교육 과정 */}
              <div className={styles.admissionGroup}>
                <h3 className={styles.admissionSubTitle}>3. 교육 과정</h3>
                
                <div className={styles.twoColGrid}>
                  <div className={styles.infoBox}>
                    <h4 className={styles.boxTitle}>상반기 (3–6월)</h4>
                    <p style={{color:'#666', marginBottom:'12px'}}>화–목 / 09:00–13:00</p>
                    <ul className={styles.infoList}>
                      <li>1. 통전적 성경연구</li>
                      <li>2. 선교 중심 현장 강의</li>
                      <li>3. 토의 및 발제</li>
                      <li>4. 해외 단기 아웃리치 (필리핀, 인도 등)</li>
                    </ul>
                  </div>
                  <div className={styles.infoBox}>
                    <h4 className={styles.boxTitle}>하반기 (7–10월)</h4>
                    <p style={{color:'#666', marginBottom:'12px'}}>비정기적 현장 실습</p>
                    <ul className={styles.infoList}>
                      <li>1. KBC 인텐시브 코스 (9월)</li>
                      <li>2. 기도 집중 훈련</li>
                      <li>3. 토의 및 발제</li>
                    </ul>
                  </div>
                </div>

                <div className={styles.requirementBox}>
                  <h4 className={styles.boxTitle}>수료 및 졸업 요건</h4>
                  <div className={styles.twoColGrid} style={{marginBottom: 0}}>
                    <div>
                      <h5 style={{fontSize: '1rem', fontWeight: 600, marginBottom: '8px'}}>수료 기준</h5>
                      <ul className={styles.infoList} style={{fontSize: '0.95rem'}}>
                        <li>• 교육 과정 80% 이상 출석</li>
                        <li>• 킹덤컨퍼런스 1회 이상 참여</li>
                        <li>• (재수강생) 신규과정 이수 및 할인 적용</li>
                      </ul>
                    </div>
                    <div>
                      <h5 style={{fontSize: '1rem', fontWeight: 600, marginBottom: '8px'}}>졸업 요건</h5>
                      <ul className={styles.infoList} style={{fontSize: '0.95rem'}}>
                        <li>• 킹덤바이블칼리지 수료 (필수)</li>
                        <li>• 선택 요건 택 1 (해외 SM / 국내 캠퍼스 선교)</li>
                      </ul>
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
                {/* Intro Section */}
                <div className={styles.partnersIntroBox}>
                  <p className={styles.partnersIntroText}>
                    <strong>킹덤바이블칼리지</strong>는 갈보리채플바이블칼리지, 미성대학교, 창조과학회, 드림스드림, 열방대학(YWAM) 등과<br />
                    사도행전적 선교사, 사역자, 목회자 인재 양성을 위한 <strong>협약(MOU)</strong>을 체결했습니다.
                  </p>
                  <p className={styles.partnersIntroText} style={{marginBottom: 0}}>
                    MOU 협약식을 통해 갈보리채플바이블칼리지 Joel Wingo 학장과 미성대학교 이상훈 총장,<br />
                    창조과학회 이경호 회장을 비롯한 각 기관과 함께<br />
                    킹덤바이블칼리지의 사도행전적 사역자 양성 과정에 적극 협력하기로 결의했습니다.
                  </p>
                </div>

                <div className={styles.partnersDetailList}>
                  {/* 1. 미성대학교 */}
                  <div className={styles.partnerDetailCard}>
                    <div className={styles.partnerHeader}>
                      <div className={styles.partnerIconLarge}>🎓</div>
                      <div className={styles.partnerTitleBox}>
                        <h3>미성대학교</h3>
                        <span>America Evangelical University (AEU)</span>
                      </div>
                    </div>
                    <div className={styles.partnerBody}>
                      <p>
                        미성대학교는 미국의 대표적인 신학교로, 인가 기관인 ABHE와 ATS에 준회원으로 가입한 교육기관입니다.
                        오늘날 더욱 요구되는 크리스천 리더십과 목회·선교·사역자를 중심으로 한 신학교육을 제공하며,
                        신학뿐 아니라 인격·인성·사역적 균형을 고려한 통합적 교육을 추구합니다.
                      </p>
                      <p>
                        이를 통해 성경적 진리와 창조적 학문을 토대로 미래의 크리스천 평신도 지도자, 선교사, 목회자를 양성합니다.
                      </p>
                      <div className={styles.mouBenefitBox}>
                        <span className={styles.mouTitle}>미성대학교 MOU 내용</span>
                        <ul className={styles.mouList}>
                          <li>학점 추천서를 통한 입학 우선권</li>
                          <li>목회학석사(M.Div.) 과정 지원 시 졸업요건 72학점 중 최대 12학점 인정</li>
                          <li>MA in Ministry Leadership 과정 지원 시 40학점 중 9학점 인정</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* 2. 한국창조과학회 */}
                  <div className={styles.partnerDetailCard}>
                    <div className={styles.partnerHeader}>
                      <div className={styles.partnerIconLarge}>🔬</div>
                      <div className={styles.partnerTitleBox}>
                        <h3>한국창조과학회</h3>
                        <span>Korea Association for Creation Research (KACR)</span>
                      </div>
                    </div>
                    <div className={styles.partnerBody}>
                      <p>
                        한국창조과학회는 인간·생물계·우주 등 모든 피조세계의 질서와 조화가 우연이 아닌 지적 설계에 의한 창조임을 과학적으로 증거하고,
                        다양한 학문 분야와의 융합을 통해 성경적 창조 세계관을 연구·보급하는 단체입니다.
                      </p>
                      <p>
                        1981년 설립 이후 학술 세미나, 창조과학 학술대회, 교육사역, 창조과학 전문인 선교사 파송, 창조과학 캠퍼스 사역,
                        IT·미디어 사역 등을 통해 활발히 활동하고 있습니다.
                      </p>
                    </div>
                  </div>

                  {/* 3. 드림스드림 */}
                  <div className={styles.partnerDetailCard}>
                    <div className={styles.partnerHeader}>
                      <div className={styles.partnerIconLarge}>🏫</div>
                      <div className={styles.partnerTitleBox}>
                        <h3>드림스드림</h3>
                        <span>DreamsDream</span>
                      </div>
                    </div>
                    <div className={styles.partnerBody}>
                      <p>
                        드림스드림은 학과 없는 재개발국가 및 지역에 학교를 건립·운영하며, 교육을 통해 영성·인성·전문성을 겸비한 글로벌 인재를 양성하는 단체입니다.
                      </p>
                      <p>
                        전액 장학금 운영과 졸업 후 재능기부 시스템을 통해 모든 학생이 100% 재능기부로 환원하는 구조를 갖추고 있으며,
                        이를 통해 다음 세대를 살리는 일에 지속적으로 헌신하고 있습니다.
                      </p>
                    </div>
                  </div>

                  {/* 4. 열방대학 YWAM */}
                  <div className={styles.partnerDetailCard}>
                    <div className={styles.partnerHeader}>
                      <div className={styles.partnerIconLarge}>🌏</div>
                      <div className={styles.partnerTitleBox}>
                        <h3>열방대학 YWAM</h3>
                        <span>University of the Nations</span>
                      </div>
                    </div>
                    <div className={styles.partnerBody}>
                      <p>
                        YWAM은 선교적 비전을 받은 로렌 커닝햄 목사에 의해 1960년대에 설립된 초교파 선교단체입니다.
                        YWAM은 예수 그리스도를 세상에 알리는 것을 목표로, 선교·교육·자비량 사역을 통해 젊은 세대가 선교적 삶을 살도록 훈련합니다.
                      </p>
                      <p>
                        열방대학(University of the Nations)은 1978년 설립되어 현재 전 세계 142개국에 600여 개 캠퍼스를 운영하고 있으며,
                        매년 약 15,000명의 학생들이 선교 훈련 및 교육 과정을 이수하고 있습니다.
                      </p>
                      <p>
                        YWAM Korea 및 U of N Korea는 전 세계 YWAM 네트워크와의 연계를 통해 킹덤바이블칼리지와 협력하며
                        사도행전적 사역자 양성에 함께하고 있습니다.
                      </p>
                    </div>
                  </div>

                  {/* 5. 갈보리 채플 바이블 칼리지 */}
                  <div className={styles.partnerDetailCard}>
                    <div className={styles.partnerHeader}>
                      <div className={styles.partnerIconLarge}>⛪</div>
                      <div className={styles.partnerTitleBox}>
                        <h3>갈보리 채플 바이블 칼리지</h3>
                        <span>Calvary Chapel Bible College</span>
                      </div>
                    </div>
                    <div className={styles.partnerBody}>
                      <p>
                        갈보리 채플 사역은 미국의 정치·경제적 혼란 속이던 1960년대, 척 스미스(Chuck Smith) 목사의 사역을 통해 시작되었습니다.
                      </p>
                      <p>
                        젊은이들을 향한 복음 전파와 말씀 중심의 제자훈련을 통해 미국 전역과 전 세계로 확산되었으며,
                        현재는 1,000개 이상의 교회가 개척되고 미국 최대 규모 중 하나인 25개 교회, 평균 출석 성도 3,000명 이상 규모의 교회들이 세워졌습니다.
                      </p>
                      <div className={styles.mouBenefitBox}>
                        <span className={styles.mouTitle}>갈보리채플바이블칼리지 MOU 내용</span>
                        <ul className={styles.mouList}>
                          <li>학점 추천서를 통한 입학 우선권</li>
                          <li>입학 시 등록금 50% 특별 장학 제도</li>
                        </ul>
                      </div>
                    </div>
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
