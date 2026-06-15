import { describe, it, expect } from 'vitest';
import { calculateSoul } from '../src/calculators/soul.calculator.js';
import { normalizeName, extractLetters } from '../src/normalizers/name.normalizer.js';
import { analyzeLetters } from '../src/tables/letter-table.js';

function getVowelValues(name: string): { letter: string; value: number }[] {
  const { filtered } = normalizeName(name);
  const letters = extractLetters(filtered);
  const { vowels, letterValues } = analyzeLetters(letters);
  return letterValues.filter(({ letter }) => vowels.includes(letter));
}

// Proper approach: get vowel letter-values preserving order
function getSoulInput(name: string): { letter: string; value: number }[] {
  const { filtered } = normalizeName(name);
  const letters = extractLetters(filtered);
  const { vowels: vowelList } = analyzeLetters(letters);
  // Build values in the order they appear
  const result: { letter: string; value: number }[] = [];
  const vowelSet = new Set(['A', 'E', 'I', 'O', 'U']);
  for (const letter of letters) {
    if (vowelSet.has(letter)) {
      const val = { A: 1, E: 5, I: 9, O: 6, U: 3 }[letter] ?? 0;
      result.push({ letter, value: val });
    }
  }
  return result;
}

describe('calculateSoul — MARIA SILVA', () => {
  // MARIA SILVA vowels in order: A(1), I(9), A(1), I(9), A(1)
  // Sum = 1+9+1+9+1 = 21 → 2+1 = 3
  const vowelValues = getSoulInput('MARIA SILVA');

  it('computes result 3', () => {
    const trace = calculateSoul(vowelValues);
    expect(trace.result).toBe(3);
  });

  it('has no karmic debt', () => {
    const trace = calculateSoul(vowelValues);
    expect(trace.karmicDebt).toBeUndefined();
  });

  it('is not a master number', () => {
    const trace = calculateSoul(vowelValues);
    expect(trace.isMasterNumber).toBe(false);
  });
});

describe('calculateSoul — name with master number vowels', () => {
  // AIA → A(1)+I(9)+A(1) = 11 → master
  it('produces master 11 for AIA', () => {
    const trace = calculateSoul([
      { letter: 'A', value: 1 },
      { letter: 'I', value: 9 },
      { letter: 'A', value: 1 },
    ]);
    expect(trace.result).toBe(11);
    expect(trace.isMasterNumber).toBe(true);
  });
});

describe('calculateSoul — empty vowels', () => {
  it('returns 0 for a name with no vowels', () => {
    const trace = calculateSoul([]);
    expect(trace.result).toBe(0);
  });
});
