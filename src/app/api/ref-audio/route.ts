import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filePath = searchParams.get('path');

  if (!filePath) {
    return NextResponse.json({ error: '파일 경로가 필요합니다.' }, { status: 400 });
  }

  // 보안: GPT-SoVITS 디렉토리 내 파일만 허용
  if (!filePath.startsWith('/Users/abc/GPT-SoVITS/')) {
    return NextResponse.json({ error: '허용되지 않는 경로입니다.' }, { status: 403 });
  }

  try {
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: '파일을 찾을 수 없습니다.' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    
    let contentType = 'audio/wav';
    if (ext === '.mp3') contentType = 'audio/mpeg';
    else if (ext === '.ogg') contentType = 'audio/ogg';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('파일 읽기 오류:', error);
    return NextResponse.json({ error: '파일 읽기 실패' }, { status: 500 });
  }
}
