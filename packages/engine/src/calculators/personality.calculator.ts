/**
 * Personality (Personalidade) Calculator
 *
 * Formula: sum of CONSONANT values in the birth name (particles excluded).
 *
 * Example: "MARIA SILVA"
 *   Consonants: M(4), R(9) [MARIA] + S(1), L(3), V(4) [SILVA] = 4+9+1+3+4 = 21 → 2+1 = 3
 */

import type { CalculationTrace } from '../types/index.js';
import { buildTrace, sumLetterValues, letterFormula } from './base.calculator.js';

/**
 * Calculate the Personality (Personalidade) number from the consonant letter
 * values of the birth name (particles already excluded).
 *
 * @param consonantValues  Letter-value pairs for consonants only.
 */
export function calculatePersonality(
  consonantValues: { letter: string; value: number }[],
): CalculationTrace {
  const { total, steps } = sumLetterValues(consonantValues);
  const formula = letterFormula(consonantValues, total);

  return buildTrace(
    total,
    steps,
    formula,
    'Personalidade: soma dos valores das CONSOANTES do nome completo de nascimento (partículas excluídas). Verificar débitos kármicos.',
  );
}
