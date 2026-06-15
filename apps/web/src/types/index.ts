export type CalculationStep = {
  description: string;
  value: number | string;
};

export type CalculationTrace = {
  result: number;
  isMasterNumber: boolean;
  karmicDebt?: number;
  formula: string;
  steps: CalculationStep[];
  methodologicalNote: string;
};

export type LifeCycle = {
  number: number;
  isMasterNumber: boolean;
  name: string;
  startAge: number;
  endAge: number | null;
  trace: CalculationTrace;
};

export type Challenge = {
  number: number;
  name: string;
  trace: CalculationTrace;
};

export type PersonalPeriods = {
  personalYear: CalculationTrace;
  personalMonth: CalculationTrace;
  personalDay: CalculationTrace;
  referenceDate: { day: number; month: number; year: number };
};

export type FullAnalysis = {
  input: {
    birthName: string;
    currentName?: string;
    nicknames?: string[];
    birthDate: { day: number; month: number; year: number };
  };
  nameAnalysis: {
    originalName: string;
    normalizedName: string;
    letters: string[];
    vowels: string[];
    consonants: string[];
    letterValues: { letter: string; value: number }[];
    numberFrequency: Record<string, number>;
  };
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

export type Analysis = {
  id: string;
  birthName: string;
  currentName?: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  result: FullAnalysis;
  createdAt: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
};
