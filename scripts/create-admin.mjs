import { config } from "dotenv";
import postgres from "postgres";
import { randomBytes, scryptSync } from "crypto";

config({ path: ".env.local" });

const email = process.env.ADMIN_EMAIL || "admin@kbc.local";
const password = process.env.ADMIN_PASSWORD || "1234";
const name = process.env.ADMIN_NAME || "Admin";

const connectionString =
  process.env.KBC_DATABASE_URL_NON_POOLING ||
  process.env.KBC_DATABASE_URL ||
  process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Database URL is not set in .env.local");
}

const sql = postgres(connectionString);

const salt = randomBytes(16);
const derived = scryptSync(password, salt, 64);
const passwordHash = `scrypt$${salt.toString("base64")}$${derived.toString(
  "base64"
)}`;

const existing = await sql`
  SELECT id FROM users WHERE email = ${email} LIMIT 1
`;

if (existing.length) {
  await sql`
    UPDATE users
    SET password_hash = ${passwordHash},
        status = 'approved',
        role = 'admin',
        updated_at = NOW()
    WHERE id = ${existing[0].id}
  `;
  console.log(`Updated admin user: ${email}`);
} else {
  await sql`
    INSERT INTO users (name, email, password_hash, status, role, created_at, updated_at)
    VALUES (${name}, ${email}, ${passwordHash}, 'approved', 'admin', NOW(), NOW())
  `;
  console.log(`Created admin user: ${email}`);
}

console.log(`Password set to: ${password}`);

await sql.end();
