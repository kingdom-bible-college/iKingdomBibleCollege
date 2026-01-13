import Link from 'next/link';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          📚 Daily Vocab
        </Link>
        
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            홈
          </Link>
          <Link href="/practice" className={styles.navLink}>
            연습
          </Link>
          <Link href="/quiz" className={styles.navLink}>
            퀴즈
          </Link>
        </nav>
      </div>
    </header>
  );
}