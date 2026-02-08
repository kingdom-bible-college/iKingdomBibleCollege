import { type ReactNode } from "react";
import AdminSidebar from "./sidebar";
import styles from "./adminLayout.module.css";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <div className={styles.content}>
        <div className={styles.contentInner}>{children}</div>
      </div>
    </div>
  );
}
