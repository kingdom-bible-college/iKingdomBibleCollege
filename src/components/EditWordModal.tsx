'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './EditWordModal.module.css';

const CATEGORIES = [
  { value: '일상대화', label: '📗 일상대화' },
  { value: '비즈니스', label: '📘 비즈니스' },
  { value: '여행', label: '📙 여행' },
  { value: '시험', label: '📕 시험' },
  { value: 'IT/개발', label: '📓 IT/개발' },
  { value: '기타', label: '📒 기타' },
];

type Word = {
  id: number;
  term: string;
  definition: string;
  example: string | null;
  category: string | null;
};

type Props = {
  word: Word;
  onClose: () => void;
};

export function EditWordModal({ word, onClose }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    term: word.term,
    definition: word.definition,
    example: word.example || '',
    category: word.category || '기타',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/words', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: word.id, ...form }),
      });

      if (response.ok) {
        router.refresh();
        onClose();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>✏️ 단어 수정</h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            단어
            <input
              type="text"
              value={form.term}
              onChange={(e) => setForm({ ...form, term: e.target.value })}
              className={styles.input}
              required
            />
          </label>

          <label className={styles.label}>
            뜻
            <input
              type="text"
              value={form.definition}
              onChange={(e) => setForm({ ...form, definition: e.target.value })}
              className={styles.input}
              required
            />
          </label>

          <label className={styles.label}>
            예문
            <input
              type="text"
              value={form.example}
              onChange={(e) => setForm({ ...form, example: e.target.value })}
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            카테고리
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={styles.select}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </label>

          <div className={styles.buttons}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              취소
            </button>
            <button type="submit" disabled={isLoading} className={styles.submitBtn}>
              {isLoading ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}