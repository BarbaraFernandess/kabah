import { describe, it, expect } from 'vitest';
import { NumerologyEngine } from '../src/index.js';
import type { AnalysisInput } from '../src/types/index.js';

const engine = new NumerologyEngine();

// Reference person: MARIA SILVA, born 15/03/1985
// Reference date fixed so Personal Period tests are deterministic
const INPUT: AnalysisInput = {
  birthName: 'MARIA SILVA',
  birthDate: { day: 15, month: 3, year: 1985 },
  referenceDate: { day: 15, month: 6, year: 2026 },
};

const analysis = engine.analyze(INPUT);

describe('FullAnalysis — MARIA SILVA, 15/03/1985', () => {
  // ── Name Analysis ───────────────────────────────────────────────────────
  describe('nameAnalysis', () => {
    it('original name is preserved', () => {
      expect(analysis.nameAnalysis.originalName).toBe('MARIA SILVA');
    });

    it('letters are correct', () => {
      expect(analysis.nameAnalysis.letters).toEqual([
        'M', 'A', 'R', 'I', 'A', 'S', 'I', 'L', 'V', 'A',
      ]);
    });

    it('vowels: A, I, A, I, A', () => {
      expect(analysis.nameAnalysis.vowels).toEqual(['A', 'I', 'A', 'I', 'A']);
    });

    it('consonants: M, R, S, L, V', () => {
      expect(analysis.nameAnalysis.consonants).toEqual(['M', 'R', 'S', 'L', 'V']);
    });

    it('number frequency: 1→4, 3→1, 4→2, 9→3', () => {
      expect(analysis.nameAnalysis.numberFrequency[1]).toBe(4); // A appears 3x (val=1), but S also=1 → 4 total
      expect(analysis.nameAnalysis.numberFrequency[3]).toBe(1); // L=3
      expect(analysis.nameAnalysis.numberFrequency[4]).toBe(2); // M=4, V=4
      expect(analysis.nameAnalysis.numberFrequency[9]).toBe(3); // R=9, I=9, I=9
    });
  });

  // ── Destiny ─────────────────────────────────────────────────────────────
  describe('destiny', () => {
    it('result = 5', () => expect(analysis.destiny.result).toBe(5));
    it('has karmic debt 14', () => expect(analysis.destiny.karmicDebt).toBe(14));
    it('is not a master number', () => expect(analysis.destiny.isMasterNumber).toBe(false));
  });

  // ── Mission ─────────────────────────────────────────────────────────────
  describe('mission', () => {
    // M(4)+A(1)+R(9)+I(9)+A(1)+S(1)+I(9)+L(3)+V(4)+A(1) = 42 → 4+2 = 6
    it('result = 6', () => expect(analysis.mission.result).toBe(6));
    it('no karmic debt', () => expect(analysis.mission.karmicDebt).toBeUndefined());
  });

  // ── Soul ────────────────────────────────────────────────────────────────
  describe('soul', () => {
    // Vowels: A(1)+I(9)+A(1)+I(9)+A(1) = 21 → 2+1 = 3
    it('result = 3', () => expect(analysis.soul.result).toBe(3));
    it('no karmic debt', () => expect(analysis.soul.karmicDebt).toBeUndefined());
  });

  // ── Personality ─────────────────────────────────────────────────────────
  describe('personality', () => {
    // Consonants: M(4)+R(9)+S(1)+L(3)+V(4) = 21 → 2+1 = 3
    it('result = 3', () => expect(analysis.personality.result).toBe(3));
    it('no karmic debt', () => expect(analysis.personality.karmicDebt).toBeUndefined());
  });

  // ── Expression ──────────────────────────────────────────────────────────
  describe('expression', () => {
    // Destiny(5) + Mission(6) = 11 → master!
    it('result = 11 (master)', () => expect(analysis.expression.result).toBe(11));
    it('isMasterNumber = true', () => expect(analysis.expression.isMasterNumber).toBe(true));
  });

  // ── Motivation (no current name → equals Soul) ──────────────────────────
  describe('motivation (no current name)', () => {
    it('result = 3 (same as Soul)', () => expect(analysis.motivation.result).toBe(3));
  });

  // ── Impression (no current name → equals Personality) ───────────────────
  describe('impression (no current name)', () => {
    it('result = 3 (same as Personality)', () => expect(analysis.impression.result).toBe(3));
  });

  // ── Karmic Lessons ──────────────────────────────────────────────────────
  describe('karmicLessons', () => {
    // Frequency: 1,3,4,9 present → 2,5,6,7,8 absent
    it('returns [2, 5, 6, 7, 8]', () => {
      expect(analysis.karmicLessons).toEqual([2, 5, 6, 7, 8]);
    });
  });

  // ── Karmic Debts ────────────────────────────────────────────────────────
  describe('karmicDebts', () => {
    it('contains debt 14 from destiny', () => {
      const debt14 = analysis.karmicDebts.find((d) => d.original === 14);
      expect(debt14).toBeDefined();
      expect(debt14?.number).toBe(5);
    });

    it('has exactly 1 karmic debt', () => {
      expect(analysis.karmicDebts).toHaveLength(1);
    });
  });

  // ── Hidden Tendencies ───────────────────────────────────────────────────
  describe('hiddenTendencies', () => {
    it('number 9 appears 3 times → hidden tendency', () => {
      const t9 = analysis.hiddenTendencies.find((t) => t.number === 9);
      expect(t9).toBeDefined();
      expect(t9?.frequency).toBe(3);
    });

    it('number 1 appears 4 times → hidden tendency', () => {
      const t1 = analysis.hiddenTendencies.find((t) => t.number === 1);
      expect(t1).toBeDefined();
      expect(t1?.frequency).toBe(4);
    });

    it('numbers 3 and 4 (freq < 3) are NOT tendencies', () => {
      const nums = analysis.hiddenTendencies.map((t) => t.number);
      expect(nums).not.toContain(3);
      expect(nums).not.toContain(4);
    });
  });

  // ── Life Cycles ─────────────────────────────────────────────────────────
  describe('lifeCycles', () => {
    it('returns 3 cycles', () => expect(analysis.lifeCycles).toHaveLength(3));

    it('1st cycle: Formativo, number=3, ends at 31', () => {
      const c = analysis.lifeCycles[0]!;
      expect(c.name).toBe('Formativo');
      expect(c.number).toBe(3);
      expect(c.startAge).toBe(0);
      expect(c.endAge).toBe(31);
    });

    it('2nd cycle: Produtivo, number=6, 31→58', () => {
      const c = analysis.lifeCycles[1]!;
      expect(c.name).toBe('Produtivo');
      expect(c.number).toBe(6);
      expect(c.startAge).toBe(31);
      expect(c.endAge).toBe(58);
    });

    it('3rd cycle: Colheita, number=5, 58→null', () => {
      const c = analysis.lifeCycles[2]!;
      expect(c.name).toBe('Colheita');
      expect(c.number).toBe(5);
      expect(c.startAge).toBe(58);
      expect(c.endAge).toBeNull();
    });
  });

  // ── Challenges ──────────────────────────────────────────────────────────
  describe('challenges', () => {
    // month=3, day=6, year=5
    // C1=|3-6|=3, C2=|6-5|=1, CMain=|3-1|=2, CFinal=3+6+5=14
    it('Desafio 1 = 3', () => expect(analysis.challenges[0]?.number).toBe(3));
    it('Desafio 2 = 1', () => expect(analysis.challenges[1]?.number).toBe(1));
    it('Desafio Principal = 2', () => expect(analysis.challenges[2]?.number).toBe(2));
    it('Desafio Final = 14 (not reduced)', () => expect(analysis.challenges[3]?.number).toBe(14));
  });

  // ── Maturity ────────────────────────────────────────────────────────────
  describe('maturity', () => {
    // Destiny(5) + Mission(6) = 11 → master
    it('result = 11 (master)', () => expect(analysis.maturity.result).toBe(11));
    it('isMasterNumber = true', () => expect(analysis.maturity.isMasterNumber).toBe(true));
  });

  // ── Personal Periods (reference: 15/06/2026) ────────────────────────────
  describe('personalPeriods', () => {
    it('referenceDate is 15/06/2026', () => {
      expect(analysis.personalPeriods.referenceDate).toEqual({
        day: 15,
        month: 6,
        year: 2026,
      });
    });

    it('personalYear: digits(15)+digits(3)+digits(2026)', () => {
      // 1+5=6 from day, 3 from month, 2+0+2+6=10 from year
      // raw = 6+3+10=19 → karmic debt 19 → result 1
      const py = analysis.personalPeriods.personalYear;
      expect(py.result).toBe(1);
      expect(py.karmicDebt).toBe(19);
    });

    it('personalMonth = personalYear(1) + currentMonth(6) = 7', () => {
      // 1+6=7
      expect(analysis.personalPeriods.personalMonth.result).toBe(7);
    });

    it('personalDay = personalMonth(7) + currentDay(15) = 7+15=22 → master 22', () => {
      // 7+15=22 → master
      expect(analysis.personalPeriods.personalDay.result).toBe(22);
      expect(analysis.personalPeriods.personalDay.isMasterNumber).toBe(true);
    });
  });
});

describe('FullAnalysis — with current name', () => {
  const inputWithCurrent: AnalysisInput = {
    birthName: 'MARIA SILVA',
    currentName: 'MARIA SANTOS',
    birthDate: { day: 15, month: 3, year: 1985 },
    referenceDate: { day: 15, month: 6, year: 2026 },
  };

  const a = engine.analyze(inputWithCurrent);

  it('motivation differs from soul when current name is set', () => {
    // MARIA SANTOS vowels: A(1),I(9),A(1),A(1),O(6) = 18→9
    // Soul = 3, Motivation ≠ 3 (unless by coincidence — here it's 9)
    expect(a.motivation.result).not.toBe(a.soul.result);
  });

  it('impression differs from personality when current name is set', () => {
    // MARIA SANTOS consonants: M(4),R(9),S(1),N(5),T(2),S(1) = 22 → master 22
    expect(a.impression.result).toBe(22);
    expect(a.impression.isMasterNumber).toBe(true);
  });
});
