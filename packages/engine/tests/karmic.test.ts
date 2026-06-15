import { describe, it, expect } from 'vitest';
import { calculateKarmicLessons } from '../src/calculators/karmic-lessons.calculator.js';
import { calculateHiddenTendencies } from '../src/calculators/hidden-tendencies.calculator.js';
import { collectKarmicDebts } from '../src/calculators/karmic-debts.calculator.js';
import type { CalculationTrace } from '../src/types/index.js';

// Helper to build a minimal CalculationTrace with an optional karmic debt
function makeTrace(result: number, karmicDebt?: number): CalculationTrace {
  return {
    result,
    isMasterNumber: false,
    ...(karmicDebt !== undefined && { karmicDebt }),
    formula: `test formula → ${result}`,
    steps: [{ description: 'test', value: result }],
    methodologicalNote: 'test note',
  };
}

describe('calculateKarmicLessons — MARIA SILVA', () => {
  // MARIA SILVA letter values: M=4,A=1,R=9,I=9,A=1, S=1,I=9,L=3,V=4,A=1
  // Frequency: 1→4, 3→1, 4→2, 9→3
  // Missing from 1-9: 2, 5, 6, 7, 8
  const frequency: Record<number, number> = { 1: 4, 3: 1, 4: 2, 9: 3 };

  it('returns [2, 5, 6, 7, 8]', () => {
    const lessons = calculateKarmicLessons(frequency);
    expect(lessons).toEqual([2, 5, 6, 7, 8]);
  });
});

describe('calculateKarmicLessons — all digits present', () => {
  const frequency: Record<number, number> = {
    1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1,
  };

  it('returns empty array when all 1-9 are present', () => {
    expect(calculateKarmicLessons(frequency)).toEqual([]);
  });
});

describe('calculateKarmicLessons — empty name', () => {
  it('returns all digits 1-9 for empty frequency map', () => {
    const lessons = calculateKarmicLessons({});
    expect(lessons).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});

describe('calculateHiddenTendencies — MARIA SILVA', () => {
  // MARIA SILVA: 9 appears 3 times → hidden tendency
  const frequency: Record<number, number> = { 1: 4, 3: 1, 4: 2, 9: 3 };

  it('detects 9 as hidden tendency (freq=3)', () => {
    const tendencies = calculateHiddenTendencies(frequency);
    expect(tendencies).toContainEqual({ number: 9, frequency: 3 });
  });

  it('also detects 1 as hidden tendency (freq=4)', () => {
    const tendencies = calculateHiddenTendencies(frequency);
    expect(tendencies).toContainEqual({ number: 1, frequency: 4 });
  });

  it('does not include numbers with freq < 3', () => {
    const tendencies = calculateHiddenTendencies(frequency);
    const numbers = tendencies.map((t) => t.number);
    expect(numbers).not.toContain(3); // freq=1
    expect(numbers).not.toContain(4); // freq=2
  });

  it('returns results sorted by number', () => {
    const tendencies = calculateHiddenTendencies(frequency);
    const numbers = tendencies.map((t) => t.number);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
  });
});

describe('calculateHiddenTendencies — custom threshold', () => {
  const frequency: Record<number, number> = { 1: 2, 5: 4 };

  it('uses threshold=2 when specified', () => {
    const tendencies = calculateHiddenTendencies(frequency, 2);
    const numbers = tendencies.map((t) => t.number);
    expect(numbers).toContain(1);
    expect(numbers).toContain(5);
  });
});

describe('collectKarmicDebts', () => {
  it('collects a single karmic debt from destiny', () => {
    const traces = {
      destiny: makeTrace(5, 14),
      mission: makeTrace(6),
      soul: makeTrace(3),
      personality: makeTrace(3),
    };

    const debts = collectKarmicDebts(traces);
    expect(debts).toHaveLength(1);
    expect(debts[0]?.original).toBe(14);
    expect(debts[0]?.number).toBe(5);
  });

  it('deduplicates the same debt number across multiple traces', () => {
    const traces = {
      destiny: makeTrace(5, 14),
      mission: makeTrace(5, 14),
    };

    const debts = collectKarmicDebts(traces);
    expect(debts).toHaveLength(1);
  });

  it('collects multiple distinct debts', () => {
    const traces = {
      destiny: makeTrace(4, 13),
      mission: makeTrace(7, 16),
      soul: makeTrace(3),
    };

    const debts = collectKarmicDebts(traces);
    expect(debts).toHaveLength(2);
    const originals = debts.map((d) => d.original).sort((a, b) => a - b);
    expect(originals).toEqual([13, 16]);
  });

  it('returns empty array when no karmic debts exist', () => {
    const traces = {
      destiny: makeTrace(5),
      mission: makeTrace(6),
    };

    expect(collectKarmicDebts(traces)).toEqual([]);
  });
});
