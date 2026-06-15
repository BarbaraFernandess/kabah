/**
 * Motivation (Motivação) Calculator
 *
 * If a current name is provided: sum of VOWEL values in the current name.
 * Otherwise: equals the Soul (Alma) result from the birth name.
 */

import type { CalculationTrace } from '../types/index.js';
import { buildTrace, sumLetterValues, letterFormula } from './base.calculator.js';

/**
 * Calculate the Motivation (Motivação) number.
 *
 * @param vowelValues  Vowel letter-value pairs from the current name
 *                     (particles already excluded). Pass empty array + soulTrace
 *                     when there is no current name.
 * @param soulTrace    Soul trace to fall back to when `vowelValues` is empty
 *                     (i.e., no current name was provided).
 */
export function calculateMotivation(
  vowelValues: { letter: string; value: number }[],
  soulTrace: CalculationTrace,
): CalculationTrace {
  if (vowelValues.length === 0) {
    // No current name → equal to Soul
    return {
      ...soulTrace,
      methodologicalNote:
        'Motivação: nome atual não informado; igual à Alma (vogais do nome de nascimento).',
    };
  }

  const { total, steps } = sumLetterValues(vowelValues);
  const formula = letterFormula(vowelValues, total);

  return buildTrace(
    total,
    steps,
    formula,
    'Motivação: soma das VOGAIS do nome atual (partículas excluídas). Verificar débitos kármicos.',
  );
}
