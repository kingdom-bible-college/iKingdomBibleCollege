import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_TTS_API_KEY = process.env.GOOGLE_TTS_API_KEY;
const TTS_API_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';

export async function POST(request: NextRequest) {
  try {
    const { text, voice, rate, pitch } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (!GOOGLE_TTS_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const response = await fetch(`${TTS_API_URL}?key=${GOOGLE_TTS_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode: voice?.substring(0, 5) || 'en-US',
          name: voice || 'en-US-Neural2-J',
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: rate || 0.9,
          pitch: pitch || 0,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('TTS API Error:', error);
      return NextResponse.json({ error: 'TTS API failed' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ audioContent: data.audioContent });
  } catch (error) {
    console.error('TTS Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 💡 코드 설명
// en-US-Neural2-J - Google의 고품질 Neural2 음성 (남성)
// audioEncoding: 'MP3' - MP3 형식으로 반환
// speakingRate: 0.9 - 약간 천천히 (학습용)

// 💡 변경점
// voice, rate, pitch를 request body에서 받음
// languageCode는 voice에서 자동 추출 (예: en-US-Neural2-J → en-US)
// 기본값 설정 (값이 없을 때 대비)