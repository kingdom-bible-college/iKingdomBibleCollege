'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';

interface VoicePreset {
  name: string;
  ref_audio_path: string;
  prompt_text: string;
  gpt_model?: string;
  sovits_model?: string;
}

const VOICE_PRESETS: VoicePreset[] = [
  {
    name: '근석 목소리',
    ref_audio_path: '/Users/abc/GPT-SoVITS/output/slicer_opt/근석(남).mp3_01.wav',
    prompt_text: '여러분, 안녕하세요! 지금부터 세계 곳곳의 주요 이슈를 짧고 간결하게 전해드리겠습니다.',
    // 근석은 pretrained 모델 사용 (별도 학습 없음)
  },
  {
    name: '승현 (뉴스)',
    ref_audio_path: '/Users/abc/GPT-SoVITS/output/slicer_opt/승현(남).mp3_0000647360_0000838080.wav',
    prompt_text: '이러한 변화는 환경보호뿐만 아니라 미래산업과 일자리 창출에도 중요한 영향을 미치고 있습니다.',
    gpt_model: 'GPT_weights_v2Pro/승현-e15.ckpt',
    sovits_model: 'SoVITS_weights_v2Pro/승현_e8_s352.pth',
  },
  {
    name: '조훈 (뉴스)',
    ref_audio_path: '/Users/abc/GPT-SoVITS/output/slicer_opt/조훈.mp3_0000048320_0000259200.wav',
    prompt_text: '여러분 안녕하세요. 지금부터 세계 곳곳의 주요 이슈를 짧고 간결하게 전해드리겠습니다.',
    gpt_model: 'GPT_weights_v2Pro/조훈-e15.ckpt',
    sovits_model: 'SoVITS_weights_v2Pro/조훈_e8_s360.pth',
  },
  {
    name: '구리 (뉴스)',
    ref_audio_path: '/Users/abc/GPT-SoVITS/output/slicer_opt/구리(남).mp3_0000000000_0000187520.wav',
    prompt_text: '여러분 안녕하세요? 지금부터 세계 곳곳의 주요 이슈를 짧고 간결하게 전해드리겠습니다!',
    gpt_model: 'GPT_weights_v2Pro/구리(남)-e15.ckpt',
    sovits_model: 'SoVITS_weights_v2Pro/구리(남)_e8_s304.pth',
  },
  {
    name: '기본 참조',
    ref_audio_path: '/Users/abc/GPT-SoVITS/dummy_ref.wav',
    prompt_text: '',
  },
];

const EMOTION_PRESETS = ['일반', '기쁨', '슬픔', '화남', '놀람'];

