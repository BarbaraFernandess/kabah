/**
 * Impression (Impressão) Calculator
 *
 * If a current name is provided: sum of CONSONANT values in the current name.
 * Otherwise: equals the Personality (Personalidade) result from the birth name.
 */

import type { CalculationTrace } from '../types/index.js';
import { buildTrace, sumLetterValues, letterFormula } from './base.calculator.js';

/**
 * Calculate the Impression (Impressão) number.
 *
 * @param consonantValues  Consonant letter-value pairs from the current name
 *                         (particles already excluded). Pass empty array +
 *                         personalityTrace when there is no current name.
 * @param personalityTrace Personality trace to fall back to when
 *                         `consonantValues` is empty.
 */
export function calculateImpression(
  consonantValues: { letter: string; value: number }[],
  personalityTrace: CalculationTrace,
): CalculationTrace {
  if (consonantValues.length === 0) {
    // No current name → equal to Personality
    return {
      ...personalityTrace,
      methodologicalNote:
        'Impressão: nome atual não informado; igual à Personalidade (consoantes do nome de nascimento).',
    };
  }

  const { total, steps } = sumLetterValues(consonantValues);
  const formula = letterFormula(consonantValues, total);

  return buildTrace(
    total,
    steps,
    formula,
    'Impressão: soma das CONSOANTES do nome atual (partículas excluídas). Verificar débitos kármicos.',
  );
}
