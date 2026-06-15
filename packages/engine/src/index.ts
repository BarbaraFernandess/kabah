/**
 * @kabah/engine — Kabalistic Numerology Engine (Sonia Café methodology)
 *
 * Entry point: exports NumerologyEngine class and all public types.
 */

export type {
  CalculationStep,
  CalculationTrace,
  NameAnalysis,
  BirthDate,
  AnalysisInput,
  LifeCycle,
  Challenge,
  PersonalPeriods,
  FullAnalysis,
} from './types/index.js';

export type { KarmicDebtEntry } from './calculators/karmic-debts.calculator.js';
export type { HiddenTendency } from './calculators/hidden-tendencies.calculator.js';
export type { LetterAnalysis } from './tables/letter-table.js';

export { numerologyConfig } from './config/numerology.config.js';

import type { AnalysisInput, BirthDate, FullAnalysis, NameAnalysis } from './types/index.js';
import { normalizeName, extractLetters } from './normalizers/name.normalizer.js';
import { analyzeLetters, getLetterValue, isVowel, isConsonant } from './tables/letter-table.js';
import { calculateDestiny } from './calculators/destiny.calculator.js';
import { calculateMission } from './calculators/mission.calculator.js';
import { calculateSoul } from './calculators/soul.calculator.js';
import { calculatePersonality } from './calculators/personality.calculator.js';
import { calculateExpression } from './calculators/expression.calculator.js';
import { calculateMotivation } from './calculators/motivation.calculator.js';
import { calculateImpression } from './calculators/impression.calculator.js';
import { calculateKarmicLessons } from './calculators/karmic-lessons.calculator.js';
import { collectKarmicDebts } from './calculators/karmic-debts.calculator.js';
import { calculateHiddenTendencies } from './calculators/hidden-tendencies.calculator.js';
import { calculateLifeCycles } from './calculators/life-cycles.calculator.js';
import { calculateChallenges } from './calculators/challenges.calculator.js';
import { calculateMaturity } from './calculators/maturity.calculator.js';
import { calculatePersonalPeriods } from './calculators/personal-periods.calculator.js';

/** Today's date as a BirthDate object. */
function today(): BirthDate {
  const d = new Date();
  return { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() };
}

/**
 * Build a NameAnalysis for the given (already-normalised, particle-filtered)
 * array of words.
 */
function buildNameAnalysis(
  originalName: string,
  filteredWords: string[],
  allWords: string[],
): NameAnalysis {
  const normalizedName = allWords.join(' ');
  const letters = extractLetters(filteredWords);
  const { vowels, consonants, letterValues, numberFrequency } = analyzeLetters(letters);

  return {
    originalName,
    normalizedName,
    letters,
    vowels,
    consonants,
    letterValues,
    numberFrequency,
  };
}

/**
 * Extract vowel and consonant letter-value pairs from a set of filtered words.
 */
function partitionLetterValues(filteredWords: string[]): {
  vowelValues: { letter: string; value: number }[];
  consonantValues: { letter: string; value: number }[];
  allValues: { letter: string; value: number }[];
} {
  const letters = extractLetters(filteredWords);
  const vowelValues: { letter: string; value: number }[] = [];
  const consonantValues: { letter: string; value: number }[] = [];
  const allValues: { letter: string; value: number }[] = [];

  for (const letter of letters) {
    const value = getLetterValue(letter);
    if (value === null) continue;

    allValues.push({ letter, value });
    if (isVowel(letter)) {
      vowelValues.push({ letter, value });
    } else if (isConsonant(letter)) {
      consonantValues.push({ letter, value });
    }
  }

  return { vowelValues, consonantValues, allValues };
}

/**
 * Main orchestrator for Kabalistic Numerology analysis.
 *
 * All methods are pure functions — no internal state is stored.
 * Instantiate once and call `analyze()` as many times as needed.
 */
export class NumerologyEngine {
  /**
   * Perform a full numerological analysis.
   *
   * @param input  Birth name, optional current name, birth date, and optional
   *               reference date (defaults to today).
   */
  analyze(input: AnalysisInput): FullAnalysis {
    const referenceDate = input.referenceDate ?? today();

    // ── Birth name normalisation ────────────────────────────────────────────
    const { words: birthWords, filtered: birthFiltered } = normalizeName(input.birthName);
    const nameAnalysis = buildNameAnalysis(input.birthName, birthFiltered, birthWords);

    const {
      vowelValues: birthVowelValues,
      consonantValues: birthConsonantValues,
      allValues: birthAllValues,
    } = partitionLetterValues(birthFiltered);

    // ── Core calculations ───────────────────────────────────────────────────
    const destiny = calculateDestiny(input.birthDate);
    const mission = calculateMission(birthAllValues);
    const soul = calculateSoul(birthVowelValues);
    const personality = calculatePersonality(birthConsonantValues);
    const expression = calculateExpression(destiny.result, mission.result);
    const maturity = calculateMaturity(destiny.result, mission.result);

    // ── Current name (optional) ─────────────────────────────────────────────
    let currentVowelValues: { letter: string; value: number }[] = [];
    let currentConsonantValues: { letter: string; value: number }[] = [];

    if (input.currentName) {
      const { filtered: currentFiltered } = normalizeName(input.currentName);
      const partitioned = partitionLetterValues(currentFiltered);
      currentVowelValues = partitioned.vowelValues;
      currentConsonantValues = partitioned.consonantValues;
    }

    const motivation = calculateMotivation(currentVowelValues, soul);
    const impression = calculateImpression(currentConsonantValues, personality);

    // ── Supplementary calculations ──────────────────────────────────────────
    const karmicLessons = calculateKarmicLessons(nameAnalysis.numberFrequency);
    const karmicDebts = collectKarmicDebts({ destiny, mission, soul, personality });
    const hiddenTendencies = calculateHiddenTendencies(nameAnalysis.numberFrequency);
    const lifeCycles = calculateLifeCycles(input.birthDate, destiny.result);
    const challenges = calculateChallenges(input.birthDate);
    const personalPeriods = calculatePersonalPeriods(input.birthDate, referenceDate);

    return {
      input,
      nameAnalysis,
      destiny,
      mission,
      soul,
      personality,
      expression,
      motivation,
      impression,
      karmicLessons,
      karmicDebts,
      hiddenTendencies,
      lifeCycles,
      challenges,
      maturity,
      personalPeriods,
    };
  }
}
