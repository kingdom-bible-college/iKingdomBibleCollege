import { getAllWords } from '@/db/queries/words';
import { PracticeClient } from './PracticeClient';

export const dynamic = 'force-dynamic';

export default async function PracticePage() {
  const words = await getAllWords();

  return <PracticeClient words={words} />;
}