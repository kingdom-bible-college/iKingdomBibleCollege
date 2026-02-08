import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { getAllUsers, updateUser } from "@/db/queries/users";
import styles from "./admin.module.css";

const formatDate = (value: Date | null) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
};

const approveUser = async (formData: FormData) => {
  "use server";
  await requireAdmin();
  const id = Number(formData.get("userId"));
  if (!Number.isFinite(id)) return;
  await updateUser(id, { status: "approved" });
  revalidatePath("/admin/users");
};

const revokeUser = async (formData: FormData) => {
  "use server";
  await requireAdmin();
  const id = Number(formData.get("userId"));
  if (!Number.isFinite(id)) return;
  await updateUser(id, { status: "pending" });
  revalidatePath("/admin/users");
};

const makeAdmin = async (formData: FormData) => {
  "use server";
  await requireAdmin();
  const id = Number(formData.get("userId"));
  if (!Number.isFinite(id)) return;
  await updateUser(id, { role: "admin" });
  revalidatePath("/admin/users");
};

export default async function AdminUsersPage() {
  await requireAdmin();
  const users = await getAllUsers();
  const pendingUsers = users.filter((user) => user.status === "pending");
  const approvedUsers = users.filter((user) => user.status === "approved");

  return (
    <main className={styles.main}>
      <section className={styles.header}>
        <div>
          <p className={styles.eyebrow}>KBC Admin</p>
          <h1 className={styles.title}>회원 승인 관리</h1>
          <p className={styles.subtitle}>
            가입 요청을 승인하면 강의 접근 권한이 활성화됩니다.
          </p>
        </div>
        <div className={styles.summary}>
          <div>
            <span>승인 대기</span>
            <strong>{pendingUsers.length}</strong>
          </div>
          <div>
            <span>승인 완료</span>
            <strong>{approvedUsers.length}</strong>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>승인 대기</h2>
          <p>승인이 필요한 계정 목록입니다.</p>
        </div>
        {pendingUsers.length === 0 ? (
          <div className={styles.empty}>현재 승인 대기 계정이 없습니다.</div>
        ) : (
          <div className={styles.table}>
            <div className={styles.rowHeader}>
              <span>이름</span>
              <span>이메일</span>
              <span>가입일</span>
              <span>액션</span>
            </div>
            {pendingUsers.map((user) => (
              <div key={user.id} className={styles.row}>
                <span>{user.name}</span>
                <span>{user.email}</span>
                <span>{formatDate(user.createdAt)}</span>
                <div className={styles.actions}>
                  <form action={approveUser}>
                    <input type="hidden" name="userId" value={user.id} />
                    <button className={styles.primaryButton} type="submit">
                      승인
                    </button>
                  </form>
                  <form action={makeAdmin}>
                    <input type="hidden" name="userId" value={user.id} />
                    <button className={styles.secondaryButton} type="submit">
                      관리자 지정
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>승인 완료</h2>
          <p>강의 접근이 가능한 계정입니다.</p>
        </div>
        {approvedUsers.length === 0 ? (
          <div className={styles.empty}>승인된 계정이 없습니다.</div>
        ) : (
          <div className={styles.table}>
            <div className={styles.rowHeader}>
              <span>이름</span>
              <span>이메일</span>
              <span>권한</span>
              <span>액션</span>
            </div>
            {approvedUsers.map((user) => (
              <div key={user.id} className={styles.row}>
                <span>{user.name}</span>
                <span>{user.email}</span>
                <span className={styles.roleBadge}>{user.role}</span>
                <div className={styles.actions}>
                  <form action={revokeUser}>
                    <input type="hidden" name="userId" value={user.id} />
                    <button className={styles.ghostButton} type="submit">
                      승인 취소
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
