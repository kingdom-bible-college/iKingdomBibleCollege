import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

let _db: ReturnType<typeof drizzle>;

function getDb() {
  if (!_db) {
    const connectionString = process.env.KBC_DATABASE_URL;
    if (!connectionString) {
      throw new Error('KBC_DATABASE_URL is not set');
    }
    const client = postgres(connectionString, { prepare: false, max: 10, idle_timeout: 20 });
    _db = drizzle(client);
  }
  return _db;
}

// Proxy를 사용해서 기존 코드와 호환되게
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle>];
  },
});
