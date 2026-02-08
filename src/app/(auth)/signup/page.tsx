"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../auth.module.css";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (typeof data.error === "string") {
          setError(data.error);
        } else if (data.error && typeof data.error === "object") {
          const messages = Object.values(data.error)
            .flat()
            .filter(Boolean);
          setError(messages[0] || "회원가입에 실패했습니다.");
        } else {
          setError("회원가입에 실패했습니다.");
        }
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login?status=pending"), 800);
    } catch {
      setError("회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>회원가입</h1>
          <p className={styles.subtitle}>
            가입 후 운영진 승인 완료 시 강의를 시청할 수 있습니다.
          </p>
        </div>

        {success && (
          <div className={styles.message}>
            가입이 완료되었습니다. 승인 후 로그인해 주세요.
          </div>
        )}
        {error && <div className={`${styles.message} ${styles.error}`}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <label className={styles.label} htmlFor="name">
              이름
            </label>
            <input
              id="name"
              type="text"
              className={styles.input}
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div>
            <label className={styles.label} htmlFor="email">
              이메일
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label className={styles.label} htmlFor="password">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <div className={styles.helperRow}>
          <span>이미 계정이 있나요?</span>
          <Link className={styles.link} href="/login">
            로그인
          </Link>
        </div>
      </div>
    </main>
  );
}
