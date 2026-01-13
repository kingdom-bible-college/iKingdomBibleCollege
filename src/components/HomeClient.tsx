'use client';

import { useState } from 'react';
import { WordCard } from '@/components/WordCard';
import { AddWordForm } from '@/components/AddWordForm';
import { TTSSettings } from '@/components/TTSSettings';
import styles from '../app/page.module.css';

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

export function HomeClient({ words }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const filteredWords = selectedCategory === '전체'
    ? words
    : words.filter(w => w.category === selectedCategory);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>📚 Daily Vocab</h1>
        <p className={styles.description}>매일 새로운 단어를 학습하세요</p>
        
        <AddWordForm />
        
        <TTSSettings />

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
        
        <section className={styles.wordList}>
          {filteredWords.length === 0 ? (
            <p className={styles.empty}>
              {selectedCategory === '전체' 
                ? '아직 등록된 단어가 없습니다.'
                : '해당 카테고리에 단어가 없습니다.'}
            </p>
          ) : (
            filteredWords.map((word) => (
              <WordCard key={word.id} word={word} />
            ))
          )}
        </section>
      </main>
    </div>
  );
}