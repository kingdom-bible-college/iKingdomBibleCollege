"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "../auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (typeof data.error === "string") {
          setError(data.error);
        } else if (data.error && typeof data.error === "object") {
          const messages = Object.values(data.error)
            .flat()
            .filter(Boolean);
          setError(messages[0] || "로그인에 실패했습니다.");
        } else {
          setError("로그인에 실패했습니다.");
        }
        setLoading(false);
        return;
      }

      router.push("/courses");
    } catch {
      setError("로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>
            승인된 계정만 강의에 접근할 수 있습니다.
          </p>
        </div>

        {status === "pending" && (
          <div className={styles.message}>
            가입 승인 대기 중입니다. 운영진 승인 후 다시 로그인해 주세요.
          </div>
        )}
        {error && <div className={`${styles.message} ${styles.error}`}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
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
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className={styles.helperRow}>
          <span>계정이 없나요?</span>
          <Link className={styles.link} href="/signup">
            회원가입
          </Link>
        </div>
      </div>
    </main>
  );
}
