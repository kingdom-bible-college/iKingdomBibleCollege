'use client';

import { useState } from 'react';
import { PlayButton } from '@/components/PlayButton';
import styles from './page.module.css';

const CATEGORIES = ['전체', '일상대화', '비즈니스', '여행', '시험', 'IT/개발', '기타'];

type Word = {
  id: number;
  term: string;
  definition: string;
  example: string | null;
  category: string | null;
};

type Props = {
  words: Word[];
};

export function PracticeClient({ words }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const filteredWords = selectedCategory === '전체'
    ? words
    : words.filter(w => w.category === selectedCategory);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>📖 장문 연습</h1>
        <p className={styles.description}>장문을 보고 단어를 외워보세요</p>

        <div className={styles.filters}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`${styles.filterBtn} ${selectedCategory === cat ? styles.active : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>카테고리</th>
                <th>단어</th>
                <th>뜻</th>
                <th>예문</th>
                <th>발음</th>
              </tr>
            </thead>
            <tbody>
              {filteredWords.map((word) => (
                <tr key={word.id}>
                  <td className={styles.category}>{word.category || '기타'}</td>
                  <td className={styles.term}>{word.term}</td>
                  <td>{word.definition}</td>
                  <td className={styles.example}>{word.example || '-'}</td>
                  <td>
                    <PlayButton text={word.term} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredWords.length === 0 && (
          <p className={styles.empty}>해당 카테고리에 단어가 없습니다.</p>
        )}
      </main>
    </div>
  );
}