export default function GPTSoVITSPage() {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<VoicePreset>(VOICE_PRESETS[0]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(100);
  const [emotion, setEmotion] = useState('일반');
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const refAudioRef = useRef<HTMLAudioElement>(null);
  const [refAudioUrl, setRefAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const maxLength = 1000;

  const handleReset = () => {
    setText('');
    setAudioUrl(null);
    setError(null);
    setElapsedTime(0);
    setIsLoading(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('텍스트를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAudioUrl(null);
    setElapsedTime(0);
    
    // 타이머 시작
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    try {
      const response = await fetch('/api/gpt-sovits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          ref_audio_path: selectedVoice.ref_audio_path,
          prompt_text: selectedVoice.prompt_text,
          speed: speechSpeed,
          gpt_model: selectedVoice.gpt_model,
          sovits_model: selectedVoice.sovits_model,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'TTS 생성에 실패했습니다.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'TTS 생성에 실패했습니다.');
    } finally {
      // 타이머 정지
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsLoading(false);
    }
  };

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.volume = volume / 100;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  // 오디오 종료 시 isPlaying 상태 업데이트
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => setIsPlaying(false);
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, [audioUrl]);

  const playRefAudio = async () => {
    // 참조 오디오 파일을 API를 통해 가져오기
    try {
      const response = await fetch(`/api/ref-audio?path=${encodeURIComponent(selectedVoice.ref_audio_path)}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setRefAudioUrl(url);
        setTimeout(() => {
          if (refAudioRef.current) {
            refAudioRef.current.play();
          }
        }, 100);
      }
    } catch (err) {
      console.error('참조 오디오 재생 실패:', err);
    }
  };

  const getSpeedLabel = (speed: number) => {
    if (speed <= 0.7) return '느리게';
    if (speed <= 0.9) return '약간느리게';
    if (speed <= 1.1) return '보통';
    if (speed <= 1.3) return '빠르게';
    return '급하게';
  };

  const getPitchLabel = (p: number) => {
    if (p <= 0.7) return '매우낮게';
    if (p <= 0.9) return '다낮게';
    if (p <= 1.1) return '보통';
    if (p <= 1.3) return '다높게';
    return '매우높게';
  };

  return (
    <div className={styles.container}>
      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.editorCard}>
          <div className={styles.editorHeader}>
            <div className={styles.voiceDropdown}>
              <span className={styles.voiceIcon}>👤</span>
              <select
                className={styles.voiceSelect}
                value={selectedVoice.name}
                onChange={(e) => {
                  const voice = VOICE_PRESETS.find(v => v.name === e.target.value);
                  if (voice) setSelectedVoice(voice);
                }}
              >
                {VOICE_PRESETS.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.headerActions}>
              <button
                className={styles.generateBtn}
                onClick={handleGenerate}
                disabled={isLoading}
              >
                {isLoading ? `생성 중... ${elapsedTime}초` : '생성하기'}
              </button>
              <div className={styles.audioControls}>
                <button
                  className={styles.playBtn}
                  onClick={handlePlay}
                  disabled={!audioUrl}
                  title={isPlaying ? "일시정지" : "재생"}
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <button
                  className={styles.stopBtn}
                  onClick={handleStop}
                  disabled={!audioUrl}
                  title="정지 (처음으로)"
                >
                  ⏹
                </button>
              </div>
            </div>
          </div>

          <textarea
            className={styles.textarea}
            placeholder="텍스트를 입력하세요..."
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, maxLength))}
            maxLength={maxLength}
          />

          <div className={styles.exampleTextContainer}>
             <button 
               className={styles.exampleTextBtn}
               onClick={() => setText(`여러분 안녕하세요. 오늘의 주요 뉴스입니다.

정부는 오늘 물가 안정을 위해 추가 대책을 발표했습니다.
에너지와 식료품 가격 상승이 이어지는 가운데, 서민 부담을 줄이기 위한 지원책이 포함됐습니다.

한편, 전국적으로는 맑은 날씨가 이어지겠지만 일부 지역에는 오후부터 비가 내릴 전망입니다.
기온은 평년보다 다소 높은 수준을 보이겠습니다.

이상으로 오늘의 뉴스 전해드렸습니다. 감사합니다.`)}
             >
               📋 뉴스 대본 예시 넣기
             </button>
             <button 
               className={styles.resetBtn}
               onClick={handleReset}
               title="처음부터 다시 시작하기"
             >
               🔄 초기화
             </button>
          </div>

          <div className={styles.charCount}>
            {text.length}/{maxLength}
          </div>

          {error && <p className={styles.error}>{error}</p>}

          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              className={styles.hiddenAudio}
            />
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarSection}>
          <div className={styles.sectionTitle}>
            <span>🎙️</span> 보이스 선택
          </div>
          <div className={styles.voiceCard}>
            <span className={styles.voiceIcon}>👤</span>
            <span>{selectedVoice.name}</span>
            <button className={styles.voicePlayBtn} onClick={playRefAudio}>▶</button>
            {refAudioUrl && <audio ref={refAudioRef} src={refAudioUrl} />}
          </div>
        </div>

        <div className={styles.sidebarSection}>
          <div className={styles.sectionHeader}>
            <span>⏱️</span> 재생 속도
            <span className={styles.valueLabel}>{playbackSpeed}x</span>
          </div>
          <div className={styles.sliderContainer}>
            <span>⊖</span>
            <input
              type="range"
              className={styles.slider}
              min="0.5"
              max="3"
              step="0.1"
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
            />
            <span>⊕</span>
          </div>
          <div className={styles.sliderLabels}>
            <span>0.5x</span>
            <span>1x</span>
            <span>1.5x</span>
            <span>2x</span>
            <span>2.5x</span>
            <span>3x</span>
          </div>
        </div>

        <div className={styles.sidebarSection}>
          <div className={styles.sectionHeader}>
            <span>🗣️</span> 발화 속도
            <span className={styles.valueLabel}>{getSpeedLabel(speechSpeed)}</span>
          </div>
          <div className={styles.sliderContainer}>
            <span>⊖</span>
            <input
              type="range"
              className={styles.slider}
              min="0.5"
              max="1.5"
              step="0.1"
              value={speechSpeed}
              onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
            />
            <span>⊕</span>
          </div>
          <div className={styles.sliderLabels}>
            <span>느리게</span>
            <span>약간느리게</span>
            <span>보통</span>
            <span>빠르게</span>
            <span>급하게</span>
          </div>
        </div>

        <div className={styles.sidebarSection}>
          <div className={styles.sectionHeader}>
            <span>〰️</span> 목소리 높낮이
            <span className={styles.valueLabel}>{getPitchLabel(pitch)}</span>
          </div>
          <div className={styles.sliderContainer}>
            <span>⊖</span>
            <input
              type="range"
              className={styles.slider}
              min="0.5"
              max="1.5"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
            />
            <span>⊕</span>
          </div>
          <div className={styles.sliderLabels}>
            <span>매우낮게</span>
            <span>다낮게</span>
            <span>보통</span>
            <span>다높게</span>
            <span>매우높게</span>
          </div>
        </div>

        <div className={styles.sidebarSection}>
          <div className={styles.sectionHeader}>
            <span>🔊</span> 볼륨 조절
            <span className={styles.valueLabel}>{volume}%</span>
          </div>
          <div className={styles.sliderContainer}>
            <span>⊖</span>
            <input
              type="range"
              className={styles.slider}
              min="0"
              max="150"
              step="1"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
            />
            <span>⊕</span>
          </div>
          <div className={styles.sliderLabels}>
            <span>0%</span>
            <span>30%</span>
            <span>60%</span>
            <span>90%</span>
            <span>120%</span>
            <span>150%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
