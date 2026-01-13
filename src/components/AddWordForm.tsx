'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AddWordForm.module.css';

const CATEGORIES = [
  { value: '일상대화', label: '📗 일상대화' },
  { value: '비즈니스', label: '📘 비즈니스' },
  { value: '여행', label: '📙 여행' },
  { value: '시험', label: '📕 시험' },
  { value: 'IT/개발', label: '📓 IT/개발' },
  { value: '기타', label: '📒 기타' },
];

export function AddWordForm() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ 
    term: '', 
    definition: '', 
    example: '',
    category: '기타',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.term || !form.definition) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setForm({ term: '', definition: '', example: '', category: '기타' });
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className={styles.openBtn}>
        + 새 단어 추가
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.fields}>
        <div className={styles.row}>
          <input
            type="text"
            placeholder="단어 (영어)"
            value={form.term}
            onChange={(e) => setForm({ ...form, term: e.target.value })}
            className={styles.input}
            required
          />
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
        </div>
        <input
          type="text"
          placeholder="뜻 (한글)"
          value={form.definition}
          onChange={(e) => setForm({ ...form, definition: e.target.value })}
          className={styles.input}
          required
        />
        <input
          type="text"
          placeholder="예문 (선택)"
          value={form.example}
          onChange={(e) => setForm({ ...form, example: e.target.value })}
          className={styles.input}
        />
      </div>
      <div className={styles.buttons}>
        <button 
          type="button" 
          onClick={() => setIsOpen(false)} 
          className={styles.cancelBtn}
        >
          취소
        </button>
        <button 
          type="submit" 
          disabled={isLoading} 
          className={styles.submitBtn}
        >
          {isLoading ? '추가 중...' : '추가하기'}
        </button>
      </div>
    </form>
  );
}