export const dynamic = 'force-dynamic';
import { getAllWords } from '@/db/queries/words';
import { PlayButton } from '@/components/PlayButton';
import { TTSSettings } from '@/components/TTSSettings';
import styles from './page.module.css';

export default async function Home() {
  const words = await getAllWords();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* <h1 className={styles.title}>📚 Daily Vocab</h1> */}
        {/* <p className={styles.description}>매일 새로운 단어를 학습하세요</p> */}
        
        <TTSSettings />
        
        <section className={styles.wordList}>
          {words.length === 0 ? (
            <p className={styles.empty}>아직 등록된 단어가 없습니다.</p>
          ) : (
            words.map((word) => (
              <article key={word.id} className={styles.wordCard}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.term}>{word.term}</h2>
                  <PlayButton text={word.term} />
                </div>
                <p className={styles.definition}>{word.definition}</p>
                {word.example && (
                  <p className={styles.example}>💡 {word.example}</p>
                )}
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}