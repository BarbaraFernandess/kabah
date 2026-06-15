/**
 * Soul (Alma) Calculator
 *
 * Formula: sum of VOWEL values in the birth name (particles excluded).
 *
 * Example: "MARIA SILVA"
 *   Vowels: A(1), I(9), A(1) [MARIA] + I(9), A(1) [SILVA] = 1+9+1+9+1 = 21 → 2+1 = 3
 */

import type { CalculationTrace } from '../types/index.js';
import { buildTrace, sumLetterValues, letterFormula } from './base.calculator.js';

/**
 * Calculate the Soul (Alma) number from the vowel letter values
 * of the birth name (particles already excluded).
 *
 * @param vowelValues  Letter-value pairs for vowels only.
 */
export function calculateSoul(
  vowelValues: { letter: string; value: number }[],
): CalculationTrace {
  const { total, steps } = sumLetterValues(vowelValues);
  const formula = letterFormula(vowelValues, total);

  return buildTrace(
    total,
    steps,
    formula,
    'Alma: soma dos valores das VOGAIS do nome completo de nascimento (partículas excluídas). Verificar débitos kármicos.',
  );
}
