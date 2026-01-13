export const dynamic = 'force-dynamic';

import { getAllWords } from '@/db/queries/words';
import { HomeClient } from '@/components/HomeClient';

export default async function Home() {
  const words = await getAllWords();

  return <HomeClient words={words} />;
}