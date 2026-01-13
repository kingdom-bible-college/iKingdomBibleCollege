'use client';

import { useState } from 'react';
import { PlayButton } from './PlayButton';
import { DeleteButton } from './DeleteButton';
import { EditWordModal } from './EditWordModal';
import styles from './WordCard.module.css';

type Word = {
  id: number;
  term: string;
  definition: string;
  example: string | null;
  category: string | null;
};

type Props = {
  word: Word;
};

export function WordCard({ word }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <article className={styles.card} onClick={() => setIsEditing(true)}>
        <span className={styles.category}>{word.category || '기타'}</span>
        <DeleteButton wordId={word.id} />
        
        <div className={styles.header}>
          <h2 className={styles.term}>{word.term}</h2>
          <div onClick={(e) => e.stopPropagation()}>
            <PlayButton text={word.term} />
          </div>
        </div>
        
        <p className={styles.definition}>{word.definition}</p>
        {word.example && (
          <p className={styles.example}>💡 {word.example}</p>
        )}
      </article>

      {isEditing && (
        <EditWordModal word={word} onClose={() => setIsEditing(false)} />
      )}
    </>
  );
}