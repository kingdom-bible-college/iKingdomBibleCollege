import Link from 'next/link';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          ✝️ Kingdom Bible College
        </Link>
        
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            홈
          </Link>
          <Link href="/courses" className={styles.navLink}>
            강의
          </Link>
          <Link href="/about" className={styles.navLink}>
            소개
          </Link>
        </nav>
      </div>
    </header>
  );
}