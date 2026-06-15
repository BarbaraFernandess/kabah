/**
 * Expression (Expressão) Calculator
 *
 * Formula: reduce(Destiny + Mission) → check karmic debts
 *
 * Example: destiny=5, mission=6 → 5+6=11 → master number 11!
 */

import type { CalculationTrace } from '../types/index.js';
import { buildTrace } from './base.calculator.js';
import type { CalculationStep } from '../types/index.js';

/**
 * Calculate the Expression (Expressão) number.
 *
 * @param destinyResult  Already-reduced Destiny number.
 * @param missionResult  Already-reduced Mission number.
 */
export function calculateExpression(
  destinyResult: number,
  missionResult: number,
): CalculationTrace {
  const rawSum = destinyResult + missionResult;

  const steps: CalculationStep[] = [
    { description: `Destino: ${destinyResult}`, value: destinyResult },
    { description: `Missão: ${missionResult}`, value: missionResult },
    {
      description: `Soma: ${destinyResult} + ${missionResult} = ${rawSum}`,
      value: rawSum,
    },
  ];

  const formula = `Destino(${destinyResult}) + Missão(${missionResult}) = ${rawSum}`;

  return buildTrace(
    rawSum,
    steps,
    formula,
    'Expressão: Destino + Missão, reduzidos. Verificar débitos kármicos.',
  );
}
