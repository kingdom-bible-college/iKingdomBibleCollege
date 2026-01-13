'use client';

import { useState, useEffect } from 'react';

const VOICES = [
  { code: 'en-US-Neural2-J', label: '🇺🇸 미국 남성' },
  { code: 'en-US-Neural2-F', label: '🇺🇸 미국 여성' },
  { code: 'en-GB-Neural2-B', label: '🇬🇧 영국 남성' },
  { code: 'en-GB-Neural2-F', label: '🇬🇧 영국 여성' },
  { code: 'en-AU-Neural2-B', label: '🇦🇺 호주 남성' },
];

export type TTSConfig = {
  voice: string;
  rate: number;
  pitch: number;
};

const DEFAULT_CONFIG: TTSConfig = {
  voice: 'en-US-Neural2-J',
  rate: 0.9,
  pitch: 0,
};

export function TTSSettings() {
  const [config, setConfig] = useState<TTSConfig>(DEFAULT_CONFIG);

  // localStorage에서 설정 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('tts-settings');
    if (saved) {
      setConfig(JSON.parse(saved));
    }
  }, []);

  // 설정 변경 시 localStorage에 저장
  const updateConfig = (key: keyof TTSConfig, value: string | number) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    localStorage.setItem('tts-settings', JSON.stringify(newConfig));
  };

  return (
    <div className="tts-settings">
      <h3>🎛️ TTS 설정</h3>
      
      <label>
        🔊 음성
        <select 
          value={config.voice} 
          onChange={(e) => updateConfig('voice', e.target.value)}
        >
          {VOICES.map((v) => (
            <option key={v.code} value={v.code}>{v.label}</option>
          ))}
        </select>
      </label>

      <label>
        ⏩ 속도: {config.rate}
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.1"
          value={config.rate}
          onChange={(e) => updateConfig('rate', parseFloat(e.target.value))}
        />
      </label>

      <label>
        🎵 피치: {config.pitch}
        <input
          type="range"
          min="-10"
          max="10"
          step="1"
          value={config.pitch}
          onChange={(e) => updateConfig('pitch', parseInt(e.target.value))}
        />
      </label>
    </div>
  );
}