import Link from 'next/link';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          KINGDOM BIBLE COLLEGE
        </Link>
        
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            홈
          </Link>
          <Link href="/about" className={styles.navLink}>
            KBC 소개
          </Link>
          <Link href="/courses" className={styles.navLink}>
            강의
          </Link>
          <Link href="/contact" className={styles.navLink}>
            문의
          </Link>
        </nav>
      </div>
    </header>
  );
}