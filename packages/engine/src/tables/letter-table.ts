/**
 * Letter-value table for Kabalistic Numerology (Sonia Café methodology).
 *
 * Wraps the config-driven letter table and vowel list so that the rest of the
 * engine never references raw config directly for letter lookups.
 */

import { numerologyConfig } from '../config/numerology.config.js';

const { letterTable, vowels } = numerologyConfig;

const VOWEL_SET = new Set(vowels as readonly string[]);

/**
 * Return the numerological value for `letter` (must be A-Z, uppercase).
 * Returns `null` for characters not present in the table.
 */
export function getLetterValue(letter: string): number | null {
  const value = (letterTable as Record<string, number>)[letter];
  return value !== undefined ? value : null;
}

/** Returns true if `letter` is a vowel (A, E, I, O, U). */
export function isVowel(letter: string): boolean {
  return VOWEL_SET.has(letter.toUpperCase());
}

/**
 * Returns true if `letter` is an alphabetical consonant
 * (i.e., it is in the letter table but is NOT a vowel).
 */
export function isConsonant(letter: string): boolean {
  const up = letter.toUpperCase();
  return /^[A-Z]$/.test(up) && !VOWEL_SET.has(up);
}

/** Analysis result for a set of (already normalised) letters. */
export type LetterAnalysis = {
  vowels: string[];
  consonants: string[];
  letterValues: { letter: string; value: number }[];
  /** Frequency map: digit 1-9 → how many times it appears */
  numberFrequency: Record<number, number>;
};

/**
 * Analyse an array of already-normalised uppercase letters and return
 * their vowel/consonant classification, individual values and frequency map.
 */
export function analyzeLetters(letters: string[]): LetterAnalysis {
  const vowelList: string[] = [];
  const consonantList: string[] = [];
  const letterValues: { letter: string; value: number }[] = [];
  const numberFrequency: Record<number, number> = {};

  for (const letter of letters) {
    const value = getLetterValue(letter);
    if (value === null) continue; // skip non-alphabetic characters

    letterValues.push({ letter, value });

    if (isVowel(letter)) {
      vowelList.push(letter);
    } else {
      consonantList.push(letter);
    }

    numberFrequency[value] = (numberFrequency[value] ?? 0) + 1;
  }

  return {
    vowels: vowelList,
    consonants: consonantList,
    letterValues,
    numberFrequency,
  };
}
