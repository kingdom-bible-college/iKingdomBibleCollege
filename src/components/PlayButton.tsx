'use client';

import { useState, useRef } from 'react';

type Props = {
  text: string;
};

// 전역 오디오 참조 (겹침 방지)
let currentAudio: HTMLAudioElement | null = null;

export function PlayButton({ text }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const clickCountRef = useRef(0);
  const lastClickTimeRef = useRef(0);

  const handleClick = async () => {
    // 이전 오디오 정지
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
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

    setIsLoading(true);

    try {
      // localStorage에서 설정 가져오기
      const savedSettings = localStorage.getItem('tts-settings');
      const settings = savedSettings ? JSON.parse(savedSettings) : {};

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: settings.voice || 'en-US-Neural2-J',
          rate: isSlowMode ? 0.6 : (settings.rate || 0.9),
          pitch: settings.pitch || 0,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        currentAudio = audio;
        audio.play();
      } else {
        // 실패시 브라우저 TTS 사용
        fallbackTTS(text, rate);
      }
    } catch (error) {
      fallbackTTS(text, rate);
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackTTS = (text: string, rate: number) => {
    window.speechSynthesis.cancel(); // 이전 발음 취소
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.2rem',
        opacity: isLoading ? 0.5 : 1,
      }}
      title="발음 듣기"
    >
      {isLoading ? '⏳' : '🔊'}
    </button>
  );
}