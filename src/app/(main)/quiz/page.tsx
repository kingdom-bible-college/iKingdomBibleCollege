import { getAllWords } from '@/db/queries/words';
import { QuizClient } from './QuizClient';

export const dynamic = 'force-dynamic';

export default async function QuizPage() {
  const words = await getAllWords();

  return <QuizClient words={words} />;
}