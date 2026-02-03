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
              <div className={styles.contentBody}>
                <p>콘텐츠가 준비 중입니다.</p>
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
