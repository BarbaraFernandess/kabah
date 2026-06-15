import { describe, it, expect } from 'vitest';
import { calculateLifeCycles } from '../src/calculators/life-cycles.calculator.js';
import { calculateChallenges } from '../src/calculators/challenges.calculator.js';

describe('calculateLifeCycles — 15/03/1985, destiny=5', () => {
  // month=3 (already reduced)
  // day=1+5=6
  // year=1+9+8+5=23→5
  // 1st cycle: month=3, ends at 36-5=31
  // 2nd cycle: day=6, 31→58
  // 3rd cycle: year=5, 58→∞
  const cycles = calculateLifeCycles({ day: 15, month: 3, year: 1985 }, 5);

  it('returns exactly 3 cycles', () => {
    expect(cycles).toHaveLength(3);
  });

  describe('1st cycle (Formativo)', () => {
    const first = cycles[0]!;
    it('number is 3 (month reduced)', () => expect(first.number).toBe(3));
    it('name is Formativo', () => expect(first.name).toBe('Formativo'));
    it('starts at age 0', () => expect(first.startAge).toBe(0));
    it('ends at age 31 (36-5=31)', () => expect(first.endAge).toBe(31));
    it('is not a master number', () => expect(first.isMasterNumber).toBe(false));
  });

  describe('2nd cycle (Produtivo)', () => {
    const second = cycles[1]!;
    it('number is 6 (day 15 → 1+5=6)', () => expect(second.number).toBe(6));
    it('name is Produtivo', () => expect(second.name).toBe('Produtivo'));
    it('starts at age 31', () => expect(second.startAge).toBe(31));
    it('ends at age 58 (31+27)', () => expect(second.endAge).toBe(58));
    it('is not a master number', () => expect(second.isMasterNumber).toBe(false));
  });

  describe('3rd cycle (Colheita)', () => {
    const third = cycles[2]!;
    it('number is 5 (year 1985 → 23 → 5)', () => expect(third.number).toBe(5));
    it('name is Colheita', () => expect(third.name).toBe('Colheita'));
    it('starts at age 58', () => expect(third.startAge).toBe(58));
    it('never ends (endAge = null)', () => expect(third.endAge).toBeNull());
  });
});

describe('calculateLifeCycles — master number in day', () => {
  // day=29 → 2+9=11 (master), destiny=7 → first ends at 36-7=29
  const cycles = calculateLifeCycles({ day: 29, month: 1, year: 2000 }, 7);

  it('2nd cycle number is master 11', () => {
    expect(cycles[1]?.number).toBe(11);
    expect(cycles[1]?.isMasterNumber).toBe(true);
  });
});

describe('calculateChallenges — 15/03/1985', () => {
  // month=3, day=6 (1+5), year=5 (1985→23→5)
  // Challenge1 = |3-6| = 3
  // Challenge2 = |6-5| = 1
  // ChallengeMain = |3-1| = 2
  // ChallengeFinal = 3+6+5 = 14 (not reduced)
  const challenges = calculateChallenges({ day: 15, month: 3, year: 1985 });

  it('returns exactly 4 challenges', () => {
    expect(challenges).toHaveLength(4);
  });

  it('Desafio 1 = 3', () => {
    expect(challenges[0]?.number).toBe(3);
    expect(challenges[0]?.name).toBe('Desafio 1');
  });

  it('Desafio 2 = 1', () => {
    expect(challenges[1]?.number).toBe(1);
    expect(challenges[1]?.name).toBe('Desafio 2');
  });

  it('Desafio Principal = 2', () => {
    expect(challenges[2]?.number).toBe(2);
    expect(challenges[2]?.name).toBe('Desafio Principal');
  });

  it('Desafio Final = 14 (not further reduced)', () => {
    expect(challenges[3]?.number).toBe(14);
    expect(challenges[3]?.name).toBe('Desafio Final');
  });
});

describe('calculateChallenges — traces', () => {
  const challenges = calculateChallenges({ day: 15, month: 3, year: 1985 });

  it('each challenge has a non-empty formula', () => {
    for (const ch of challenges) {
      expect(ch.trace.formula.length).toBeGreaterThan(0);
    }
  });

  it('each challenge has steps', () => {
    for (const ch of challenges) {
      expect(ch.trace.steps.length).toBeGreaterThan(0);
    }
  });
});
