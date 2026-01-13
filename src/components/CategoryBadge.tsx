'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CategoryBadge.module.css';

const CATEGORIES = [
  { value: '일상대화', label: '📗 일상대화' },
  { value: '비즈니스', label: '📘 비즈니스' },
  { value: '여행', label: '📙 여행' },
  { value: '시험', label: '📕 시험' },
  { value: 'IT/개발', label: '📓 IT/개발' },
  { value: '기타', label: '📒 기타' },
];

type Props = {
  wordId: number;
  category: string;
};

export function CategoryBadge({ wordId, category }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = async (newCategory: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/words', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: wordId, category: newCategory }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <select
        value={category}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => setIsEditing(false)}
        autoFocus
        className={styles.select}
        disabled={isLoading}
      >
        {CATEGORIES.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <button onClick={() => setIsEditing(true)} className={styles.badge}>
      {category || '기타'}
    </button>
  );
}