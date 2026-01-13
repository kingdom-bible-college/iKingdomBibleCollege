'use client';

import { useState, useEffect, useRef } from 'react';
import { PlayButton } from '@/components/PlayButton';
import { useTTS } from '@/hooks/useTTS';
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
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isRepeatOne, setIsRepeatOne] = useState(false);
  const [playingWordId, setPlayingWordId] = useState<number | null>(null);
  const [restartTrigger, setRestartTrigger] = useState(0);
  
  const { play, stop } = useTTS();
  const autoPlayRef = useRef(false);
  const repeatOneRef = useRef(false);
  const startIndexRef = useRef(0);

  const filteredWords = selectedCategory === '전체'
    ? words
    : words.filter(w => w.category === selectedCategory);

  const handleLoopClick = (index: number) => {
    startIndexRef.current = index;
    setIsRepeatOne(true);
    setIsAutoPlaying(true);
    setRestartTrigger(prev => prev + 1); // Force effect restart
  };

  useEffect(() => {
    repeatOneRef.current = isRepeatOne; // Sync ref
  }, [isRepeatOne]);

  useEffect(() => {
    if (!isAutoPlaying) {
      stop();
      setPlayingWordId(null);
      return;
    }

    let isCancelled = false; // Local flag for this effect instance

    const startAutoPlay = async () => {
      if (filteredWords.length === 0) {
        setIsAutoPlaying(false);
        return;
      }

      let index = startIndexRef.current;
      if (index < 0 || index >= filteredWords.length) index = 0;
      startIndexRef.current = 0;

      while (!isCancelled) {
        const word = filteredWords[index];
        setPlayingWordId(word.id);
        
        const element = document.getElementById(`word-row-${word.id}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });

        try {
          // 1. Normal Speed (or user setting)
          await play(word.term);
          
          if (!isCancelled) {
             await new Promise(resolve => setTimeout(resolve, 500)); // Short pause
          }
          
          // 2. Slow Speed (0.6x)
          if (!isCancelled) {
            await play(word.term, { rate: 0.6 });
          }

          // Wait before next word
          if (!isCancelled) {
             await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error("Auto play error:", error);
          break;
        }

        if (isCancelled) break;

        if (!repeatOneRef.current) {
          index++;
          if (index >= filteredWords.length) {
            index = 0;
          }
        }
      }
      setPlayingWordId(null);
    };

    startAutoPlay();

    return () => {
      isCancelled = true; // Cancel ONLY this instance
      stop();
    };
  }, [isAutoPlaying, filteredWords, play, stop, restartTrigger]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.headerTitle}>
          <div>
            <h1 className={styles.title}>📖 장문 연습</h1>
            <p className={styles.description}>장문을 보고 단어를 외워보세요</p>
          </div>
          <div className={styles.controls}>
            <button
              onClick={() => {
                // If starting from scratch, allow it. If stopping, stop.
                if (!isAutoPlaying) setRestartTrigger(prev => prev + 1);
                setIsAutoPlaying(!isAutoPlaying);
              }}
              className={`${styles.autoPlayBtn} ${isAutoPlaying ? styles.playing : ''}`}
            >
              {isAutoPlaying ? '⏹ 정지' : '▶️ 전체 무한 반복'}
            </button>
            {isAutoPlaying && (
              <button
                onClick={() => setIsRepeatOne(!isRepeatOne)}
                className={`${styles.repeatOneBtn} ${isRepeatOne ? styles.active : ''}`}
                title="한 단어 반복"
              >
                {isRepeatOne ? '🔂 한 단어 반복 중' : '🔁 순차 재생'}
              </button>
            )}
          </div>
        </div>

        <div className={styles.filters}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setIsAutoPlaying(false);
              }}
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
              {filteredWords.map((word, index) => (
                <tr 
                  key={word.id} 
                  id={`word-row-${word.id}`}
                  className={playingWordId === word.id ? styles.activeRow : ''}
                >
                  <td className={styles.category} data-label="카테고리">{word.category || '기타'}</td>
                  <td 
                    className={styles.term} 
                    data-label="단어"
                    onClick={() => handleLoopClick(index)}
                    style={{ cursor: 'pointer' }}
                    title="클릭하여 이 단어 반복 듣기"
                  >
                    {word.term}
                  </td>
                  <td data-label="뜻">{word.definition}</td>
                  <td className={styles.example} data-label="예문">{word.example || '-'}</td>
                  <td data-label="발음">
                    <div className={styles.audioControls}>
                      <PlayButton text={word.term} />
                      <button 
                        className={`${styles.loopBtn} ${playingWordId === word.id && isRepeatOne ? styles.active : ''}`}
                        onClick={() => handleLoopClick(index)}
                        title="이 단어 무한 반복"
                      >
                       🔂
                      </button>
                    </div>
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