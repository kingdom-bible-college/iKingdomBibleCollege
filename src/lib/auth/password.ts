import 'server-only';

import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);
const SCRYPT_KEYLEN = 64;

export const hashPassword = async (password: string) => {
  const salt = randomBytes(16);
  const derived = (await scryptAsync(password, salt, SCRYPT_KEYLEN)) as Buffer;
  return `scrypt$${salt.toString('base64')}$${derived.toString('base64')}`;
};

export const verifyPassword = async (password: string, stored: string) => {
  const [scheme, saltB64, hashB64] = stored.split('$');
  if (scheme !== 'scrypt' || !saltB64 || !hashB64) {
    return stored === password;
  }

  const salt = Buffer.from(saltB64, 'base64');
  const expected = Buffer.from(hashB64, 'base64');
  const derived = (await scryptAsync(password, salt, expected.length)) as Buffer;

  return timingSafeEqual(expected, derived);
};
