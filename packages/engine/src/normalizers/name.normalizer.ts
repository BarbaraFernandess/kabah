/**
 * Name normalisation utilities for Kabalistic Numerology.
 *
 * Responsibilities:
 *   1. Remove diacritics / accents using the accent map from config.
 *   2. Convert to uppercase.
 *   3. Filter out methodological particles (DE, DA, DO, DOS, DAS, E).
 */

import { numerologyConfig } from '../config/numerology.config.js';

const { accentMap, particles } = numerologyConfig;

/**
 * Normalise a single character:
 *   - Apply accent map (Á→A, Ç→C, etc.)
 *   - Convert to uppercase.
 */
export function normalizeChar(char: string): string {
  const upper = char.toUpperCase();
  return (accentMap as Record<string, string>)[upper] ?? upper;
}

/**
 * Normalise every character in a string:
 *   - Remove accents via `normalizeChar`.
 *   - Return uppercase result.
 */
export function normalizeAccents(str: string): string {
  return str
    .split('')
    .map(normalizeChar)
    .join('');
}

/**
 * Given an array of (already-uppercased, accent-normalised) words,
 * return only the words that are NOT methodological particles.
 */
export function filterParticles(words: string[]): string[] {
  const particleSet = new Set(particles as readonly string[]);
  return words.filter((w) => !particleSet.has(w));
}

/**
 * Full name normalisation pipeline:
 *   1. Normalise accents and uppercase.
 *   2. Split into individual words.
 *   3. Filter particles.
 *
 * Returns:
 *   - `words`    : all words after normalisation (before particle filter)
 *   - `filtered` : words with particles removed (used for calculations)
 */
export function normalizeName(name: string): {
  words: string[];
  filtered: string[];
} {
  const normalised = normalizeAccents(name.trim());
  const words = normalised.split(/\s+/).filter((w) => w.length > 0);
  const filtered = filterParticles(words);
  return { words, filtered };
}

/**
 * Extract every letter (A-Z) from an array of already-normalised words,
 * in order.
 */
export function extractLetters(words: string[]): string[] {
  return words
    .join('')
    .split('')
    .filter((c) => /^[A-Z]$/.test(c));
}
