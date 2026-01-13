import { useState, useRef, useCallback } from 'react';

// 전역 오디오 참조 (겹침 방지)
let globalAudio: HTMLAudioElement | null = null;

export type TTSOptions = {
  rate?: number;
  onEnded?: () => void;
};

export function useTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const resolveRef = useRef<(() => void) | null>(null);

  const stop = useCallback(() => {
    // Resolve any pending promise to unblock headers
    if (resolveRef.current) {
      resolveRef.current();
      resolveRef.current = null;
    }

    if (globalAudio) {
      globalAudio.pause();
      globalAudio.currentTime = 0;
      globalAudio = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    window.speechSynthesis.cancel();
  }, []);

  const play = useCallback(async (text: string, options?: TTSOptions) => {
    stop(); // 이전 오디오 정지 및 Promise 해결
    setIsLoading(true);
    setIsPlaying(true);

    return new Promise<void>(async (resolve, reject) => {
      resolveRef.current = resolve;

      const handleEnd = () => {
        setIsPlaying(false);
        setIsLoading(false);
        options?.onEnded?.();
        if (resolveRef.current === resolve) {
          resolveRef.current = null;
        }
        resolve();
      };

      try {
        // localStorage에서 설정 가져오기
        const savedSettings = localStorage.getItem('tts-settings');
        const settings = savedSettings ? JSON.parse(savedSettings) : {};
        const rate = options?.rate ?? settings.rate ?? 0.9;

        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            voice: settings.voice || 'en-US-Neural2-J',
            rate,
            pitch: settings.pitch || 0,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
          audioRef.current = audio;
          globalAudio = audio;

          audio.onended = handleEnd;
          audio.onerror = (e) => {
            console.error('Audio playback error', e);
            fallbackTTS(text, rate, handleEnd);
          };

          await audio.play();
        } else {
          fallbackTTS(text, rate, handleEnd);
        }
      } catch (error) {
        console.error('TTS Error', error);
        fallbackTTS(text, options?.rate ?? 0.9, handleEnd);
      } finally {
        if (!audioRef.current && !window.speechSynthesis.speaking) {
           // fallbackTTS execution check...
        } else {
           // Do not turn off loading here if audio started, handleEnd does it
           // But if it failed before starting audio?
        }
      }
    });
  }, [stop]);

  const fallbackTTS = (text: string, rate: number, onEnd: () => void) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.onend = onEnd;
    utterance.onerror = onEnd; // 에러나도 종료 처리
    window.speechSynthesis.speak(utterance);
  };

  return { play, stop, isPlaying, isLoading };
}
