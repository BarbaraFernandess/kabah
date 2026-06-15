import { describe, it, expect } from 'vitest';
import { calculatePersonality } from '../src/calculators/personality.calculator.js';
import { normalizeName, extractLetters } from '../src/normalizers/name.normalizer.js';
import { analyzeLetters } from '../src/tables/letter-table.js';
import { getLetterValue } from '../src/tables/letter-table.js';

function getConsonantValues(name: string): { letter: string; value: number }[] {
  const { filtered } = normalizeName(name);
  const letters = extractLetters(filtered);
  const consonantSet = new Set<string>();
  const vowelSet = new Set(['A', 'E', 'I', 'O', 'U']);

  const result: { letter: string; value: number }[] = [];
  for (const letter of letters) {
    if (!vowelSet.has(letter)) {
      const value = getLetterValue(letter);
      if (value !== null) {
        result.push({ letter, value });
      }
    }
  }
  return result;
}

describe('calculatePersonality — MARIA SILVA', () => {
  // MARIA SILVA consonants in order: M(4), R(9), S(1), L(3), V(4)
  // Sum = 4+9+1+3+4 = 21 → 2+1 = 3
  const consonantValues = getConsonantValues('MARIA SILVA');

  it('computes result 3', () => {
    const trace = calculatePersonality(consonantValues);
    expect(trace.result).toBe(3);
  });

  it('has no karmic debt', () => {
    const trace = calculatePersonality(consonantValues);
    expect(trace.karmicDebt).toBeUndefined();
  });

  it('is not a master number', () => {
    const trace = calculatePersonality(consonantValues);
    expect(trace.isMasterNumber).toBe(false);
  });
});

describe('calculatePersonality — produces karmic debt', () => {
  // Need consonant sum = 14 → e.g. R(9)+N(5)=14
  it('detects karmic debt 14 for R+N+...', () => {
    const trace = calculatePersonality([
      { letter: 'R', value: 9 },
      { letter: 'N', value: 5 },
    ]);
    expect(trace.result).toBe(5);
    expect(trace.karmicDebt).toBe(14);
  });
});

describe('calculatePersonality — produces master number', () => {
  // Need consonant sum = 11 → e.g. R(9)+B(2)=11
  it('produces master 11 for R+B', () => {
    const trace = calculatePersonality([
      { letter: 'R', value: 9 },
      { letter: 'B', value: 2 },
    ]);
    expect(trace.result).toBe(11);
    expect(trace.isMasterNumber).toBe(true);
  });
});

describe('calculatePersonality — empty consonants', () => {
  it('returns 0 for empty input', () => {
    const trace = calculatePersonality([]);
    expect(trace.result).toBe(0);
  });
});
