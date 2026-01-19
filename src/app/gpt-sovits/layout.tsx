import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TTS - AI 음성서비스',
  description: '고품질 AI 음성 서비스',
  openGraph: {
    title: 'TTS - AI 음성서비스',
    description: '고품질 AI 음성 서비스',
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
