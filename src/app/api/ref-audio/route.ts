import { NextRequest, NextResponse } from 'next/server';


const GPT_SOVITS_FILE_URL = process.env.GPT_SOVITS_FILE_URL || 'http://127.0.0.1:9999';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filePath = searchParams.get('path');

  if (!filePath) {
    return NextResponse.json({ error: '파일 경로가 필요합니다.' }, { status: 400 });
  }

  // 보안: GPT-SoVITS 디렉토리 내 파일만 허용
  if (!filePath.startsWith('/home/test02/GPT-SoVITS/')) {
    return NextResponse.json({ error: '허용되지 않는 경로입니다.' }, { status: 403 });
  }

  try {
    // 파일 경로를 URL로 변환
    // 예: /home/test02/GPT-SoVITS/foo/bar.wav -> http://...:9999/foo/bar.wav
    const relativePath = filePath.replace('/home/test02/GPT-SoVITS/', '');
    const fileUrl = `${GPT_SOVITS_FILE_URL}/${relativePath}`;
    
    // 원격 파일 서버에서 오디오 파일 가져오기
    const response = await fetch(fileUrl);
    
    if (!response.ok) {
      console.error('원격 서버에서 오디오 가져오기 실패:', response.status, fileUrl);
      return NextResponse.json({ error: '파일을 찾을 수 없습니다.' }, { status: 404 });
    }

    const audioBuffer = await response.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'audio/wav',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('파일 읽기 오류:', error);
    return NextResponse.json({ error: '파일 읽기 실패' }, { status: 500 });
  }
}
