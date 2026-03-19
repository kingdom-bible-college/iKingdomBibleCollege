import Link from 'next/link';
import styles from './Header.module.css';
import { getSessionUser } from '@/lib/auth/session';

export async function Header() {
  const user = await getSessionUser();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          KINGDOM BIBLE COLLEGE
        </Link>
        
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink} prefetch={false}>
            홈
          </Link>
          <Link href="/about" className={styles.navLink} prefetch={false}>
            KBC 소개
          </Link>
          <Link href="/courses" className={styles.navLink}>
            강의
          </Link>
          <Link href="/faq" className={styles.navLink} prefetch={false}>
            FAQ
          </Link>
          {user ? (
            <form action="/api/auth/logout" method="post">
              <button
                className={`${styles.navLink} ${styles.navButton}`}
                type="submit"
              >
                로그아웃
              </button>
            </form>
          ) : (
            <Link href="/login" className={styles.navLink} prefetch={false}>
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
