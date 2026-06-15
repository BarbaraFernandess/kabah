/**
 * Mission (Missão) Calculator
 *
 * Formula: sum of ALL letter values in the birth name (particles excluded).
 *
 * Example: "MARIA SILVA"
 *   M(4)+A(1)+R(9)+I(9)+A(1) + S(1)+I(9)+L(3)+V(4)+A(1) = 42 → 4+2 = 6
 */

import type { CalculationTrace } from '../types/index.js';
import { buildTrace, sumLetterValues, letterFormula } from './base.calculator.js';

/**
 * Calculate the Mission (Missão) number from the birth-name letter values
 * (particles already excluded).
 *
 * @param letterValues  All letter-value pairs from the filtered birth name.
 */
export function calculateMission(
  letterValues: { letter: string; value: number }[],
): CalculationTrace {
  const { total, steps } = sumLetterValues(letterValues);
  const formula = letterFormula(letterValues, total);

  return buildTrace(
    total,
    steps,
    formula,
    'Missão: soma de todos os valores das letras do nome completo de nascimento (partículas excluídas). Verificar débitos kármicos.',
  );
}
