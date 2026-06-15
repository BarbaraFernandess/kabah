/**
 * Numerologia Cabalística - Sonia Café
 * Configuration as TypeScript constants for type-safe access.
 */

export const numerologyConfig = {
  version: '1.0.0',
  methodology: 'Numerologia Cabalística - Sonia Café',

  /** Hebrew adapted letter-value table */
  letterTable: {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
    J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
    S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
  } as Record<string, number>,

  /** Base vowels (before accent normalisation) */
  vowels: ['A', 'E', 'I', 'O', 'U'] as string[],

  /** Numbers that must NOT be reduced */
  masterNumbers: [11, 22, 33] as number[],

  /** Numbers that carry karmic weight before reduction */
  karmicDebtNumbers: [13, 14, 16, 19] as number[],

  /** Name particles ignored in all calculations */
  particles: ['DE', 'DA', 'DO', 'DOS', 'DAS', 'E'] as string[],

  /** Minimum frequency for a number to be a hidden tendency */
  hiddenTendencyThreshold: 3,

  lifeCycleFormulas: {
    /** First cycle ends at age (36 - Destiny) */
    firstCycleDurationBase: 36,
    /** Second cycle lasts 27 years */
    secondCycleDuration: 27,
  },

  /** Maps accented characters to their base ASCII equivalent */
  accentMap: {
    Á: 'A', À: 'A', Â: 'A', Ã: 'A', Ä: 'A',
    É: 'E', È: 'E', Ê: 'E', Ë: 'E',
    Í: 'I', Ì: 'I', Î: 'I', Ï: 'I',
    Ó: 'O', Ò: 'O', Ô: 'O', Õ: 'O', Ö: 'O',
    Ú: 'U', Ù: 'U', Û: 'U', Ü: 'U',
    Ç: 'C', Ñ: 'N',
  } as Record<string, string>,

  ambiguityFlags: {
    includeParticlesInDestiny: false,
    treatYAsVowel: false,
    masterNumber44: false,
    note: 'Flags configuráveis para ajuste metodológico futuro',
  },
} as const;

export type NumerologyConfig = typeof numerologyConfig;
