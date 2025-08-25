const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

/**
 * PUBLIC_INTERFACE
 * generateId creates a short unique-ish id for notes.
 */
export function generateId(len = 8) {
  let s = '';
  for (let i = 0; i < len; i++) {
    s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return s + Date.now().toString(36);
}

/**
 * PUBLIC_INTERFACE
 * nowTs returns a numeric timestamp (ms).
 */
export function nowTs() {
  return Date.now();
}
