'use client';

import { useRef } from 'react';
import { useTTS } from '@/hooks/useTTS';

type Props = {
  text: string;
};

export function PlayButton({ text }: Props) {
  const { play, isLoading, isPlaying, stop } = useTTS();
  const clickCountRef = useRef(0);
  const lastClickTimeRef = useRef(0);

  const handleClick = async () => {
    // 이미 재생 중이면 정지
    if (isPlaying) {
      stop();
      return;
    }

    // 더블클릭 감지 (0.5초 이내)
    const now = Date.now();
    if (now - lastClickTimeRef.current < 500) {
      clickCountRef.current += 1;
    } else {
      clickCountRef.current = 1;
    }
    lastClickTimeRef.current = now;

    // 2번째 클릭이면 느리게
    const isSlowMode = clickCountRef.current >= 2;
    const rate = isSlowMode ? 0.6 : 0.9;

    await play(text, { rate });
  };

  return (
    <button
      onClick={handleClick}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.2rem',
        opacity: isLoading ? 0.5 : 1,
      }}
      title="발음 듣기"
    >
      {isLoading ? '⏳' : (isPlaying ? '🔊' : '🔈')}
    </button>
  );
}