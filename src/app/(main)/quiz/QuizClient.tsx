'use client';

import { useState, useEffect } from 'react';
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

export function QuizClient({ words }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const [isStarted, setIsStarted] = useState(false);

  const startQuiz = () => {
    const filtered = selectedCategory === '전체'
      ? words
      : words.filter(w => w.category === selectedCategory);
    
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setShowAnswer(false);
    setIsStarted(true);
  };

  // 카테고리 선택 화면
  if (!isStarted) {
    const getCategoryCount = (cat: string) => {
      if (cat === '전체') return words.length;
      return words.filter(w => w.category === cat).length;
    };

    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <h1 className={styles.title}>🎯 퀴즈</h1>
          <p className={styles.description}>카테고리를 선택하고 퀴즈를 시작하세요</p>

          <div className={styles.categoryGrid}>
            {CATEGORIES.map((cat) => {
              const count = getCategoryCount(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`${styles.categoryCard} ${selectedCategory === cat ? styles.selected : ''}`}
                  disabled={count === 0}
                >
                  <span className={styles.categoryName}>{cat}</span>
                  <span className={styles.categoryCount}>{count}개</span>
                </button>
              );
            })}
          </div>

          <button 
            onClick={startQuiz} 
            className={styles.startBtn}
            disabled={getCategoryCount(selectedCategory) === 0}
          >
            🚀 퀴즈 시작
          </button>
        </main>
      </div>
    );
  }

  if (shuffledWords.length === 0) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <h1 className={styles.title}>🎯 퀴즈</h1>
          <p className={styles.empty}>선택한 카테고리에 단어가 없습니다.</p>
          <button onClick={() => setIsStarted(false)} className={styles.backBtn}>
            ← 돌아가기
          </button>
        </main>
      </div>
    );
  }

  const currentWord = shuffledWords[currentIndex];
  const isFinished = currentIndex >= shuffledWords.length;

  const handleAnswer = (isCorrect: boolean) => {
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
    setShowAnswer(false);
    setCurrentIndex(prev => prev + 1);
  };

  const handleRestart = () => {
    startQuiz();
  };

  if (isFinished) {
    const percentage = Math.round((score.correct / score.total) * 100);
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.resultCard}>
            <h1 className={styles.resultTitle}>🎉 퀴즈 완료!</h1>
            <p className={styles.resultCategory}>카테고리: {selectedCategory}</p>
            <p className={styles.resultScore}>
              {score.correct} / {score.total} 정답
            </p>
            <p className={styles.resultPercent}>{percentage}%</p>
            <div className={styles.resultButtons}>
              <button onClick={() => setIsStarted(false)} className={styles.backBtn}>
                ← 다른 카테고리
              </button>
              <button onClick={handleRestart} className={styles.restartBtn}>
                🔄 다시 시작
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>🎯 퀴즈</h1>
            <span className={styles.currentCategory}>{selectedCategory}</span>
          </div>
          <span className={styles.progress}>
            {currentIndex + 1} / {shuffledWords.length}
          </span>
        </div>

        <div className={styles.quizCard}>
          <div className={styles.termSection}>
            <h2 className={styles.quizTerm}>{currentWord.term}</h2>
            <PlayButton text={currentWord.term} />
          </div>

          {!showAnswer ? (
            <button 
              onClick={() => setShowAnswer(true)} 
              className={styles.showBtn}
            >
              정답 보기
            </button>
          ) : (
            <div className={styles.answerSection}>
              <p className={styles.definition}>{currentWord.definition}</p>
              {currentWord.example && (
                <p className={styles.example}>💡 {currentWord.example}</p>
              )}
              <div className={styles.buttons}>
                <button 
                  onClick={() => handleAnswer(false)} 
                  className={styles.wrongBtn}
                >
                  ❌ 몰랐어요
                </button>
                <button 
                  onClick={() => handleAnswer(true)} 
                  className={styles.correctBtn}
                >
                  ✅ 알았어요
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}