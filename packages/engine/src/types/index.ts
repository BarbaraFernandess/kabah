/**
 * Core TypeScript types for the Kabalistic Numerology engine.
 */

/** A single step inside a calculation trace */
export type CalculationStep = {
  description: string;
  value: number | string;
};

/**
 * Full trace of a numeric calculation — result, formula, steps and
 * methodological reference so every output is auditable.
 */
export type CalculationTrace = {
  /** Final reduced (or master) number */
  result: number;
  /** Whether the result is a master number (11, 22, 33) */
  isMasterNumber: boolean;
  /** Set when a karmic-debt number (13, 14, 16, 19) was found before reduction */
  karmicDebt?: number;
  /** Human-readable formula string */
  formula: string;
  /** Ordered list of calculation steps */
  steps: CalculationStep[];
  /** Reference to the methodological rule applied */
  methodologicalNote: string;
};

/** Analysis of a name string */
export type NameAnalysis = {
  originalName: string;
  normalizedName: string;
  /** All letters (no spaces, no particles) */
  letters: string[];
  vowels: string[];
  consonants: string[];
  /** Each letter paired with its numerological value */
  letterValues: { letter: string; value: number }[];
  /** How many times each digit (1-9) appears in the name */
  numberFrequency: Record<number, number>;
};

/** Gregorian birth (or reference) date */
export type BirthDate = {
  day: number;
  month: number;
  year: number;
};

/** Input to the full numerological analysis */
export type AnalysisInput = {
  /** Full birth name, as registered */
  birthName: string;
  /** Current social name (optional) */
  currentName?: string;
  /** Nicknames or alternative names (optional) */
  nicknames?: string[];
  birthDate: BirthDate;
  /** Reference date for Personal Year / Month / Day calculations. Defaults to today. */
  referenceDate?: BirthDate;
};

/** One of the three life cycles */
export type LifeCycle = {
  number: number;
  isMasterNumber: boolean;
  /** "Formativo", "Produtivo" or "Colheita" */
  name: string;
  startAge: number;
  /** null means the cycle lasts for the rest of life */
  endAge: number | null;
  trace: CalculationTrace;
};

/** One of the four challenges */
export type Challenge = {
  number: number;
  name: string;
  trace: CalculationTrace;
};

/** Personal-period calculations anchored to a reference date */
export type PersonalPeriods = {
  personalYear: CalculationTrace;
  personalMonth: CalculationTrace;
  personalDay: CalculationTrace;
  referenceDate: BirthDate;
};

/** Complete numerological profile */
export type FullAnalysis = {
  input: AnalysisInput;
  nameAnalysis: NameAnalysis;
  destiny: CalculationTrace;
  mission: CalculationTrace;
  soul: CalculationTrace;
  personality: CalculationTrace;
  expression: CalculationTrace;
  motivation: CalculationTrace;
  impression: CalculationTrace;
  karmicLessons: number[];
  karmicDebts: { number: number; original: number; trace: CalculationTrace }[];
  hiddenTendencies: { number: number; frequency: number }[];
  lifeCycles: LifeCycle[];
  challenges: Challenge[];
  maturity: CalculationTrace;
  personalPeriods: PersonalPeriods;
};
