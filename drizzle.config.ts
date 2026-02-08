import {config} from 'dotenv'
config({path: `.env.local`})
import { defineConfig } from 'drizzle-kit';

const databaseUrl =
  process.env.KBC_DATABASE_URL_NON_POOLING ?? process.env.KBC_DATABASE_URL;

if (!databaseUrl) {
  throw new Error('KBC_DATABASE_URL is not set');
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
});
