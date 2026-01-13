'use client';

import { useState, useCallback, useRef } from 'react';

type Props = {
  text: string;
};

export function PlayButton({ text }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const clickCountRef = useRef(0);
  const lastClickTimeRef = useRef(0);

  const handlePlay = useCallback(async () => {
    if (isLoading) return;
    
    const now = Date.now();
    
    // 3초 이내 재클릭이면 카운트 증가, 아니면 리셋
    if (now - lastClickTimeRef.current < 3000) {
      clickCountRef.current += 1;
    } else {
      clickCountRef.current = 1;
    }
    lastClickTimeRef.current = now;
    
    const isSlowMode = clickCountRef.current >= 2;
    
    setIsLoading(true);
    
    try {
      const savedConfig = localStorage.getItem('tts-config');
      const config = savedConfig ? JSON.parse(savedConfig) : {
        voice: 'en-US-Neural2-J',
        rate: 0.9,
        pitch: 0,
      };

      // 2번째 클릭이면 0.3 느리게
      const adjustedRate = isSlowMode 
        ? Math.max(0.25, config.rate - 0.2)  // 최소 0.25
        : config.rate;

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text,
          voice: config.voice,
          rate: adjustedRate,
          pitch: config.pitch,
        }),
      });

      if (!response.ok) {
        throw new Error('TTS API failed');
      }

      const data = await response.json();
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      audio.play();
    } catch (error) {
      console.error('TTS Error:', error);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    } finally {
      setIsLoading(false);
    }
  }, [text, isLoading]);

  return (
    <button 
      onClick={handlePlay}
      disabled={isLoading}
      style={{
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        cursor: isLoading ? 'wait' : 'pointer',
        opacity: isLoading ? 0.5 : 1,
      }}
      aria-label={`${text} 발음 듣기`}
    >
      {isLoading ? '⏳' : '🔊'}
    </button>
  );
}