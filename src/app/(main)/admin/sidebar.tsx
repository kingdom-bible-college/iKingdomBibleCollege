"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./adminLayout.module.css";

const navItems = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/users", label: "회원 승인" },
  { href: "/admin/courses", label: "강의 관리", disabled: true },
  { href: "/admin/announcements", label: "공지 관리", disabled: true },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <p className={styles.brandEyebrow}>KBC</p>
        <h2 className={styles.brandTitle}>Admin Panel</h2>
      </div>

      <nav className={styles.nav}>
        <p className={styles.navLabel}>메뉴</p>
        {navItems.map((item) => {
          const active = item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
          const className = [
            styles.navItem,
            active ? styles.navItemActive : "",
            item.disabled ? styles.navItemDisabled : "",
          ]
            .filter(Boolean)
            .join(" ");

          return item.disabled ? (
            <span key={item.href} className={className}>
              {item.label}
              <span className={styles.badge}>준비중</span>
            </span>
          ) : (
            <Link key={item.href} href={item.href} className={className}>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className={styles.sidebarFooter}>
        <Link href="/courses" className={styles.footerLink}>
          강의 페이지로
        </Link>
        <button className={styles.logoutButton} type="button" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </aside>
  );
}
