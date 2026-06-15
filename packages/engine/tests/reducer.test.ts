import { describe, it, expect } from 'vitest';
import {
  reduce,
  isMasterNumber,
  isKarmicDebt,
  reduceWithKarmicCheck,
  sumDigits,
} from '../src/reducers/numeric.reducer.js';

describe('isMasterNumber', () => {
  it('returns true for 11', () => expect(isMasterNumber(11)).toBe(true));
  it('returns true for 22', () => expect(isMasterNumber(22)).toBe(true));
  it('returns true for 33', () => expect(isMasterNumber(33)).toBe(true));
  it('returns false for 44', () => expect(isMasterNumber(44)).toBe(false));
  it('returns false for 10', () => expect(isMasterNumber(10)).toBe(false));
  it('returns false for 9', () => expect(isMasterNumber(9)).toBe(false));
});

describe('isKarmicDebt', () => {
  it('returns true for 13', () => expect(isKarmicDebt(13)).toBe(true));
  it('returns true for 14', () => expect(isKarmicDebt(14)).toBe(true));
  it('returns true for 16', () => expect(isKarmicDebt(16)).toBe(true));
  it('returns true for 19', () => expect(isKarmicDebt(19)).toBe(true));
  it('returns false for 12', () => expect(isKarmicDebt(12)).toBe(false));
  it('returns false for 15', () => expect(isKarmicDebt(15)).toBe(false));
});

describe('reduce', () => {
  it('leaves single digits unchanged', () => {
    for (let d = 1; d <= 9; d++) {
      expect(reduce(d)).toBe(d);
    }
  });

  it('reduces 10 to 1', () => expect(reduce(10)).toBe(1));
  it('reduces 20 to 2', () => expect(reduce(20)).toBe(2));

  it('preserves master 11', () => expect(reduce(11)).toBe(11));
  it('preserves master 22', () => expect(reduce(22)).toBe(22));
  it('preserves master 33', () => expect(reduce(33)).toBe(33));

  it('reduces 29 to 11 (2+9=11, master)', () => expect(reduce(29)).toBe(11));
  it('reduces 38 to 11 (3+8=11)', () => expect(reduce(38)).toBe(11));
  it('reduces 99 to 9 (9+9=18 → 1+8=9)', () => expect(reduce(99)).toBe(9));
  it('reduces 23 to 5 (2+3=5)', () => expect(reduce(23)).toBe(5));
  it('reduces 100 to 1', () => expect(reduce(100)).toBe(1));
  it('reduces 42 to 6 (4+2=6)', () => expect(reduce(42)).toBe(6));
  it('reduces 14 to 5 (1+4=5) even though 14 is karmic', () =>
    expect(reduce(14)).toBe(5));
});

describe('reduceWithKarmicCheck', () => {
  it('records karmic debt 13 and returns result 4', () => {
    const r = reduceWithKarmicCheck(13);
    expect(r.result).toBe(4);
    expect(r.karmicDebt).toBe(13);
  });

  it('records karmic debt 14 and returns result 5', () => {
    const r = reduceWithKarmicCheck(14);
    expect(r.result).toBe(5);
    expect(r.karmicDebt).toBe(14);
  });

  it('records karmic debt 16 and returns result 7', () => {
    const r = reduceWithKarmicCheck(16);
    expect(r.result).toBe(7);
    expect(r.karmicDebt).toBe(16);
  });

  it('records karmic debt 19 and returns result 10→1', () => {
    const r = reduceWithKarmicCheck(19);
    expect(r.result).toBe(1);
    expect(r.karmicDebt).toBe(19);
  });

  it('returns no karmic debt for 15', () => {
    const r = reduceWithKarmicCheck(15);
    expect(r.result).toBe(6);
    expect(r.karmicDebt).toBeUndefined();
  });

  it('returns no karmic debt for master 11', () => {
    const r = reduceWithKarmicCheck(11);
    expect(r.result).toBe(11);
    expect(r.karmicDebt).toBeUndefined();
  });
});

describe('sumDigits', () => {
  it('sums digits of 23 to 5', () => expect(sumDigits(23)).toBe(5));
  it('sums digits of 1985 to 23', () => expect(sumDigits(1985)).toBe(23));
  it('sums digits of 9 to 9', () => expect(sumDigits(9)).toBe(9));
});
