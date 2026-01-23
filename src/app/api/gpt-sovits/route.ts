import { NextRequest, NextResponse } from 'next/server';

const GPT_SOVITS_API_URL = process.env.GPT_SOVITS_API_URL || 'http://127.0.0.1:9880';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, ref_audio_path, prompt_text, speed = 1.0, gpt_model, sovits_model } = body;

    if (!text) {
      return NextResponse.json(
        { error: '텍스트가 필요합니다.' },
        { status: 400 }
      );
    }

    if (!ref_audio_path) {
      return NextResponse.json(
        { error: '참조 오디오 경로가 필요합니다.' },
        { status: 400 }
      );
    }

    // 모델 변경이 필요한 경우 먼저 모델 전환 API 호출
    if (gpt_model) {
      const gptSwitchRes = await fetch(
        `${GPT_SOVITS_API_URL}/set_gpt_weights?weights_path=${encodeURIComponent(gpt_model)}`
      );
      if (!gptSwitchRes.ok) {
        console.error('GPT 모델 전환 실패:', await gptSwitchRes.text());
      }
    }

    if (sovits_model) {
      const sovitsSwitchRes = await fetch(
        `${GPT_SOVITS_API_URL}/set_sovits_weights?weights_path=${encodeURIComponent(sovits_model)}`
      );
      if (!sovitsSwitchRes.ok) {
        console.error('SoVITS 모델 전환 실패:', await sovitsSwitchRes.text());
      }
    }

    // api_v2.py 엔드포인트: /tts
    const ttsResponse = await fetch(`${GPT_SOVITS_API_URL}/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        text_lang: 'ko',
        ref_audio_path,
        prompt_text: prompt_text || '',
        prompt_lang: 'ko',
        speed_factor: speed,
      }),
    });

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      console.error('GPT-SoVITS API 오류:', errorText);
      return NextResponse.json(
        { error: 'TTS 서버 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    const audioBuffer = await ttsResponse.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Disposition': 'attachment; filename="generated.wav"',
      },
    });
  } catch (error) {
    console.error('GPT-SoVITS API 요청 오류:', error);
    return NextResponse.json(
      { error: 'TTS 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
