import { describe, it, expect } from 'vitest';
import { calculateDestiny } from '../src/calculators/destiny.calculator.js';

describe('calculateDestiny', () => {
  it('correctly computes destiny for 15/03/1985 → 5 with karmic debt 14', () => {
    // day:  1+5 = 6
    // month: 3
    // year: 1+9+8+5 = 23 → 2+3 = 5
    // sum:  6+3+5 = 14 → karmic debt 14 → result 5
    const trace = calculateDestiny({ day: 15, month: 3, year: 1985 });

    expect(trace.result).toBe(5);
    expect(trace.karmicDebt).toBe(14);
    expect(trace.isMasterNumber).toBe(false);
  });

  it('correctly computes destiny for 29/11/1975 — tests master in year', () => {
    // day: 2+9 = 11 (master)
    // month: 1+1 = 2
    // year: 1+9+7+5 = 22 (master)
    // sum: 11+2+22 = 35 → 3+5 = 8
    const trace = calculateDestiny({ day: 29, month: 11, year: 1975 });

    expect(trace.result).toBe(8);
    expect(trace.karmicDebt).toBeUndefined();
  });

  it('correctly computes destiny for 01/01/2000 → 3', () => {
    // day: 1
    // month: 1
    // year: 2+0+0+0 = 2
    // sum: 1+1+2 = 4
    const trace = calculateDestiny({ day: 1, month: 1, year: 2000 });

    expect(trace.result).toBe(4);
    expect(trace.karmicDebt).toBeUndefined();
  });

  it('detects karmic debt 13', () => {
    // Need sum = 13 before reduction
    // day=4, month=4, year: need 5 → e.g. 2003 → 2+0+0+3=5
    // 4+4+5 = 13 → karmic debt 13 → result 4
    const trace = calculateDestiny({ day: 4, month: 4, year: 2003 });

    expect(trace.result).toBe(4);
    expect(trace.karmicDebt).toBe(13);
  });

  it('handles single-digit day and month', () => {
    // day=5, month=3, year=1+9+9+0=19→1 → sum=5+3+1=9→no debt
    const trace = calculateDestiny({ day: 5, month: 3, year: 1990 });
    // year 1990: 1+9+9+0=19→1+9=10→1
    expect(trace.result).toBe(9);
  });

  it('produces a trace with formula and steps', () => {
    const trace = calculateDestiny({ day: 15, month: 3, year: 1985 });

    expect(trace.formula).toContain('15');
    expect(trace.formula).toContain('3');
    expect(trace.formula).toContain('1985');
    expect(trace.steps.length).toBeGreaterThan(0);
    expect(trace.methodologicalNote).toContain('Destino');
  });
});
